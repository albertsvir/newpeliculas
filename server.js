const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/local')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

// Rutas de la API
app.use('/api/auth', require('./models/backend/routes/auth'));
app.use('/api/movies', require('./models/backend/routes/Movies')); // Corregido a minúscula
app.use('/api/user/movies', require('./models/backend/routes/userMovies')); // Corregido a minúscula

// Eliminar esta ruta redundante ya que ahora usamos el router de películas
// app.get('/Movies', async (req, res) => {...});

// Rutas para cargar html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores 404
app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor',
    });
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
