// Init: 22/12/24
// Update: 26/02/25 
// Objective: implementa um mecanismo de monitoramento para medir o desempenho e rastrear operações na aplicação

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class TracingSystem {
    startTrace(operationName) {
        const traceId = uuidv4();
        const startTime = Date.now();

        return {
            traceId,
            startTime,
            operationName
        };
    }

    endTrace(trace) {
        const duration = Date.now() - trace.startTime;
        
        logger.info('Operation traced', {
            type: 'trace',
            traceId: trace.traceId,
            operation: trace.operationName,
            duration,
            endTime: new Date()
        });
    }
}

module.exports = new TracingSystem();
