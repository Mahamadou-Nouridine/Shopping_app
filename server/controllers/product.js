const product  = require('../models/product')
const fs =require('fs')
const path = require('path')
/*
@get all products
@create a products
*/

const getProducts = async (req, res) =>{
    const products = await product.find().lean().exec()
    if(!products){
        return res.status(400).json({
            message : 'no product found'
        })
    }
     res.send(products)

}

module.exports = {
    getProducts
};