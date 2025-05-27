// Init: 22/12/24
// Update: 26/02/25 
// Objective: Este código implementa um endpoint de login com segurança e monitoramento completo:

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const metrics = require('../monitoring/metrics');
const eventLogger = require('../monitoring/events');

router.post('/login', async (req, res) => {
    const startTime = Date.now(); // Início do rastreamento de tempo

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            metrics.incrementAuthAttempt(false); // Incrementa falha na autenticação
            eventLogger.logEvent('auth_failure', req, { email }); // Inclui req no log
            throw new Error('Credenciais inválidas');
        }

        metrics.incrementAuthAttempt(true); // Incrementa sucesso na autenticação
        eventLogger.logEvent('auth_success', req, { userId: user._id }); // Inclui req no log

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        eventLogger.logError(error, req, { endpoint: '/api/auth/login' }); // Inclui req no log de erro
        res.status(400).json({ message: error.message });
    } finally {
        const responseTime = Date.now() - startTime; // Calcula o tempo de resposta
        metrics.recordResponseTime(responseTime); // Registra o tempo de resposta nas métricas
    }
});


module.exports = router;
