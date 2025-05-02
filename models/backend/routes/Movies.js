const express = require('express');
const router = express.Router();
const Movie = require('../Movie'); // Modelo de película

router.post('/', async (req, res) => {
    try {
        const Movie = new Movie(req.body);
        await Movie.save();
        res.status(201).json(Movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las películas
router.get('/', async (req, res) => {
    try {
        const Movies = await Movie.find();
        res.json(Movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;