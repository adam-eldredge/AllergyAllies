const schedule = require('node-schedule');
const treatment = require('treatment');
const protocol = require('protocol');
const providerAlerts = require('providerAlerts');

const alertService = require('./alertService');

// determine if injection(appointment) was missed
async function attritionAlert() {
    try {
        const patientsList = await getAllPatientsHelper(); 

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

        for (p of patientsList) {
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
                if (b.currBottleNumber === 'M' && b.injVol === maxInjectVol && needsRetest) {
                    containsNeedRetest = true;
                    patientBottles.push({
                        bottleName: b.bottleName,
                    })
                }

            }

            const alert = new providerAlerts({
                NPI: p.providerID,
                patientName: p.firstName + " " + p.lastName,
                alertType: "NeedsRetestAlert",
                bottles: patientBottles
            })

            await alert.save();

        }

    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// check if injections(bottle) need to be mixed ( patient is almost done with current bottle number)
    // "max injection volume is soon to be reached"
    
// check if injections(bottle) is expiring 

// This string means: run daily, at midnight
const scheduleString = '0 0 * * *';
const missedAppointmentJob = schedule.scheduleJob(scheduleString, attritionAlert);
const needsRetestJob = schedule.scheduleJob(scheduleString, needsRetestAlert);

module.exports = {
  missedAppointmentJob,
  needsRetestJob,
};