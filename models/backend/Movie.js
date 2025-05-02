const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  Titulo: { type: String, required: true },
  Actores: { type: String, required: true },
  Anio: { type: Number, required: true },
  Categoria: { type: String, required: true },
  Sinopsis: { type: String, required: true },
  Imagen: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);