const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    DoB: {
        required: false,
        type: Date
    }
}, { collection: 'Patients' })

module.exports = mongoose.model('Patient', dataSchema)