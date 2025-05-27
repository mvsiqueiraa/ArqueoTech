// Init: 22/12/24
// Update: 26/02/25 
// Objective: Validar se o sistema de logs está registrando corretamente as tentativas de login, especialmente em casos de falha.

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const api = supertest(app);
const Log = require('../models/Log.js');
const User = require('../models/User.js');

describe('Auth System Tests', () => {
    beforeEach(async () => {
        await Log.deleteMany({});
        await User.deleteMany({});
    });

    test('log system records user actions', async () => {
        await api
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: '123456' })
            .expect(400); // Mudado para 400 pois o usuário não existe

        const logs = await Log.find({});
        expect(logs.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
