const schedule = require('node-schedule');
const Treatment = require('../Models/treatment');
const Protocol = require('../Models/protocols');
const providerAlerts = require('../Models/alert');

//const alertService = require('./alertService');
const Provider = require('../Models/provider');
const Patient = require('../Models/patient');

const { getAllPatientsHelper } = require('../controllers/patient_controller');

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
        alertType: alertType
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

// creates array of patients, relevant protocol, and treatment
async function getPatientsProtocolsTreatments(alertType) {
    const patientsList = await Patient.find();
    if (!patientsList) {return;}

    const bundleArray = []
    for (const patient of patientsList) {
        if (!patient.practiceID) { continue; }

        let attended = true;
        if (alertType === "attrition") {
            attended = false;
        }

        const treatment = await Treatment.findOne({
            patientID: patient._id,
            attended: attended
        });

        if (!treatment) {continue;}

        const protocol = await Protocol.findOne({
            practiceID: patient.practiceID
        });

        if (!protocol) {continue;}

        const patientPracticeTreatmentBundle = {
            patient: patient,
            protocol: protocol,
            treatment: treatment
        }

        bundleArray.push(patientPracticeTreatmentBundle);
    }

    return bundleArray;
}

async function attritionAlert() {
    const alertType = "attrition";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await attritionAlertLogic(bundleArray);
}

// determine if injection(appointment) was missed
async function attritionAlertLogic(bundleArray) {
    console.log("Attrition Job running");
    try {
        // this array is just used in testing
        const alertsArray = [];
        if (bundleArray.length === 0) { return alertsArray; }
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

async function needsRetestAlert() {
    const alertType = "needsRetest";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await needsRetestAlertLogic(bundleArray);
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

// refills not working - no bottle size for vials, no current epipen/allergy drops support in project
async function needsRefillAlert() {
    const patientsList = await getAllPatientsHelper(providerID);

    const Refills = [];

    for (const p of patientsList) {
        const patientTreatment = await treatment.find({
            providerID: p.providerID.toString(),
            patientID: p._id.toString(),
        });

        const providerProtocol = await protocol.findOne({providerID: p.providerID});

        if (!providerProtocol || !patientTreatment) {
            continue;
        }

        for (const b of patientTreatment.bottles) {
            const matchingBottle = providerProtocol.bottles.find(
                (protocolBottle) => protocolBottle.bottleName === b.nameOfBottle
            );

            const bottleSize = matchingBottle.bottleSize;

            const currentInjVol = b.injVol;

            if (b.injTotalSum + currentInjVol * 3 >= bottleSize) {
                b.needsRefill = true;
            } else {
                b.needsRefill = false;
            }
        }
    }
}

async function maintenanceAlert() {
    const alertType = "maintenance";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await maintenanceAlertLogic(bundleArray);
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

// This string means: run daily, at midnight
const scheduleString = '0 0 * * *';
const missedAppointmentJob = schedule.scheduleJob(scheduleString, attritionAlert);
const needsRetestJob = schedule.scheduleJob(scheduleString, needsRetestAlert);
//const needsRefillJob = schedule.scheduleJob(scheduleString, needsRefillAlert);
const maintenanceJob = schedule.scheduleJob(scheduleString, maintenanceAlert);

module.exports = {
    attritionAlert,
    needsRetestAlert,
    maintenanceAlert,
    attritionAlertLogic,
    needsRetestAlertLogic,
    maintenanceAlertLogic,
    missedAppointmentJob,
    needsRetestJob,
    maintenanceJob
};