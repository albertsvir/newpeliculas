const express = require('express');
const router = express.Router();
const User = require('../User'); // Modelo de usuario

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login de usuario (simple sin JWT aún)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.json({ message: 'Login exitoso', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;