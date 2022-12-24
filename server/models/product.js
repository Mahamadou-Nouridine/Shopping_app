const mongoose = require('mongoose')


var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});


const product  = new mongoose.Schema({
    categorie : String,
    name:{
        type: String,
        required: true
    },
    image: imageSchema,
    price:{
        type: Number,
        required:true
    }
})

module.exports = mongoose.model('product', product)