const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    DoB: {
        required: false,
        type: Date
    }
}, { collection: 'Patients' })

module.exports = mongoose.model('Patient', dataSchema)