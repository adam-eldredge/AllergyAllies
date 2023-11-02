const request = require('supertest');
const mongoose = require('mongoose');
const {app} = require('../index');
const protocol = require('../Models/protocols');

const sampleProtocol = {
    "providerID":"6542b1c7690563abbc598607",
    "appointmentSchedule": "Weekly",
    "nextDoseAdjustments": {
        "injectionInterval": 7,
        "startingInjectionVol": 10,
        "maxInjectionVol": 0.5,
        "injectionVolumeIncreaseInterval": 2
    },
    "missedDoseAdjustment1": {
        "doseAdjustMissedDays": 1,
        "adjustInjectionVolume": 5,
        "adjustVialConcentration": 1,
        "adjustBottleNumber": 2
    },
    "missedDoseAdjustment2": {
        "doseAdjustMissedDays": 3,
        "adjustInjectionVolume": 7,
        "adjustVialConcentration": 2,
        "adjustBottleNumber": 1
    },
    "bottles": [
        {
            "bottleName": "Pollen",
            "bottleSize": 250,
            "numbBottles": 10,
            "largeReactionsDoseAdjustment": {
                "whealLevelForAdjustment": 3,
                "adjustInjectionVol": 6,
                "adjustVialConcentration": 1,
                "adjustBottleNumber": 2
            }
        },
        {
            "bottleName": "Molds",
            "bottleSize": 250,
            "numbBottles": 10,
            "largeReactionsDoseAdjustment": {
                "whealLevelForAdjustment": 3,
                "adjustInjectionVol": 6,
                "adjustVialConcentration": 1,
                "adjustBottleNumber": 2
            }
        },
        {
            "bottleName": "Insects/Pets",
            "bottleSize": 250,
            "numbBottles": 10,
            "largeReactionsDoseAdjustment": {
                "whealLevelForAdjustment": 3,
                "adjustInjectionVol": 6,
                "adjustVialConcentration": 1,
                "adjustBottleNumber": 2
            }
        }
    ],
    "vialTestReactionAdjustment": {
        "whealLimitToProceedWithInjection": 4,
        "adjustVialConcentration": 1,
        "adjustBottleNumber": 3
    }
};

describe('/api/addPatient and /api/deletePatient', () => {
    it('Should return added protocol', async () => {

        const response = await request(app).post('/api/addProtocol').send(sampleProtocol);
    
        expect(response.status).toBe(200);
        //expect(response.body).toHaveProperty('_id');
        //expect(response.body.firstname).toEqual(testPatient.firstname);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    //await server.close();
});