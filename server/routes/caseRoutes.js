const express = require('express')
const router = express.Router()
const casesController = require('../controllers/casesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(casesController.getAllCases)
    .post(casesController.createCase)
    .patch(casesController.updateCase)
    .delete(casesController.deleteCase)

module.exports = router