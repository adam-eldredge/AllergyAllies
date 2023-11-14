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
        required: false,
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

    allergyMedication:{
        type: [{
            name: String,
            dose: String,
            frequency: String
        }]
    }

}, { collection: 'Patients' })

module.exports = mongoose.model('Patient', dataSchema)