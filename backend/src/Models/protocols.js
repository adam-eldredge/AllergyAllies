const mongoose = require('mongoose');

const nextDoseAdjustments = new mongoose.Schema({
    // also known as injection frequency
    injectionInterval: { // Num days before considered missed
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
    injectionVolumeIncreaseInterval: { // Injection increase interval
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
    range1: {
        days: {
            required: true,
            type: Number,
        },
        event: {
            required: true,
            type: String
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
    },
    range2: {
        days: {
            required: true,
            type: Number,
        },
        event: {
            required: true,
            type: String
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
    },
    range3: {
        days: {
            required: true,
            type: Number,
        },
        event: {
            required: true,
            type: String
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
    },
    range4: {
        days: {
            required: true,
            type: Number,
        },
        restartTreatment: {
            require: true,
            type: Boolean,
        }
    }
})

// dose adjustments for skin reactions to medicine
const largeReactionsDoseAdjustments = new mongoose.Schema({
    whealLevelForAdjustment: {
        required: true,
        type: Number,
    },
    event: {
        required: true,
        type: String
    },
    decreaseInjectionVol: {
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
    whealLevelForAdjustment: {
        required: true,
        type: Number,
    },
    event: {
        required: true,
        type: String
    },
    decreaseInjectionVol: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    }
})

const bottleSchema = new mongoose.Schema({
    bottleName: {
        require: true,
        type: String,
    },
    bottleSize: {
        require: false,
        type: Number
    },
    numbBottles: {
        require: false,
        type: Number
    }
})

// we need default values 
const dataSchema = new mongoose.Schema({
    practiceID: {
        required: true,
        type: String
    },
    NPI: {
        required: false,
        type: String
    },
    appointmentSchedule: {
        required: false,
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
    missedDoseAdjustment: missedDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,  
}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)