const User = require('../models/User')
const Case = require('../models/Case')

// @desc Get all cases
// @route GET /cases
// @access Private
const getAllCases = async (req, res) => {
    const cases = await Case.find().lean()
    if (!cases?.length) {
        return res.status(400).json({ message: 'No cases found' })
    }

    // Add username to each note before sending
    const casesWithUsername = await Promise.all(cases.map(async (_case) => {
        const usernames = (await User.find({ _id: { $in: _case.users}}, 'username').lean().exec()).map(user => user.username)
        return { ..._case, usernames}
    }))
    res.json(casesWithUsername)
}

// @desc Create new case
// @route POST /cases
// @access Private
const createCase = async (req, res) => {
    const { users, patient, roomNum, symptoms, notes } = req.body
    // Confirm data
    if (!users || !patient || !roomNum ) {
        return res.status(400).json({ message: 'Required fields missing' })
    }

    // Check for duplicate title
    const duplicate = await Case.findOne({ roomNum }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Room occupied' })
    }

    // Create and store the new case 
    const _case = await Case.create({ users, patient, roomNum, symptoms, notes })

    if (_case) { // Created 
        return res.status(201).json({ message: 'New case created' })
    } else {
        return res.status(400).json({ message: 'Invalid case data received' })
    }

}

// @desc Update a case
// @route PATCH /case
// @access Private
const updateCase = async (req, res) => {
    const { id, users, patient, roomNum, symptoms, notes, completed } = req.body

    // Confirm data
    if (!id || !users || !patient || !roomNum || !symptoms || !notes || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const _case = await Case.findById(id).exec()

    if (!_case) {
        return res.status(400).json({ message: 'Case not found' })
    }

    // Check for duplicate
    const duplicate = await Case.findOne({ roomNum }).lean().exec()
    // Allow updates to original note
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Room already occupied' })
    }

    _case.users = users
    _case.patient = patient
    _case.roomNum = roomNum
    _case.symptoms = symptoms
    _case.notes = notes
    _case.completed = completed

    const updatedCase = await _case.save()

    res.json({ message: `Info for patient in room ${roomNum} updated`})
}

// @desc Delete a case
// @route DELETE /cases
// @access Private
const deleteCase = async (req, res) => {
    const { id } = req.body

    // Make sure note exists
    if (!id) {
        return res.status(400).json({ message: 'Case ID Required'})
    }

    const _case = await Case.findById(id).exec()

    if (!_case) {
        return res.status(400).json({ message: 'Case not found'})
    }
    
    const reply = `Case ${_case.title} with ID ${_case.id} deleted`

    const result = await _case.deleteOne()

    if (!result.acknowledged) {
        return res.status(400).json({ message: 'Error deleting case'})
    }

    res.json(reply)
}

module.exports = { getAllCases, createCase, updateCase, deleteCase }