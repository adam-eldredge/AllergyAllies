const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    providerID: {
        type: Number
    },
    patientName: {
        type: String
    },
    alertType: {
        type: String
    }
}, { collection: 'ProviderAlerts'});

module.exports = mongoose.model('treatment', alertSchema);