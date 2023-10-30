const mongoose = require('mongoose');

/* Needs Rework - for multiple vial/shot types */
const nextDoseAdjustments = new mongoose.Schema({
    // also known as injection frequency
    injectionInterval: {
        required: true,
        type: Number,
    },
    startingInjectionVol: {
        required: true,
        type: Number,
    },
    maxInjectionVol: {
        required: true,
        type: Number,
    },
    injectionVolumeIncreaseInterval: {
        required: true,
        type: Number,
    },
})

// may need multiple of these, for different missedDays values
const missedDoseAdjustments1 = new mongoose.Schema ({
    doseAdjustMissedDays: {
        required: true,
        type: Number,
    },
    adjustInjectionVolume: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    },
})

const missedDoseAdjustments2 = new mongoose.Schema ({
    doseAdjustMissedDays: {
        required: true,
        type: Number,
    },
    adjustInjectionVolume: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    },
})

const missedDoseAdjustments3 = new mongoose.Schema ({
    doseAdjustMissedDays: {
        required: true,
        type: Number,
    },
    adjustInjectionVolume: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    },
})

const missedDoseAdjustments4 = new mongoose.Schema ({
    doseAdjustMissedDays: {
        required: true,
        type: Number,
    },
    adjustInjectionVolume: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    },
})

// dose adjustments for skin reactions to medicine
const largeReactionsDoseAdjustments = new mongoose.Schema({
    whealLevelForAdjustment: {
        required: true,
        type: Number,
    },
    adjustInjectionVol: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    }
})

const vialTestReactionAdjustments = new mongoose.Schema({
    whealLimitToProceedWithInjection: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    },
})

const bottleSchema = new mongoose.Schema({
    bottleName: {
        require: true,
        type: String,
    },
    bottleSize: {
        require: true,
        type: Number
    },
    numbBottles: {
        require: true,
        type: Number
    },
    missedDoseAdjustment: missedDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
})

// we need default values 
const dataSchema = new mongoose.Schema({
    NPI: {
        required: true,
        type: String
    },
    appointmentSchedule: {
        required: true,
        type: String
    },

    nextDoseAdjustment: nextDoseAdjustments,
    missedDoseAdjustment1: missedDoseAdjustments1,
    missedDoseAdjustment2: missedDoseAdjustments2,
    missedDoseAdjustment3: missedDoseAdjustments3,
    missedDoseAdjustment4: missedDoseAdjustments4,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
    bottles: [bottleSchema],
    vialTestReactionAdjustment: vialTestReactionAdjustments,  

}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)