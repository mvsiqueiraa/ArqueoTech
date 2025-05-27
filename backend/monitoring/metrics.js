// Init: 22/12/24
// Update: 26/02/25
// Objective: Este módulo é responsável por coletar métricas da aplicação.


const logger = require('../utils/logger');

class MetricsCollector {
    constructor() {
        this.metrics = {
            requestCount: 0,
            analysisCount: 0,
            authAttempts: 0,
            successRate: 0,
            failureRate: 0,
            responseTimes: []
        };
    }

    incrementRequest() {
        this.metrics.requestCount++;
        this.logMetrics();
    }

    incrementAuthAttempt(success) {
        this.metrics.authAttempts++;
        if (success) {
            this.metrics.successRate++;
        } else {
            this.metrics.failureRate++;
        }
        this.logMetrics();
    }

    recordResponseTime(time) {
        this.metrics.responseTimes.push(time);
        this.logMetrics();
    }

    logMetrics() {
        logger.info('Metrics updated', { type: 'metrics', ...this.metrics });
    }
}

module.exports = new MetricsCollector();
