const schedule = require('node-schedule');
const Patient = require('../Models/patient');
const Treatment = require('../Models/treatment');
const Protocol = require('../Models/protocols');
const {
    attritionAlertLogic, 
    needsRetestAlertLogic, 
    needsRefillAlertLogic, 
    maintenanceAlertLogic
} = require('./alertGenerator');

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

async function needsRetestAlert() {
    const alertType = "needsRetest";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await needsRetestAlertLogic(bundleArray);
}

async function needsRefillAlert() {
    const alertType = "needsRefill";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await needsRefillAlertLogic(bundleArray);
}

async function maintenanceAlert() {
    const alertType = "maintenance";
    const bundleArray = await getPatientsProtocolsTreatments(alertType);
    await maintenanceAlertLogic(bundleArray);
}

const scheduleString = '0 0 * * *';
const needsRefillJob = schedule.scheduleJob(scheduleString, needsRefillAlert);
const missedAppointmentJob = schedule.scheduleJob(scheduleString, attritionAlert);
const needsRetestJob = schedule.scheduleJob(scheduleString, needsRetestAlert);
const maintenanceJob = schedule.scheduleJob(scheduleString, maintenanceAlert);

module.exports = {
    attritionAlert,
    needsRetestAlert,
    needsRefillAlert,
    maintenanceAlert,

    missedAppointmentJob,
    needsRetestJob,
    needsRefillJob,
    maintenanceJob
}