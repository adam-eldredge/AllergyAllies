const mongoose = require('mongoose');

const nextDoseAdjustments = new mongoose.Schema({
    startingInjectionInterval: {
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
    injectionVolumeDecrease: {
        required: true,
        type: Number,
    },
    decreaseVialConcentration: {
        required: true,
        type: Number,
    },
    decreaseBottleNumber: {
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
    decreaseInjectionVol: {
        required: true,
        type: Number,
    },
    decreaseVialConcentration: {
        required: true,
        type: Number,
    },
    decreaseBottleNumber: {
        required: true,
        type: Number,
    }
})

const vialTestReactionAdjustments = new mongoose.Schema({
    whealLimitToProceedWithInjection: {
        required: true,
        type: Number,
    },
    whealLevelAdjustForVialTestReactions: {
        required: true,
        type: Number,
    },
    decreaseVialConcentration: {
        required: true,
        type: Number,
    },
    decreaseBottleNumber: {
        required: true,
        type: Number,
    },
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
    missedDoseAdjustment: missedDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
    vialTestReactionAdjustment: vialTestReactionAdjustments,
    
}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)