const mongoose = require('mongoose');

/* Commented below not need. Just using as guide for now  */

/*
// add more info about patient if needed
const patientSchema = new mongoose.Schema({
  patientName: {
    required: true,
    type: String,
  },
});


treatment pulls from practice protocol
provider adds new treatment
treatment id is added to patient
calculation done
next treatment generated


const approachingMaintenanceSchema = new mongoose.Schema({
    patientName: patientSchema,
    approachingMaintenance: {
        required: true,
        type: Boolean,
    }
});

// advance in injection
// vial test
const attritionSchema = new mongoose.Schema({
    patientName: patientSchema,
    attritionPercent: {
        required: true,
        type: Number,
    }
});

const allergyDropsRefillsSchema = new mongoose.Schema({
    patientName: patientSchema,
    needsDropsRefill: {
        required: true,
        type: Boolean
    }
});

//helper for allergyShotsRefill
const shotSpecificSchema = new mongoose.Schema({
    antigen: {
        required: true,
        type: String
    },
    needsRefill: {
        required: true,
        type: Boolean
    }
});

const allergyShotsRefillsSchema = new mongoose.Schema({
    patientName: patientSchema,
    shots: [shotSpecificSchema],
});

const epipensRefillsSchema = new mongoose.Schema({
    patientName: patientSchema,
    needsRefill: {
        required: true,
        type: Boolean
    }
});

const needsRetestSchema = new mongoose.Schema({
    patientName: patientSchema,
    needsRetest: {
        required: true,
        type: Boolean
    }
});

const tokensSchema = new mongoose.Schema({
    patientName: patientSchema,
    tokenAmount: {
        required: true,
        type: Number
    }
});

*/

const dataSchema = new mongoose.Schema({
    NPI: {
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