const express = require('express');
const router = express.Router();
const {connectDB} = require('../../../confy/conf'); // Asegúrate de que la ruta sea correcta
const { getModel } = require('../Movie'); // Modelo de película

// Obtener todas las películas
router.get('/movies', async (req, res) => {
    try {

      const conn = await connectDB(); // Conectar a la base de datos

      const Movie = await getModel(conn); // Asegúrate de que esto esté correcto

        console.log("CONEXION AQUI",conn);

      const movies = await Movie.find({}); 
      console.log(movies); // Verifica que las películas se obtienen correctamente
      res.json(movies);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener películas' });
    }
  });

  router.post('/movies', async (req, res) => {
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

  
    

module.exports = router;