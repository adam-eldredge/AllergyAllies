const providerAlerts = require('../Models/alert');
const Patient = require('../Models/patient');
const { checkExpiration, needsRetestSnoozeCheck, updateBottleStatus} = require('../helpers/alerts_helper');

/* This file generates alerts for the provider and updates patient status*/

/* TODO:
    reaction alert creation
    injection needs mixed alert
    injection expiration alert
    perform vial test alert

    Any time the last Injection Volume reaches the Max IV set by the Practice, 
    there should be an alert to perform a Vial Test before the next injection 
    record can be entered UNLESS the Bottle number is “M” (e.g., the patient is 
    at his/her maintenance dose).  
*/
async function checkIfRecentAlertExists(patient, alertType) {
    const oldAlert = await providerAlerts.findOne({
        providerID: patient.providerID,
        patientName: patient.firstName + " " + patient.lastName,
        alertType: alertType,
        markedForDelete: false
    }).sort({ date: -1});

    if (!oldAlert) { return true; }

    // if its been 10 days since we last sent an alert, send it again.
    const today = new Date();
    const dayDifference = Math.floor((today - oldAlert.date) / (1000 * 60 * 60 * 24));

    if (dayDifference < 10) {
        return false;
    } 

    return true;
}

async function createAlert(patient, alertType) {

    const makeAlert = await checkIfRecentAlertExists(patient, alertType);

    if (!makeAlert) {
        return undefined;
    }

    const today = new Date();
    const alert = new providerAlerts({
        practiceID: patient.practiceID,
        patientName: patient.firstName + " " + patient.lastName,
        alertType: alertType,
        date: today
    })
    await alert.save();

    return alert;
}

// determine if injection(appointment) was missed
async function attritionAlertLogic(bundleArray) {
    console.log("Attrition Job running");

    // this array used for testing
    const alertsArray = [];
    if (bundleArray.length === 0) { return alertsArray; }

    try {
        for (const bundle of bundleArray) {
            const injectionInterval = bundle.protocol.nextDoseAdjustment.injectionInterval;
            const lastInjectionDate = bundle.treatment.date;
            const currentDate = new Date();

            const apptExpirationDate = new Date(lastInjectionDate);
            apptExpirationDate.setDate(apptExpirationDate.getDate() + injectionInterval);
     
            const attritionRisk = currentDate > apptExpirationDate;

            // patient missed an injection
            if (attritionRisk && bundle.patient.status !== "ATTRITION") {
                bundle.patient.status = "ATTRITION";

                const patientInDB = await Patient.findById(bundle.patient._id);
                if (patientInDB) {
                    patientInDB.status = "ATTRITION";
                    patientInDB.statusDate = new Date();
                    await patientInDB.save();
                }
                const alert = await createAlert(bundle.patient, "AttritionAlert");
                alertsArray.push(alert);
            }
        }
        return alertsArray;
    } catch (error) {
        console.error('Error with checking missed appt: ', error);
    }
}

// needs test
async function needsRetestAlertLogic(bundleArray) {
    console.log("Needs Retest Job running");

    const formatDate = (dateString) => {
        const dateArray = dateString.split('-');
        const month = parseInt(dateArray[0]) - 1;
        const day = parseInt(dateArray[1]);
        const year = parseInt(dateArray[2]);

        const treatmentStartDate = new Date(year, month, day);

        return treatmentStartDate;
    }

    const alertsArray = [];
    if (bundleArray.length === 0) { return alertsArray; }
    
    try {
        // get list of all patients 

        for (const bundle of bundleArray) {
            // check is needsRetestSnooze is expired and update if so
            needsRetestSnoozeCheck(bundle.patient);

            const maxInjectVol = bundle.protocol.nextDoseAdjustment.maxInjectionVol;
            let needsRetest = true;

            const treatmentStartDate = formatDate(bundle.patient.treatmentStartDate);

            // calculate 18 months from treatmentStartDate
            const oneYearLater = new Date(treatmentStartDate);
            oneYearLater.setMonth(oneYearLater.getMonth() + 18);

            const currentDate = new Date();

            const oneYearHasPassed = currentDate >= oneYearLater;
            
            for (const b of bundle.treatment.bottles) {
                const needsRetestSnoozeStatus = bundle.patient.needsRetestData.needsRetestSnooze.active;
                // patient is assumed to need retest; if need retest definitions not satisf. then set false.
                if (b.currBottleNumber !== 'M' || b.injVol !== maxInjectVol || !oneYearHasPassed || needsRetestSnoozeStatus) {
                    needsRetest = false;
                }
            }

            if (needsRetest) {
                // save patient data
                const alert = await createAlert(bundle.patient, "NeedsRetestAlert");
                alertsArray.push(alert);
            }   
        }

        return alertsArray;

    } catch (error) {
        console.error(error); 
    }
}

async function needsRefillAlertLogic(bundleArray) {
    const alertsArray = [];
    if (bundleArray.length === 0) { return alertsArray; }

    try {
        // patient, treatment, protocol
        for (const bundle of bundleArray) {
            const maxInjectionVol = bundle.protocol.nextDoseAdjustment.maxInjectionVol;
            await setExpirationDate(bundle.treatment);

            for (const bottle of bundle.treatment.bottles) {
                const currentInjectionVol = bottle.injVol;
                const injectionRatio = currentInjectionVol/maxInjectionVol;

                if (injectionRatio >= 0.80 && bottle.currBottleNumber !== 'M') {
                    // patient vials need to be mixed 
                    await updateBottleStatus(bottle, true, "NEEDS_MIX");
                    continue;
                } 
                
                const expiresSoon = checkExpiration(bottle);
                if (expiresSoon) { 
                    await updateBottleStatus(bottle, true, "EXPIRATION");
                    continue;
                }

                await updateBottleStatus(bottle, false, "DEFAULT");
            }
        }
    } catch (error) {
        console.error(error); 
    }
}

// at maintenance alert - all vials at M and highest concentration
async function maintenanceAlertLogic(bundleArray) {
    console.log("Maintenance Job running");

    const alertsArray = [];
    if (bundleArray.length === 0) { 
        console.log("no bundles");
        return alertsArray; 
    }
    try {
        let patientAtMaintenance = true;

        for (const bundle of bundleArray) {

            const maxInjectVol = bundle.protocol.nextDoseAdjustment.maxInjectionVol;
            for (const bottle of bundle.treatment.bottles) {
                if (bottle.injVol !== maxInjectVol || bottle.currBottleNumber !== 'M') {
                    patientAtMaintenance = false;
                }
            }

            const patientInDB = await Patient.findById(bundle.patient._id);
            // change patient status to maint if not already, or remove current maintenance status
            if (patientAtMaintenance && bundle.patient.status !== 'MAINTENANCE') {
                if (patientInDB) {
                    patientInDB.status = 'MAINTENANCE';
                    patientInDB.statusDate = new Date();
                    await patientInDB.save();
                }

                const alert = await createAlert(bundle.patient, "MaintenanceAlert");
                alertsArray.push(alert);

            } else if (!patientAtMaintenance && bundle.patient.status === 'MAINTENANCE' ) {
                if (patientInDB) {
                    patientInDB.status = 'DEFAULT';
                    patientInDB.statusDate = new Date();
                    await patientInDB.save();
                }
            }
        }

        return alertsArray;

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    attritionAlertLogic,
    needsRetestAlertLogic,
    maintenanceAlertLogic,
    needsRefillAlertLogic,
};