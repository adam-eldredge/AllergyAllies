const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    practiceID: {
        type: String
    },
    patientName: {
        type: String
    },
    alertType: {
        type: String
    },
    date: {
        type: Date
    }
}, { collection: 'ProviderAlerts'});

module.exports = mongoose.model('alert', alertSchema);