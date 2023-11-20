const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    providerID: {
        type: String
    },
    practiceID: {
        type: String
    },
    reportType: {
        type: String
    },
    reportName: {
        type: String
    },
    manual: {
        type: Boolean
    },
    formattedDate: {
        type: String,
    },
    data: {
        type: Array,
    }
}, { collection: 'Reports', timestamps: true });

const Report = mongoose.model('Report', dataSchema);

module.exports = { Report };