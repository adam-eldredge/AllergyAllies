const {app, server} = require('../index');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const ProviderAlerts = require('../Models/alert');
const Treatment = require('../Models/treatment');
const { mockPatient, mockProtocol, mockTreatment} = require('./mockData/mockData');
const {
    attritionAlertLogic, 
    needsRetestAlertLogic,
    maintenanceAlertLogic,
    missedAppointmentJob,
    needsRetestJob,
    maintenanceJob,
} = require('../services/alertGenerator');

/* Fails if alerts already exist */

describe('attrition', () => {
    it('Should match output', async () => {
        const array = [{
            patient: mockPatient,
            protocol: mockProtocol,
            treatment: mockTreatment
        }];
        
        const alerts = await attritionAlertLogic(array);
        console.log(alerts);

        expect(alerts[0].patientName).toBe("Harry Potter");
        expect(alerts[0].alertType).toBe("AttritionAlert");
        expect(alerts).toBeDefined();

        //await ProviderAlerts.findByIdAndDelete(alerts[0]._id);
    });
});

describe('needsRetest', () => {
    it('Should create alert', async () => {
        for (const b of mockTreatment.bottles) {
            b.currBottleNumber = "M";
        }
        mockPatient.firstName = "Gary";
        mockPatient.lastName = "Smith";
        const array = [{
            patient: mockPatient,
            protocol: mockProtocol,
            treatment: mockTreatment
        }];
        const alerts = await needsRetestAlertLogic(array);

        expect(alerts).toBeDefined();
        console.log(alerts);

        expect(alerts[0].patientName).toBe("Gary Smith");
        expect(alerts[0].alertType).toBe("NeedsRetestAlert");

        //await ProviderAlerts.findByIdAndDelete(alerts[0]._id);
    });
});

describe('maintenanceAlert', () => {
    it('Should create alert', async () => {
        // alter test patient
        for (const b of mockTreatment.bottles) {
            b.currBottleNumber = "M";
            b.injVol = mockProtocol.nextDoseAdjustment.maxInjectionVol;
        }
        mockPatient.firstName = "Martin";
        mockPatient.lastName = "Doe";
        mockPatient.status = 'DEFAULT';
    
        const array = [{
            patient: mockPatient,
            protocol: mockProtocol,
            treatment: mockTreatment
        }];
        const alerts = await maintenanceAlertLogic(array);

        expect(alerts).toBeDefined();
        console.log(alerts);

        expect(alerts[0].patientName).toBe("Martin Doe");
        expect(alerts[0].alertType).toBe("MaintenanceAlert");

        //await ProviderAlerts.findByIdAndDelete(alerts[0]._id);
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
});