const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio.'],
    trim: true,
    minLength: [3, 'El título debe tener al menos 3 caracteres.'],
    maxLength: [200, 'El título no puede tener más de 200 caracteres.']
  },
  year: {
    type: Number,
    required: [true, 'El año es obligatorio.'],
    min: [1888, 'El cine no existía antes de 1888.'],
    max: [new Date().getFullYear() + 5, 'El año no puede ser tan futuro.'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un año válido.'
    }
  },
  director: {
    type: String,
    trim: true,
    maxLength: [150, 'El nombre del director no puede tener más de 150 caracteres.']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [1000, 'La descripción no puede tener más de 1000 caracteres.']
  },
  genre: {
    type: String,
    trim: true,
    maxLength: [100, 'El género no puede tener más de 100 caracteres.']
  },
  rating: {
    type: Number,
    min: [0, 'La calificación mínima es 0.'],
    max: [10, 'La calificación máxima es 10.']
  },
  duration: {
    type: Number,
    min: [1, 'La duración mínima es 1 minuto.'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es una duración válida.'
    }
  },
  language: {
    type: String,
    trim: true,
    maxLength: [50, 'El idioma no puede tener más de 50 caracteres.']
  },
  country: {
    type: String,
    trim: true,
    maxLength: [100, 'El país no puede tener más de 100 caracteres.']
  },
  cast: [{
    type: String,
    trim: true,
    maxLength: [150, 'El nombre del actor no puede tener más de 150 caracteres.']
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  } // Referencia al usuario propietario
});
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
