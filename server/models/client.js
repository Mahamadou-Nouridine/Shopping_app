const mongoose   = require('mongoose')
const order = require('./order')


const client = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    order:{
        type: [order],
        required: false
    }
})


module.exports = mongoose.model('client', client)