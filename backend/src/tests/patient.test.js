const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../index');

/* npx jest file/path/.js */

// disables console.logs 
//global.console.log = jest.fn();

describe('/api/addPatient and /api/deletePatient', () => {
    it('Should return added patient data', async () => {
        const testPatient = {
            firstname: 'John',
            lastname: 'Smith',
            password: 'asdf123'
        };
        const response = await request(app).post('/api/addPatient').send(testPatient);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.firstname).toEqual(testPatient.firstname);
        expect(response.body.lastname).toEqual(testPatient.lastname);
        expect(response.body.password).toEqual(testPatient.password);

        const id = response.body._id;
        const delResponse = await request(app).delete(`/api/deletePatient/${id}`);
        
        expect(delResponse.status).toBe(200);
        expect(delResponse.body.message).toEqual(`Document with ${testPatient.firstname} has been deleted..`);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});
