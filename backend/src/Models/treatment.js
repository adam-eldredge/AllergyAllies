const mongoose = require('mongoose');

// can put injVol sum each time new report is made to help
// calculate when refill needed

const dataSchema = new mongoose.Schema({
    nameOfPractice: {
        required: true,
        type: String
    },
    providerID: {
        type: String
    },
    NPI: {
        required: false,
        type: Number
    },
    patientLastName: {
        required: true,
        type: String
    },
    patientFirstName: {
        required: true,
        type: String
    },
    patientID: {
        required: true,
        type: String
    },
    bottles: {
        required: false,
        type: [{
            nameOfBottle: String,
            injVol: Number,
            injDilution: Number,
            injLLR: Number,
            currBottleNumber: String,
            date: Date,
            currentDoseAdvancement: Number,
            adverseReaction: Boolean,
            locationOfInjection: String,
            needsVialTest: Boolean,
            needsRefill: Boolean,
            // DEFAULT, NEEDS_MIX, EXPIRING
            bottleStatus: String,
            expirationDate: Date,
        }],
    },
    lastVialTests: {
        type: Map,
        of: new mongoose.Schema({
            name: String,
            values: {
                dilution: Number, 
                bottleNumber: String, 
                whealSize: Number,
                // needs implementation
                date: Date,
            }
        })
    },
    nextVialTests:{
        type: Map,
        of: new mongoose.Schema({
            name: String,
            values: {
                dilution: Number, 
                bottleNumber: String, 
                whealSize: Number
            }
        })
    },
    date: {
        required: true,
        type: Date
    },
    attended: {
        required: true,
        type: Boolean
    },
}, { collection: 'Treatments' })

module.exports = mongoose.model('treatment', dataSchema)
