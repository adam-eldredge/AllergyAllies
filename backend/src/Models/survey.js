const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    practiceID: {
        required: true,
        type: Number
    },
    surveyData: {
        required: true,
        type: String
    }
}, { collection: 'Surveys' })

module.exports = mongoose.model('survey', dataSchema)