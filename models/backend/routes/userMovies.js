const express = require('express');
const router = express.Router();
const User = require('../User'); // Modelo de usuario
const Movie = require('../Movie'); // Modelo de película

// Agregar película a lista del usuario
router.post('/:userId/add', async (req, res) => {
    const { movieId } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.listaPeliculas.push(movieId);
        await user.save();

        res.json({ message: 'Película agregada a la lista', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener lista de películas del usuario
router.get('/:userId/list', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('listaPeliculas');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json(user.listaPeliculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;