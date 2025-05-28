// Init: 22/12/24
// Update: 26/02/25 
// Objective: Este modelo de log é utilizado para armazenar informações sobre eventos ocorridos na aplicação.

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    eventId: String,
    eventType: String,
    timestamp: Date,
    data: Object,
    level: String
});

module.exports = mongoose.model('Log', logSchema);
