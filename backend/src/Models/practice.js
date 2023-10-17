const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    practiceName: {
        required: true,
        type: String
    },
    providerNames: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    officeHours: {
        required: false,
        type: String
    },
    allergyShotHours: {
        required: true,
        type: Boolean
    }
}, { collection: 'Practices' })

module.exports = mongoose.model('practice', dataSchema)