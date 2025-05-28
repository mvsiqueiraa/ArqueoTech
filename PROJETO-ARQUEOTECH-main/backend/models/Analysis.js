// Init: 22/12/24
// Update: 26/02/25 
// Objective: Este modelo de análise é utilizado para armazenar informações sobre as análises de imagens realizadas pelos usuários da aplicação.

    
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    predictions: [{
        className: String,
        probability: Number
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);