const { server } = require('../index');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const { mockPatient, mockProtocol, mockTreatment} = require('./mockData/mockData');
const { needsRefillAlertLogic } = require('../services/alertGenerator');
const { updateBottleStatus } = require('../helpers/alerts_helper');
const {
    missedAppointmentJob,
    needsRetestJob,
    maintenanceJob,
    needsRefillJob,
} = require('../services/alertGenerator');

jest.mock('../helpers/alerts_helper', () => ({
    ...jest.requireActual('../helpers/alerts_helper'),
    updateBottleStatus: jest.fn()
}));

describe('needsMixAlert', () => {
    mockPatient.firstName = "Martin";
    mockPatient.lastName = "Doe";
    mockPatient.status = 'DEFAULT';

    // needs mix case
    mockTreatment.bottles[0].injVol = 0.45;
    mockTreatment.bottles[0].currBottleNumber = 2;
    mockTreatment.bottles[0].needsRefill = false;

    // default case
    mockTreatment.bottles[1].injVol = 0.47;
    mockTreatment.bottles[1].currBottleNumber = 'M';
    mockTreatment.bottles[1].needsRefill = true;

    // expiring soon case
    mockTreatment.bottles[2].expirationDate = 
    mockTreatment.bottles[2].currBottleNumber = 'M';
    mockTreatment.bottles[2].needsRefill = true;

    const array = [{
        patient: mockPatient,
        protocol: mockProtocol,
        treatment: mockTreatment
    }];

    it('Should call func w/ needs_mix', async () => {
        await needsRefillAlertLogic(array);

        // needs mix case
        expect(updateBottleStatus.mock.calls[0]).toEqual([
            array[0].treatment.bottles[0],
            true,
            'NEEDS_MIX'
        ]);

        // default case
        expect(updateBottleStatus.mock.calls[1]).toEqual([
            array[1].treatment.bottles[1],
            false,
            'DEFAULT'
        ]);

        // expiration case
        expect(updateBottleStatus.mock.calls[2]).toEqual([
            array[2].treatment.bottles[2],
            true,
            'EXPIRING'
        ]);
    });


});

afterAll(async () => {
    // Close the Express server
    await new Promise(resolve => server.close(resolve));
  
    // Close the Mongoose connection
    await mongoose.connection.close();
  
    // Cancel scheduled jobs
    schedule.cancelJob(needsRetestJob);
    schedule.cancelJob(missedAppointmentJob);
    schedule.cancelJob(maintenanceJob);
    schedule.cancelJob(needsRefillJob);
});