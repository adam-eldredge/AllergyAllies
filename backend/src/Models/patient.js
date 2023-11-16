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
    practiceID: {
        required: false,
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
        needsRetest: {
            type: Boolean,
            default: false,
        },
        needsRetestSnooze: {
            active: {
                type: Boolean,
                default: null,
            },
            dateOfSnooze: {
                type: Date,
                default: null,
            },
            snoozeDuration: {
                type: Number,
                default: null,
            }
        }
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