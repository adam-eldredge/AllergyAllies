const {app, server} = require('../index');
const mongoose = require('mongoose');
const Patient = require('../Models/patient');
const {attritionAlert, needsRetestAlert, maintenanceAlert} = require('../services/alertGenerator');

const patient = {
    "firstName": "Harry",
    "lastName": "Potter",
    "email": "harry.potter@example.com",
    "phone": "1234567890",
    "password": "harry123",
    "DoB": "01-01-1980",
    "treatments": ["treatmentId1", "treatmentId2"],
    "treatmentStartDate": "2023-01-01",
    "maintenanceBottleNumber": [
      {
        "nameOfBottle": "Bottle1",
        "maintenanceNumber": 5
      },
      {
        "nameOfBottle": "Bottle2",
        "maintenanceNumber": 8
      }
    ],
    "providerID": "providerId123",
    "status": "DEFAULT",
    "statusDate": "2023-11-16T00:00:00.000Z",
    "tokens": 10,
    "needsRetestData": {
      "needsRetest": false,
      "needsRetestSnooze": {
        "active": null,
        "dateOfSnooze": null,
        "snoozeDuration": null
      }
    },
    "allergyMedication": [
      {
        "name": "Medication1",
        "dose": "10mg",
        "frequency": "Twice daily"
      },
      {
        "name": "Medication2",
        "dose": "5mg",
        "frequency": "Once daily"
      }
    ]
}


describe('attritionAlert()', () => {
    it('Should match output', async () => {
        const alerts = await attritionAlert();
        expect(alerts).toBeDefined();
    });
});

/*
describe('needsRetestAlert()', () => {
    it('Should create alert', async () => {
        const alerts = await needsRetestAlert();
        expect(alerts).toBeDefined();
    });
});

describe('maintenanceAlert()', () => {
    it('Should create alert', async () => {
        const alerts = await maintenanceAlert();
        expect(alerts).toBeDefined();
    });
});
*/
afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});