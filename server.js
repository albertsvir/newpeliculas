require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./confy/conf');
const compression = require('compression'); // Necesitarás instalar esta dependencia
const moviesRouter = require('./models/backend/routes/Movies');
const authRouter = require('./models/backend/routes/auth');
const userMoviesRouter = require('./models/backend/routes/userMovies');

const app = express();

// Inicializar conexión a MongoDB al iniciar el servidor
(async () => {
  try {
    await connectDB();
    console.log('Conexión a MongoDB inicializada al iniciar servidor');
  } catch (err) {
    console.error('Error al conectar con MongoDB al iniciar:', err);
    process.exit(1); // Salir si no se puede conectar a la base de datos
  }
})();

// Middlewares para optimización
app.use(compression()); // Comprime las respuestas HTTP
app.use(cors({
  origin: 'http://127.0.0.1:5500', // La URL exacta de tu frontend
  credentials: true                // Permite credenciales
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d' // Cache de archivos estáticos por 1 día
}));

// Rutas de la API
app.use('/api/auth', authRouter); // Rutas de autenticación
app.use('/api/movies', moviesRouter);
app.use('/api/user/movies', userMoviesRouter); // Rutas de películas del usuario

// Rutas para cargar html - Configuración SPA
app.get(['/', '/user'], (req, res) => {
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
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Manejo de cierre gracioso del servidor
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    process.exit(0);
  });
});

module.exports = app; // Exportamos para posibles pruebas
