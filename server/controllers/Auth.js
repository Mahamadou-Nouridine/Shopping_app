const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const clientModel = require('../models/client')

const login = async (req, res) => {
    console.log("in login");
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({
        message: 'All fiel are reqired'
    })

    const client = await clientModel.findOne({ email: email }).lean().exec()
    if (!client) return res.status(400).json({ message: 'no clein found' })
    const match = await bcrypt.compare(password, client.password);
    if (!match) return res.status(400).json({ message: 'incorrect password' })
    const returnedClient = await clientModel.findOne({ email: email }).select('-password').lean().exec()

    const accessTocken = jwt.sign(
        {

            "name": client.name,
            "email": client.email

        },
        process.env.ACCESS_TOCKEN,
        {
            expiresIn: '15m'
        }
    )

    const refreshTocken = jwt.sign(
        {

            "name": client.name,
            "email": client.email

        },
        process.env.REFRESH_TOCKEN,
        {
            expiresIn: '7d'
        }
    )

    res.cookie(
        'jwt',
        refreshTocken,
        {
            httpOnly: true, //accessible only by web server
            secure: false, //https
            sameSite: false, //cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
            domain: 'localhost',

        }
    )
    return res.send({ accessTocken, client: returnedClient })
}

const refresh = (req, res) => {
    const cookies = req.cookies
    console.log(cookies.jwt);
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOCKEN,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })


            const foundUser = await clientModel.findOne({ email: decoded.email }).select('-password').lean().exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized no client found', decoded })

            const accessToken = jwt.sign(
                {

                    "username": foundUser.name,
                    "email": foundUser.email

                },
                process.env.ACCESS_TOCKEN,
                { expiresIn: '15m' }
            )

            res.send({ accessToken, client: foundUser })
        }
    )
}

const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}
