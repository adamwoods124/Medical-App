const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Patient', patientSchema)