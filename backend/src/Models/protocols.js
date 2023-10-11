const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    NPI: {
        required: true,
        type: String
    },
    startingInjectionFrequency: {
        required: true,
        type: Number,
    },
    appointmentSchedule: {
        required: true,
        type: String
    },
    automaticDoseAdvancements: {
        required: true,
        type: String
    },
    doseAdjustments: {
        required: true,
        type: Number,
    },
    generalAdjustments: {
        required: true,
        type: Number,
    },
    doseAdjustmentDefaults: {
        required: true,
        type: Number,
    }
}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)