const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence-generator')(mongoose)

const caseSchema = new mongoose.Schema(
    {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }], 
        patientName: {
            type: String,
            required: true
        },
        roomNum: {
            type: Number,
            required: true,
        },
        symptoms: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
        completed: {
            type: Boolean,
            default: false
        } 
    },
    {
        timestamps: true
    }
)

caseSchema.plugin(AutoIncrement, {
    inc_field: 'caseNum',
    id: 'caseNums',
    start_seq: 1000
})

module.exports = mongoose.model('Case', caseSchema)