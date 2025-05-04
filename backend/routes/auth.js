const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { _router } = require('../../server');

const SECRET_KEY = 'clavesita'; 

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user', listaPeliculas = [] } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = new User({
      username,
      password,
      role,
      listaPeliculas
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser.username });
  } catch (err) { 
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // Enviar la respuesta con el token
    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});


// Exporta el middleware directamente y el router como propiedad
module.exports = router;// Exporta el router aquí, no auth
