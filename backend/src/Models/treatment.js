const mongoose = require('mongoose');

// can put injVol sum each time new report is made to help
// calculate when refill needed

const dataSchema = new mongoose.Schema({
    nameOfPractice: {
        required: true,
        type: String
    },
    NPI: {
        required: true,
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

    //These may be redundant or can replace medication
    // vialNames: {pollen: Boolean, insectsAndPets: Boolean, molds: Boolean},
    // medication: {
    //     required: true,
    //     type: String
    // },

    //These may be redundant or can replace dosage
    injVols: {pollenInj: Number, insectsAndPetsInj: Number, moldsInj: Number},
    // dosage: {
    //     required: true,
    //     type: String
    // },

    dilutions: {pollenDil: Number, insectsAndPetsDil: Number, moldsDil: Number},

    //Store as number or M for maintenance
    bottleNumbers: {pollenBottleNumber: String, insectsAndPetsBottleNumber: String, moldsBottleNumber: String},


    //These values needs to stay updated with each treatment TODO
    LLR: { pollenLLR: Number, insectsAndPetsLLR: Number, moldsLLR: Number},
    lastVialTests: {
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