const jwt = require('jsonwebtoken')


const verifyJwt = async (req, res, next)=>{
    const Auth = req.headers.authorization||req.headers.Authorization

    if(!Auth.startsWith('debut')) return res.status(401).json({message: "unauthorized"})

    const token = Auth.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOCKEN,
        (error, decoded)=>{
            if(error) return res.status(400).json({message: 'Unauthorized'})
            req.body.name = decoded.name;
            req.body.email = decoded.email;
            next()
        }
    )

}

module.exports = verifyJwt