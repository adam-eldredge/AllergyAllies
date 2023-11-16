const request = require('supertest');
const {app, server} = require('../index');
const mongoose = require('mongoose');
const Treatment = require('../Models/protocols');

// npx jest tests/treatment.test.js 
// add at end for more description (--detectOpenHandles)

const addTreatmentRequest = {
    "nameOfPractice": "Leal Inc.",
    "patientLastName": "Smith",
    "patientFirstName": "John",
    "patientID": "652e3df42be9a8d93262146b",
    "practiceID": "655400881dae7e7b2c04aa8c",
    "date": "2023-11-12T00:00:00.000Z"
}

describe('/api/addTreatment', () => {
    it('Should return status 200', async () => {
        const response = await request(app).post('/api/addTreatment').send(addTreatmentRequest);
        console.log(response.body.message);
        await expect(response.status).toBe(200);
    });
});

const updateTreatmentRequest = {
    "patientID": "652e3df42be9a8d93262146b",
    "date": "2023-11-12T00:00:00.000Z",
    "bottleName": "Pollen",
    "injVol": 0.2,
    "injDilution": 0.1,
    "injLLR": 0.3,
    "currBottleNumber": 4
}

describe('/api/updateTreatment', () => {
    it('Should return status 200', async () => {
        const response = await request(app).patch('/api/updateTreatment').send(updateTreatmentRequest);
        console.log(response.body.message);
        await expect(response.status).toBe(200);
    });
});

const nextTreatmentRequest = {
    "patientID": "652e3df42be9a8d93262146b",
    "practiceID": "655400881dae7e7b2c04aa8c"
}

describe('/api/nextTreatment', () => {
    it('Should return status 200', async () => {
        const response = await request(app).post('/api/nextTreatment').send(nextTreatmentRequest);
        console.log(response.body.message);
        await expect(response.status).toBe(200);
    });
});


afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});
