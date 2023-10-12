const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const port = process.env.PORT|| 3800
const app = express()
const productsRoutes = require('./routes/product')
const clientRoute = require('./routes/client')
const authRoutes = require('./routes/auth')
const commandesRoutes = require('./routes/commandes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.json())
app.use(cookieParser());

app.use(cors(
    {
        origin: true,
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser())

app.get('/cookie', (req, res)=>{
    res.cookie("foo", "barr",
    {
        httpOnly: true, //accessible only by web server
        secure: false, //https
        sameSite: true, //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT

    }
    )
    res.send("cookie set successfully")
})
app.use('/auth', authRoutes)
app.use('/orders',commandesRoutes)
app.use('/client', clientRoute)
app.use('/products', productsRoutes)
app.use('/', async (req, res)=> {
    res.json({
        message: 'welcome to the site'
    })
})

mongoose.connect(process.env.DATA_URL)
mongoose.connection.once('open', ()=>{
    console.log('Connecté à mongodb');
    app.listen(port, ()=>{
        console.log(`server running on port ${port}`);

    })
})

