// Init: 22/12/24
// Update: 26/02/25 
// Objective: Rotas de registro e login

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rota de registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, institution } = req.body;

        if (!institution) {
            return res.status(400).json({ message: 'Instituição é obrigatória' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            institution // novo campo
        });

        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router; // Certifique-se de exportar o router
