const schedule = require('node-schedule');
const treatment = require('treatment');
const protocol = require('protocol');

const alertService = require('./alertService');
/* 
Two options:
    - Run for each provider, for each of their patients
    - Run for each patient, find provider each time...
*/

// determine if injection(appointment) was missed
async function checkMissedAppointment() {
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

                await alertService.alertMissedAppointment(p._id, p.NPI);
            }
        }
    } catch (error) {
        console.error('Error with checking missed appt: ', error);
    }
}

// This string means: run daily, at midnight
const scheduleString = '0 0 * * *';
const missedInjectionsJob = schedule.scheduleJob(scheduleString, checkMissedAppointment);

module.exports = {
  missedInjectionsJob,
};