const mongoose = require('mongoose');

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
const missedDoseAdjustments = new mongoose.Schema ({
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
    //missedDoseAdjustment: missedDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
})

// we need default values 
const dataSchema = new mongoose.Schema({
    providerID: {
        required: true,
        type: String
    },
    practiceID: {
        required: true,
        type: String
    },
    appointmentSchedule: {
        required: true,
        type: String
    },
    nextDoseAdjustment: nextDoseAdjustments,
    missedDoseAdjustment1: missedDoseAdjustments,
    missedDoseAdjustment2: missedDoseAdjustments,
    missedDoseAdjustment3: missedDoseAdjustments,
    missedDoseAdjustment4: missedDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
    bottles: [bottleSchema],
    vialTestReactionAdjustment: vialTestReactionAdjustments,  

}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)