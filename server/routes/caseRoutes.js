const express = require('express')
const router = express.Router()
const casesController = require('../controllers/casesController')

router.route('/')
    .get(casesController.getAllCases)
    .post(casesController.createCase)
    .patch(casesController.updateCase)
    .delete(casesController.deleteCase)

module.exports = router