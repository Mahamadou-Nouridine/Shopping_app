const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    date:{
        type: String,
        required: true,
    },
    product_name:{
        type: String,
        required: true
    },
    product_category:{
        type: String,
        required: true
    },
    
    product_price:{
        type: Number,
        required: true
    },
    number:{
        type: Number,
        required: true
    }

})