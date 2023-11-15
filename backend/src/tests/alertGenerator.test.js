const {app, server} = require('../index');
const mongoose = require('mongoose');
const Patient = require('../Models/patient');
const {attritionAlert, needsRetestAlert, maintenanceAlert} = require('../services/alertGenerator');

describe('attritionAlert()', () => {
    it('Should match output', async () => {
        const alerts = await attritionAlert();
        expect(alerts).toBeDefined();
    });
});

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

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});