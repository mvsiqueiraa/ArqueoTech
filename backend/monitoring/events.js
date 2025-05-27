// Init: 22/12/24
// Update: 26/02/25
// Objective: Este módulo é responsável por registrar eventos e erros em logs da aplicação.
// O módulo exporta dois métodos: logEvent e logError.

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const eventLogger = {
    logEvent: (eventType, req, data) => {
        const eventId = uuidv4();
        logger.info({
            correlationId: req.correlationId, // Inclui o correlationId da requisição
            eventId,
            eventType,
            timestamp: new Date(),
            level: 'INFO',
            payload: data
        });
        return eventId;
    },

    logError: (error, req, context) => {
        logger.error({
            correlationId: req.correlationId, // Inclui o correlationId da requisição
            errorId: uuidv4(),
            timestamp: new Date(),
            level: 'ERROR',
            errorMessage: error.message,
            stack: error.stack,
            context
        });
    }
};

module.exports = eventLogger;