const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    providerID: {
        required: true,
        type: String
    },
    reportType: {
        required: true,
        type: String
    },
    reportName: {
        required: true,
        type: String
    },
    data: {
        type: Array,
    }
}, { collection: 'Reports', timestamps: true });

const Report = mongoose.model('Report', dataSchema);

module.exports = { Report };