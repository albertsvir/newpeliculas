const express = require('express');
const router = express.Router();
const { connectDB } = require('../../confy/conf'); ''
const Movie = require('../models/Movie');
const auth = require('../middleware/auth'); // Middleware de autenticación
const { validateObjectId } = require('../middleware/validateObjectId');
const DeleteRequest = require('../models/DeleteRequest'); // Asegúrate de importar DeleteRequest


const user = require('../models/User'); // Asegúrate de importar el modelo de usuario


const connectDatabase = async () => {
  try {
    await connectDB();
    console.log('Conexión a base de datos inicializada para rutas de películas');
  } catch (err) {
    console.error('Error al inicializar conexión a la base de datos:');
  }
};

// Llamamos a la función
connectDatabase();

// Obtener todas las películas 
router.get('/', auth, async (req, res) => {
  try {

    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const data = await Movie.find().lean(); // Usamos lean() para obtener un objeto JavaScript simple
    if (!data || data.length === 0) return res.status(200).json({ message: 'No se encontraron películas' });

    //Generar propiedad "owner" para cada película en caso de que el ownerId sea igual a req.user.id  
    const movies = data.map(movie => {
      const isOwner = movie.ownerId && movie.ownerId.toString() === req.user.id.toString();
      return {
        ...movie,
        owner: isOwner
      };
    });
    
    res.json({
      movies
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
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: 'No tienes permiso para agregar películas' })
    return;
  }

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
    imgUrl: req.body.imgUrl,
    ownerId: req.user.id
  });

  await newMovie.save();
  res.status(201).json(newMovie);
});

// Actualizar una película (solo si es del usuario)
router.put('/actualizar', auth, validateObjectId, async (req, res) => {
  try {
    // Buscar la película en la base de datos

    if(!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const movie = await Movie.findById(req.body._id);

    // Verificar si la película existe
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    if(movie.ownerId != req.user.id) {
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

    if(!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) return res.status(404).json({ message: 'Película no encontrada' });

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
