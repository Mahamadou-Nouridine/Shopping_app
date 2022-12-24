const router = require('express').Router()
const {getProducts} = require('../controllers/product')

router.route('/')
                .get(getProducts)
module.exports = router