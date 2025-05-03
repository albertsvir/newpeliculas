const express = require('express');
const router = express.Router();
const {connectDB} = require('../../../confy/conf'); // Asegúrate de que la ruta sea correcta
const { getModel } = require('../Movie'); // Modelo de película

// Obtener todas las películas
router.get('/movies', async (req, res) => {
    try {

      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto


      const movies = await Movie.find({}); 
      console.log(movies); // Verifica que las películas se obtienen correctamente
      res.json(movies);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener películas' });
    }
  });

  router.post('/moviesupdate', async (req, res) => {
    try {
 
      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto

      const nueva = await Movie.create(req.body);
      console.log('Película agregada:', nueva);
      res.status(201).json(nueva);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/movies/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto

      const movie = await Movie.findById(id);
      if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener película' });
    }
  }
  );
  
  router.put('/movies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto

      const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedMovie) return res.status(404).json({ message: 'Película no encontrada' });
      res.json(updatedMovie);
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar película' });
    }
  }
  );

  router.delete('/moviesdelete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto

      const deletedMovie = await Movie.findByIdAndDelete(id);
      if (!deletedMovie) return res.status(404).json({ message: 'Película no encontrada' });
      res.json({ message: 'Película eliminada' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar película' });
    }
  }
  );
  
  
      
module.exports = router;