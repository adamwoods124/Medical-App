const Patient = require('../models/Patient')
const User = require('../models/User')
const Case = require('../models/Case')
const asyncHandler = require('express-async-handler')

// @desc Get all patients
// @route GET /patients
// @access Private
const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find().lean()
    if (!patients?.length) {
        return res.status(400).json({ message: 'No patients found' })
    }
    
    // Add assigned users to patient before sending
    const patientsWithAssignedUsers = await Promise.all(patients.map(async (patient) => {
        const assignedUsers = (await User.find({ _id: { $in: patient.assignedUsers }}).lean().exec()).map(user => user.username)
        return { ...patient, assignedUsers }
    }))
    console.log("getallpatients", patientsWithAssignedUsers)
    res.json(patientsWithAssignedUsers)
})

// @desc Create new patient
// @route POST /patients
// @access Private
const createPatient = asyncHandler(async (req, res) => {
    const { name, birthday, history, assignedUsers } = req.body
    // Confirm data
    if (!name || !birthday) {
        return res.status(400).json({ message: 'Required fields missing' })
    }

    // Check for duplicate name and birthday
    const duplicate = await Patient.findOne({ name, birthday }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ messagwe: 'Patient already exists' })
    }

    // Create and store new patient
    const patient = await Patient.create({ name, birthday, history, assignedUsers })

    if (patient) {
        return res.status(201).json({ message: `New patient ${name} created`})
    } else {
        res.status(400).json({ message: 'Invalid patient data received' })
    }
})

// @desc Update a patient
// @route PATCH /patients
// @access Private
const updatePatient = asyncHandler(async (req, res) => {
    const { id, name, birthday, assignedUsers, history } = req.body

    // Confirm data
    if (!id || !username || !Array.isArray(history) || !history.length || !Array.isArray(assignedUsers) || !assignedUsers.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const patient = await Patient.findById(id).exec()

    if (!patient) {
        return res.status(400).json({ message: 'Patient not found' })
    }

    // Check for duplicate
    const duplicate = await Patient.findOne({ name, birthday }).lean().exec()
    // Allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Patient with same name and birthday already exists' })
    }

    patient.name = name
    patient.birthday = birthday
    patient.history = history
    patient.assignedUsers = assignedUsers

    const updatedPatient = await patient.save()

    res.json({ message: `Info for patient ${updatedPatient.name} updated`})
})

// @desc Delete a patient
// @route DELETE /patients
// @access Private
const deletePatient = asyncHandler(async (req, res) => {
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
})

module.exports = { getAllPatients, createPatient, updatePatient, deletePatient }