const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  director: { type: String },
  description: { type: String },
  genre: { type: String },
  rating: { type: Number },
  duration: { type: Number },
  language: { type: String },
  country: { type: String },
  cast: [{ type: String }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Referencia al usuario propietario
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
