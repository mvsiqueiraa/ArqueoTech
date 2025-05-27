// Init: 22/12/24
// Update: 26/02/25 
// Objective: sistema centralizado de registro de logs com múltiplos destinos e formatação padronizada para monitoramento e análise de eventos na aplicação.

const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Adicionar transporte de console para depuração
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    ]
});

if (process.env.MONGODB_URI) {
    logger.add(new winston.transports.MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'logs',
        options: { useUnifiedTopology: true }
    }));
}

module.exports = logger;
