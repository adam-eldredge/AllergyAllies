const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../index');

// disables console.logs 
global.console.log = jest.fn();

describe('Example route tests', () => {
    afterAll(async () => {
        // close connections
        await mongoose.connection.close();
        await server.close();
    });

    it('Should return "Example"', async () => {
        const response = await request(app).get('/api/example');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Example'});
    });
});
