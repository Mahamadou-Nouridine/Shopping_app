const router = require('express').Router()
const createClient = require('../controllers/client')

router.route('/')
.post(createClient)

module.exports = router