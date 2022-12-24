const {login, refresh, logout} = require('../controllers/Auth')
const router = require('express').Router()

router.route('/')
    .post(login)

router.route('/refresh')
    .get(refresh)
    
    router.route('/logout')
        .get(logout)

    module.exports = router
