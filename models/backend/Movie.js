const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  Titulo: String,
  Actores: String,
  Anio: Number,
  Categoria: String,
  Sinopsis: String,
  Imagen: String
}, { collection: 'movie' }); // <- aquí va "movie"

module.exports = mongoose.model('Movie', movieSchema);
