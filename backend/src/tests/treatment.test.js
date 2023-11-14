const request = require('supertest');
const {app, server} = require('../index');
const mongoose = require('mongoose');
const Treatment = require('../Models/protocols');

// npx jest tests/treatment.test.js 
// add at end for more description (--detectOpenHandles)

const newTreatment = new Treatment({
    nameOfPractice: 'Leal Inc.',
    providerID: '65251db8bc9cee2dfaaf8fdb',
    NPI: 12345,
    patientLastName: 'Smith',
    patientFirstName: 'John',
    patientID: '652e3df42be9a8d93262146b',
    bottles: [
        {
            nameOfBottle: 'Pollen',
            injVol: 0.5,
            injDilution: 0.1,
            injLLR: 0.1,
            currBottleNumber: 'M',
            date: new Date(),
            needsRetest: false,
            needsRetestSnooze: {
                active: false,
                dateOfSnooze: null,
                snoozeDuration: 0,
            },
            injSumForBottleNumber: 0,
            needsRefill: false,
            expirationDate: new Date('2023-12-31'),
        },
        {
            nameOfBottle: 'Insects/Pets',
            injVol: 0.5,
            injDilution: 0.1,
            injLLR: 0.1,
            currBottleNumber: '5',
            date: new Date(),
            needsRetest: false,
            needsRetestSnooze: {
                active: false,
                dateOfSnooze: null,
                snoozeDuration: 0,
            },
            injSumForBottleNumber: 0,
            needsRefill: false,
            expirationDate: new Date('2023-12-31'),
        },
        {
            nameOfBottle: 'Molds',
            injVol: 0.2,
            injDilution: 0.1,
            injLLR: 0.1,
            currBottleNumber: '3',
            date: new Date(),
            needsRetest: false,
            needsRetestSnooze: {
                active: false,
                dateOfSnooze: null,
                snoozeDuration: 0,
            },
            injSumForBottleNumber: 0,
            needsRefill: false,
            expirationDate: new Date('2023-12-31'),
        },
    ],
    date: new Date(),
    attended: true,
});

describe('/api/addTreatment', () => {
    it('Should return status 200', async () => {
        const response = await request(app).post('/api/addTreatment').send(newTreatment);
        console.log(response.body.message);
        await expect(response.status).toBe(200);
    });
});

describe('/api/nextTreatment', () => {
    it('Should return status 200', async () => {
        const response = await request(app).post('/api/addTreatment').send(newTreatment);
        console.log(response.body.message);
        await expect(response.status).toBe(200);
    });
});


afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});
