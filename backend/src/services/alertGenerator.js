const schedule = require('node-schedule');
const treatment = require('treatment');
const protocol = require('protocol');
const providerAlerts = require('providerAlerts');

const alertService = require('./alertService');
const provider = require('../Models/provider');
const Patient = require('../Models/patient');

const { getAllPatientsHelper } = require('../controllers/patient_controller');

/* This file generates alerts for the provider and updates patient status*/

// reaction alert creation
// update providerIDs to practiceIDs

// determine if injection(appointment) was missed
async function attritionAlert() {
    try {
        const patientsList = await Patient.find(); 
        // not sure if we can use const considering we change data
        for (const p of patientsList) {

            // get last treatment info, and interval of injection according to protocol
            const patientTreatment = treatment.findOne({
                _id: p._id, 
                NPI: p.NPI 
            });

            const providerProtocol = protocol.findOne(p.NPI);

            if (!patientTreatment || !providerProtocol) {
                continue;
            }

            const lastInjectionDate = patientTreatment.date;
            const currentDate = new Date();

            const injectionInterval = providerProtocol.nextDoseAdjustments.injectionInterval;
            const attritionRisk = currentDate > (lastInjectionDate + injectionInterval)

            // patient missed an injection
            if (attritionRisk && !patientTreatment.attended) {
                p.status = "ATTRITION";
                await p.save();

                const alert = new providerAlerts({
                    NPI: p.providerID,
                    patientName: p.firstName + " " + p.lastName,
                    alertType: "AttritionAlert",
                })

                await alert.save();
                // await alertService.alertMissedAppointment(p._id, p.NPI);
            }
        }
    } catch (error) {
        console.error('Error with checking missed appt: ', error);
    }
}

// needs test
async function needsRetestAlert() {
    try {
        // get list of all patients 
        const patientsList = await getAllPatientsHelper(providerID); 

        for (const p of patientsList) {
            const patientTreatment = await treatment.findOne({
                _id: p._id, 
                providerID: p.providerID 
            });

            const foundProtocol = await protocol.findOne({ providerID: p.providerID});

            if (!foundProtocol || !patientTreatment) {
                continue;
            }

            const maxInjectVol = foundProtocol.nextDoseAdjustment.maxInjectionVol;
            const patientBottles = [];

            let containsNeedRetest = false;
            for (const b of patientTreatment.bottles) {
                // dates
                const bottleStartDate = b.date;
                const oneYearLater = new Date(patientTreatmentStartDate);
                oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                const currentDate = new Date();

                const needsRetest = currentDate >= oneYearLater;

                // check patient is at maintenance
                if (b.currBottleNumber === 'M' && b.injVol === maxInjectVol && needsRetest && !b.needsRetestSnooze.active) {
                    containsNeedRetest = true;
                    b.needsRetest = true;
                    await b.save();
                    patientBottles.push({
                        bottleName: b.bottleName,
                    })
                }

            }
            // save patient data
            const alert = new providerAlerts({
                NPI: p.providerID,
                patientName: p.firstName + " " + p.lastName,
                alertType: "NeedsRetestAlert",
                bottles: patientBottles
            })

            await alert.save();
        }

    } catch (error) {
        console.error(error); 
    }
}

// needs update - logic broken
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
    try {
        const patientsList = await Patient.find();
        let patientAtMaintenance = true;

        for (const patient of patientsList) {
            const patientTreatment = treatment.findOne({
                providerID: patient.providerID,
                patientID: patient._id,
            });

            if (!patientTreatment) {
                continue;
            }

            const foundProvider = provider.findById(patient.providerID);

            if (!foundProvider) {
                continue;
            }

            const foundProtocol = protocol.findOne({
                practiceID: provider.practiceID,
            });

            if (!foundProtocol) {
                continue;
            }

            for (const bottle of patientTreatment.bottles) {
                if (bottle.injVol !== foundProtocol.maxInjectionVol || bottle.currBottleNumber !== 'M') {
                    patientAtMaintenance = false;
                }
            }
        }

        // change patient status to maint if not already, or remove current maintenance status
        if (patientAtMaintenance && patient.status !== 'MAINTENANCE') {
            patient.status === 'MAINTENANCE';
            patient.statusDate === new Date();
            await patient.save();

            const alert = new providerAlerts({
                NPI: p.providerID,
                patientName: p.firstName + " " + p.lastName,
                alertType: "AttritionAlert",
            })
            await alert.save();

        } else if (!patientAtMaintenance && patient.status === 'MAINTENANCE' ) {
            patient.status === 'DEFAULT';
            patient.statusDate === new Date();
            await patient.save();
        }

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
const needsRefillJob = schedule.scheduleJob(scheduleString, needsRefillAlert);
const maintenanceJob = schedule.scheduleJob(scheduleString, maintenanceAlert);

module.exports = {
  missedAppointmentJob,
  needsRetestJob,
  needsRefillJob,
  maintenanceJob
};