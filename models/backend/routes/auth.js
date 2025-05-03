const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../User');

const SECRET_KEY = process.env.JWT_SECRET || 'clavesita'; // Usa una variable de entorno en producción

// Middleware de autenticación
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Incluye id, username y role
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user', listaPeliculas = [] } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      listaPeliculas
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser.username });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login exitoso', 
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el login' });
  }
});

// Exporta el middleware directamente y el router como propiedad
module.exports = auth;
module.exports.router = router;