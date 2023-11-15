const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const patientsController = require('../controllers/patientsController')


router.route('/')
    .get(patientsController.getAllPatients)
    .post(patientsController.createPatient)
    .patch(patientsController.updatePatient)
    .delete(patientsController.deletePatient)