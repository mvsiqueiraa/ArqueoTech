// Init: 22/12/24
// Update: 26/02/25 
// Objective: Arquivo principal do servidor

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { v4: uuidv4 } = require('uuid'); // Importação do UUID

require('dotenv').config();

const app = express(); // Inicialize o app aqui

// Middleware para gerar e anexar correlationId
app.use((req, res, next) => {
    req.correlationId = uuidv4(); // Gera um ID único para a requisição
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { 
    stream: { 
        write: message => logger.info(message.trim()) 
    } 
}));

// Importar rotas
const authRouter = require('./routes/auth'); // Importação correta do arquivo auth.js
const analysisRouter = require('./routes/analysis'); // Importação correta do arquivo analysis.js

// Usar rotas
app.use('/api/auth', authRouter); // Certifique-se de usar o objeto importado
app.use('/api/analysis', analysisRouter); // Certifique-se de usar o objeto importado

// Conectar ao MongoDB com mais detalhes de erro
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB conectado com sucesso');
    })
    .catch(err => {
        console.error('Erro detalhado MongoDB:', err);
        process.exit(1);
    });

// Rotas básicas
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Adicione após as outras rotas
const artifactRoutes = require('./routes/artifacts');
app.use('/api/artifacts', artifactRoutes);

// Criar pasta para uploads
const fs = require('fs');
if (!fs.existsSync('uploads/artifacts')) {
  fs.mkdirSync('uploads/artifacts', { recursive: true });
}
