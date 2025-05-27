// Init: 22/12/24
// Update: 26/02/25 
// Objective: Este modelo de usuário é utilizado para armazenar informações sobre os usuários da aplicação.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    institution: { // novo campo
        type: String,
        required: true // deixe obrigatório se quiser
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adicionar seleção explícita de campos
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
