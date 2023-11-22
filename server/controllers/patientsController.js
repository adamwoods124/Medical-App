const Patient = require('../models/Patient')

// @desc Get all patients
// @route GET /patients
// @access Private
const getAllPatients = async (req, res) => {
    const patients = await Patient.find().lean()
    if (!patients?.length) {
        return res.status(400).json({ message: 'No patients found' })
    }
    res.json(patients)
}

// @desc Create new patient
// @route POST /patients
// @access Private
const createPatient = async (req, res) => {
    const { name, birthday } = req.body
    // Confirm data
    if (!name || !birthday) {
        return res.status(400).json({ message: 'Required fields missing' })
    }

    // Check for duplicate name and birthday
    const duplicate = await Patient.findOne({ name, birthday }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ messagwe: 'Patient already exists' })
    }

    // Create and store new patient
    const patient = await Patient.create({ name, birthday })

    if (patient) {
        return res.status(201).json({ message: `New patient ${name} created`})
    } else {
        res.status(400).json({ message: 'Invalid patient data received' })
    }
}

// @desc Update a patient
// @route PATCH /patients
// @access Private
const updatePatient = async (req, res) => {
    const { id, name, birthday } = req.body

    // Confirm data
    if (!id || !username ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const patient = await Patient.findById(id).exec()

    if (!patient) {
        return res.status(400).json({ message: 'Patient not found' })
    }

    // Check for duplicate
    const duplicate = await Patient.findOne({ name, birthday }).collation({ locale: 'en', strength: 2 }).lean().exec()
    // Allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Patient with same name and birthday already exists' })
    }

    patient.name = name
    patient.birthday = birthday

    const updatedPatient = await patient.save()

    res.json({ message: `Info for patient ${updatedPatient.name} updated`})
}

// @desc Delete a patient
// @route DELETE /patients
// @access Private
const deletePatient = async (req, res) => {
    const { id } = req.body

    // Make sure patient exists
    if (!id) {
        return res.status(400).json({ message: 'Patient ID Required' })
    }

    const patient = await Patient.findById(id).exec()

    if (!patient) {
        return res.status(400).json({ message: 'Patient not found' })
    }

    const reply = `Patient ${patient.name} deleted`

    const result = await patient.deleteOne()

    if (!result.acknowledged) {
        return res.status(400).json({ message: 'Error deleting patient' })
    }

    res.json(reply)
}

module.exports = { getAllPatients, createPatient, updatePatient, deletePatient }