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
        type: Date
    },

    treatments: {
        required: false,
        type: [mongoose.Schema.Types.ObjectId],
    },
    maintenanceBottleNumber: {pollenMaintenanceBottle: Number, insectsAndPetsMaintenanceBottle: Number, moldsMaintenanceBottle: Number},

    NPI: {
        require: false,
        type: Number,
    },
    // DEFAULT, INACTIVE, MAINTENANCE, ATTRITION
    status: {
        require: true,
        type: String,
    },
    statusTime: {
        require: true,
        type: Date
    },
    tokens: {
        type: Number,
        default: 0
    }

}, { collection: 'Patients' })

module.exports = mongoose.model('Patient', dataSchema)