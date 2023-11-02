const epipenInfo = new mongoose.Schema({
    applicable: {
        required: true,
        type: Boolean
    },
    expirationDate: {
        required: false,
        type: Date
    },
    //HH:MM AM/PM
    reminderTime: {
        required: true,
        type: String
    },
    lastSnoozeTime: {
        required: false,
        type: Date
    },
    snoozeDuration: {
        type: 10
    },
    dismissed: {
        required: true,
        type: false,
    },
    dismissalTime: {
        required: false,
        type: Date
    }
});

// 
const allergyDrops = new mongoose.Schema({
    bottleNumber: {
        type: false
    },
    maintenanceBottleNumber: {
        type: false
    },
    dailyDoseFrequency: {
        type: Number
    },
    reminderTimes: {
        type: Array
    },
    doseAdministrationDates: {
        type: Array
    },
});