const router = require('express').Router()
const {createCommande, deleteCommande}= require('../controllers/commande')
const verifyJwt =  require('../middlewares/checkjwt')

router.use(verifyJwt)
router.route('/new')
            .post(createCommande)
router.route('/delete')
            .post(deleteCommande)


module.exports = router