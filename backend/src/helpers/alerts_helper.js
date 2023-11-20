const Patient = require('../Models/patient');

function checkExpiration(bottle) {
    // expiration check
    const currentDate = new Date();
    const flagExpirationDate = new Date();
    const alertDaysPrior = 10;
    flagExpirationDate.setTime(bottle.expirationDate - (alertDaysPrior * 24 * 60 * 60 * 1000));

    return (currentDate >= flagExpirationDate) && !bottle.needsRefill;
}

async function needsRetestSnoozeCheck(patientTemp) {

    const patient = await Patient.findById(patientTemp._id);
    if (!patient || !patient.needsRetestData || !patient.needsRetestData.needsRetestSnooze) {
        return;
    } 

    const dateOfSnooze = patient.needsRetestData.needsRetestSnooze.dateOfSnooze;
    const snoozeDuration = patient.needsRetestData.needsRetestSnooze.snoozeDuration;

    const snoozeExpirationDate = new Date(dateOfSnooze);
    snoozeExpirationDate.setDate(snoozeExpirationDate.getDate() + snoozeDuration);

    const today = new Date();

    if (today > snoozeExpirationDate) {
        patient.needsRetestData.needsRetestSnooze.active = false;
        await patient.save();
    }
}

async function updateBottleStatus(bottle, needsRefill, bottleStatus) {
    bottle.needsRefill = needsRefill;
    bottle.bottleStatus = bottleStatus;
    try {
        await bottle.save();
    } catch (error) {
        console.error("Error saving bottle: ", error);
    }
}

module.exports = {
    checkExpiration,
    needsRetestSnoozeCheck,
    updateBottleStatus
}