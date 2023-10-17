const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    practiceName: {
        required: true,
        type: String
    },
    practiceAddress: {
        required: true,
        type: String
    },
    antigensTested: {
        required: true,
        type: String
    },
    logo: {
        required: false,
        type: String
    },
    scrollingAds: {
        required: false,
        type: String
    },
    completedSurvey: {
        required: true,
        type: Boolean
    }
}, { collection: 'Practices' })

module.exports = mongoose.model('practice', dataSchema)