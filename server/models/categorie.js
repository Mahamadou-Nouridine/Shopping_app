const mongoose = require('mongoose')
const product = require('./product')


const categorie = new  mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    products:[product]
})

module.exports = mongoose.model('categorie', categorie)