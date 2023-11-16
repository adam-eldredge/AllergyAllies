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
    check if injections(bottle) need to be mixed ( patient is almost done with current bottle number)
    ^ "max injection volume is soon to be reached" ^
    check if injections(bottle) is expiring, make alert
        *mixed and expired require storing bottleSize; 
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
        providerID: patient.providerID,
        patientName: patient.firstName + " " + patient.lastName,
        alertType: alertType,
        date: today
    })
    await alert.save();

    return alert;
}

async function attritionAlert() {

    const patientsList = await Patient.find();
    if (!patientsList) {return;}

    const bundleArray = []
    for (const patient of patientsList) {
        if (!patient.practiceID) { continue; }

        const treatment = await Treatment.findOne({
            patiendID: patient._id,
            attended: false
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

    await attritionAlertLogic(bundleArray);
}

// determine if injection(appointment) was missed
async function attritionAlertLogic(bundleArray) {
    console.log("Attrition Job running");
    try {
        // this array is just used in testing
        const alertsArray = [];

        for (const bundle of bundleArray) {

            const injectionInterval = bundle.protocol.nextDoseAdjustment.injectionInterval;
            const lastInjectionDate = bundle.treatment.patientTreatment.date;

            const currentDate = new Date();

            const apptExpirationDate = new Date(lastInjectionDate);
            apptExpirationDate.setDate(apptExpirationDate.getDate() + injectionInterval);

            const attritionRisk = currentDate > apptExpirationDate;

            // patient missed an injection
            if (attritionRisk && bundle.patient.status !== "ATTRITION") {
                bundle.patient.status = "ATTRITION";
                const patientInDB = await Patient.findById(bundle.patient.patientID);
                let alert;

                if (patientInDB) {
                    await bundle.patient.save();
                }

                alert = await createAlert(bundle.patient, "AttritionAlert");
                alertsArray.push(alert);
            }
        }
        return alertsArray;
    } catch (error) {
        console.error('Error with checking missed appt: ', error);
    }
}

async function needsRetestSnoozeCheck(patient) {
    if (!patient.needsRetestData || !patient.needsRetestData.needsRetestSnooze) {
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

// needs test
async function needsRetestAlert() {
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
    try {
        // get list of all patients 
        const patientsList = await Patient.find(); 

        for (const patient of patientsList) {
            if (patient.status !== "MAINTENANCE") {
                continue;
            }

            const patientTreatment = await treatment.findOne({
                providerID: patient.providerID,
                patientID: patient._id,
            }).sort({ date: -1});
            
            if (!patientTreatment) {
                continue;
            }

            const provider = await Provider.findById(patient.providerID);

            if (!provider) {
                continue;
            }

            const protocol = await Protocol.findOne({
                practiceID: provider.practiceID
            });

            if (!protocol) {

                continue;
            }

            // check is needsRetestSnooze is expired and update if so
            needsRetestSnoozeCheck(patient);

            const maxInjectVol = protocol.nextDoseAdjustment.maxInjectionVol;
            let needsRetest = true;

            const treatmentStartDate = formatDate(patient.treatmentStartDate);

            // calculate 18 months from treatmentStartDate
            const oneYearLater = new Date(treatmentStartDate);
            oneYearLater.setMonth(oneYearLater.getMonth() + 18);

            const currentDate = new Date();

            const oneYearHasPassed = currentDate >= oneYearLater;
            
            for (const b of patientTreatment.bottles) {
                // patient is assumed to need retest; if need retest definitions not satisf. then set false.
                if (b.currBottleNumber !== 'M' || b.injVol !== maxInjectVol || !oneYearHasPassed || patient.needsRetestData.needsRetestSnooze.active) {
                    needsRetest = false;
                }
            }

            if (needsRetest) {
                // save patient data
                const alert = createAlert(patient, "NeedsRetestAlert");
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

// at maintenance alert - all vials at M and highest concentration
async function maintenanceAlert() {
    console.log("Maintenance Job running");
    const alertsArray = [];
    try {
        const patientsList = await Patient.find();
        let patientAtMaintenance = true;

        for (const patient of patientsList) {

            if(!patient.providerID) { continue; }
            const patientTreatment = await treatment.findOne({
                providerID: patient.providerID,
                patientID: patient._id,
            }).sort({ date: -1});
            
            if (!patientTreatment) {continue;}

            const provider = await Provider.findById(patient.providerID);

            if (!provider) {continue;}
                
            const protocol = await Protocol.findOne({
                practiceID: provider.practiceID
            });

            if (!protocol) { continue;}
               
            for (const bottle of patientTreatment.bottles) {
                if (bottle.injVol !== protocol.nextDoseAdjustment.maxInjectionVol || bottle.currBottleNumber !== 'M') {
                    patientAtMaintenance = false;
                }
            }
            // change patient status to maint if not already, or remove current maintenance status
            if (patientAtMaintenance && patient.status !== 'MAINTENANCE') {
                patient.status = 'MAINTENANCE';
                patient.statusDate = new Date();
                await patient.save();

                const alert = createAlert(patient, "MaintenanceAlert");
                alertsArray.push(alert);

            } else if (!patientAtMaintenance && patient.status === 'MAINTENANCE' ) {
                patient.status = 'DEFAULT';
                patient.statusDate = new Date();
                await patient.save();
            }
        }

        return alertsArray;

    } catch (error) {
        console.error(error);
    }
}

// check if injections(bottle) need to be mixed ( patient is almost done with current bottle number)
    // "max injection volume is soon to be reached"
// check if injections(bottle) is expiring 

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

    missedAppointmentJob,
    needsRetestJob,
    //needsRefillJob,
    maintenanceJob
};