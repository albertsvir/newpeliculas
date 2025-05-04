const express = require('express');
const router = express.Router();
const { connectDB } = require('../../../confy/conf');
const { Types } = require('mongoose');
const Movie = require('../Movie');
const auth = require('./auth'); // Middleware de autenticación
const { validateObjectId } = require('../../../middleware/validateObjectId');
const { handleDeleteRequest } = require('../models/backend/DeleteRequest'); // Asegúrate de que la ruta sea correcta
const DeleteRequest = require('../DeleteRequest'); // Asegúrate de importar DeleteRequest
const generateUniqueId = require('../../../utils/crypto'); // Asegúrate de importar la función para generar ID únicos
const authMiddleware = require('../../../middleware/authmiddlleware'); // Middleware de autenticación


const user = require('../User'); // Asegúrate de importar el modelo de usuario


const connectDatabase = async () => {
  try {
    await connectDB();
    console.log('Conexión a base de datos inicializada para rutas de películas');
  } catch (err) {
    console.error('Error al inicializar conexión a la base de datos:', err);
  }
};

// Llamamos a la función
connectDatabase();

// Obtener todas las películas 
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [movies, total] = await Promise.all([
      Movie.find({}).skip(skip).limit(limit).lean(),
      Movie.countDocuments()
    ]);
    
    res.json({
      movies,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    console.error('Error al obtener películas:', err);
    res.status(500).json({ message: 'Error al obtener películas' });
  }
});

// Obtener una película por ID
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(movie);
  } catch (err) {
    console.error('Error al obtener película:', err);
    res.status(500).json({ message: 'Error al obtener película' });
  }
});

// Crear una nueva película (solo usuarios autenticados)

// Ruta para agregar una nueva película
router.post('/agregarpelicula', auth, async (req, res) => {
  // Verifica req.user inmediatamente después del middleware
  console.log('¿req.user existe?', Boolean(req.user));
  console.log('Tipo de req.user:', typeof req.user);
  console.log('Datos completos de req.user:', JSON.stringify(req.user, null, 2));
  
  if (!req.user) {
    console.log('Usuario no autenticado: req.user es undefined');
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  console.log('ID en req.user:', req.user.id);
  
  // El resto del código como antes...
  const { title, year, director, description, genre, rating, duration, language, country, cast } = req.body;


  const newMovie = new Movie({
    title,
    year,
    director,
    description,
    genre,
    rating,
    duration,
    language,
    country,
    cast,
    userId: req.user.id
  });


  await newMovie.save();
  console.log('Película guardada:', newMovie);
  res.status(201).json(newMovie);
});


// Actualizar una película (solo si es del usuario)
router.put('/actualizar/:id', auth, validateObjectId, async (req, res) => {
  try {
    // Buscar la película en la base de datos
    const movie = await Movie.findById(req.params.id);
    
    // Verificar si la película existe
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Verificar si el usuario que intenta actualizar es el dueño de la película
    if (!movie.userId) {
      return res.status(400).json({ message: 'La película no tiene un usuario asignado.' });
    }

    // Verificar si el userId de la película coincide con el id del usuario autenticado
    if (movie.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta película' });
    }

    // Actualizar los campos de la película con los datos del cuerpo de la solicitud
    Object.assign(movie, req.body);

    // Guardar los cambios en la base de datos
    await movie.save();

    // Devolver la película actualizada como respuesta
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la película' });
  }
});

// Solicitud para eliminar una película (solo si es del usuario)

router.post(
  '/:id/delete-request',
  auth,
  validateObjectId,
  async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie.ownerId) {
        return res.status(404).json({ error: 'esta pelicula es huerfana' });
      }

      // Verifica que ownerId exista
      if (!movie.ownerId) {
        return res
          .status(500)
          .json({ error: 'Este recurso no tiene un ownerId asignado.' });
      }

      if (movie.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para solicitar esta eliminación' });
      }

      // Resto de la lógica...
    } catch (err) {
      console.error('Error al crear solicitud de eliminación:', err);
      res.status(500).json({ error: 'Error interno al procesar la solicitud' });
    }
  }
);


// Admin aprueba la eliminación de una película
router.post('/approve/:requestId', auth, async (req, res) => {
  console.log('Token verificado, usuario:', req.user);

  if (req.user.role !== 'admin') { // Corregido: 'role' en lugar de 'rol'
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const solicitud = await DeleteRequest.findById(req.params.requestId);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    
    solicitud.aprobado = true;
    solicitud.aprobadoPor = req.user.id;
    await solicitud.save();

    res.json({ message: 'Solicitud aprobada' });
  } catch (err) {
    console.error('Error al aprobar solicitud:', err);
    res.status(500).json({ message: 'Error al aprobar solicitud' });
  }
});

// Eliminar una película si fue autorizado
router.delete('/:id', auth, validateObjectId, async (req, res) => {
  try {
    const solicitud = await DeleteRequest.findOne({
      movieId: req.params.id,
      userId: req.user.id,
      aprobado: true
    });
    
    if (!solicitud) return res.status(403).json({ message: 'Eliminación no autorizada' });

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: 'Película no encontrada' });

    await DeleteRequest.findByIdAndDelete(solicitud._id);

    res.json({ message: 'Película eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar película:', err);
    res.status(500).json({ message: 'Error al eliminar película' });
  }
});

router.get('/verificar-token', auth, (req, res) => {
  res.json({
    mensaje: 'Token válido',
    usuario: req.user
  });
});

module.exports = router;
