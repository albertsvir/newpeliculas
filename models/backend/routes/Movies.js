const express = require('express');
const router = express.Router();
const { connectDB } = require('../../../confy/conf');
const { Types } = require('mongoose');
const Movie = require('../Movie');
const DeleteRequest = require('../DeleteRequest');
const auth = require('./auth'); // Ahora importa directamente el middleware
const { validateObjectId } = require('../../../middleware/validateObjectId');

// Inicializar conexión a la base de datos al inicio
(async () => {
  try {
    await connectDB();
    console.log('Conexión a base de datos inicializada para rutas de películas');
  } catch (err) {
    console.error('Error al inicializar conexión a la base de datos:', err);
  }
})();

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
router.post('/agregarpelicula', auth, async (req, res) => {
  try {
    const movie = new Movie({
      ...req.body,
      userId: req.user.id // Usa id del token
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una película (solo si es del usuario)
router.put('/actualizar/:id', auth, validateObjectId, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });

    if (movie.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'No tienes permiso para modificar esta película' });

    Object.assign(movie, req.body);
    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar película' });
  }
});

// Solicitud para eliminar una película (solo si es del usuario)
router.post('/:id/delete-request', auth, validateObjectId, async (req, res) => {
  try {
    const deleteRequest = new DeleteRequest({
      movieId: req.params.id,
      userId: req.user.id, // Corregido: usa id del token
      status: 'pending',
    });

    await deleteRequest.save();
    res.status(201).json({ message: 'Solicitud de eliminación creada', deleteRequest });
  } catch (err) {
    console.error('Error al crear solicitud de eliminación:', err);
    res.status(500).json({ message: 'Error al crear solicitud de eliminación' });
  }
});

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
router.delete('/eliminarpeliculaautorizada/:id', auth, validateObjectId, async (req, res) => {
  try {
    const solicitud = await DeleteRequest.findOne({
      peliculaId: req.params.id,
      usuarioSolicitante: req.user.id,
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

module.exports = router;
module.exports = router;