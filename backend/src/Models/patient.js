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
    phone: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    DoB: {
        required: false,
        type: String
    },
    height: {
        required: false,
        type: String
    },
    weight: {
        required: false,
        type: String
    },
    treatments: {
        required: false,
        type: [ String ], /*mongoose.Schema.Types.ObjectId*/
    },
    treatmentStartDate: {
        required: false,
        type: String
    },
    // use this instead of protocols
    maintenanceBottleNumber: {
        required: false,
        type: [{
            nameOfBottle: String,
            maintenanceNumber: Number,
        }],
    },
    providerID: {
        require: false,
        type: String,
    },
    // DEFAULT, INACTIVE, MAINTENANCE, ATTRITION
    status: {
        require: true,
        type: String,
    },
    statusDate: {
        require: true,
        type: Date
    },
    tokens: {
        type: Number,
        default: 0
    },
    needsRetestData: {
        type: {
            needsRetest: Boolean,
            needsRetestSnooze: {
                active: Boolean,
                dateOfSnooze: Date,
                snoozeDuration: Number,
            },
        },
        required: false,
    },
    allergyMedication:{
        type: [{
            name: String,
            dose: String,
            frequency: String
        }]
    }

}, { collection: 'Patients' })

module.exports = mongoose.model('Patient', dataSchema)