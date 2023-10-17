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
    NPI: {
        required: true,
        type: Number
    },
    nameOfPractice: {
        required: true,
        type: String
    },
    practiceID: {
        required: true,
        type: Number
    }
}, { collection: 'Providers' })

module.exports = mongoose.model('provider', dataSchema)