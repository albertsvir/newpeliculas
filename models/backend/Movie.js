
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define el esquema para las películas
const movieSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  director: { type: String, required: true },
  actors: { type: [String], required: true },
  imagenurll: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
}, {
 
  timestamps: true,
  versionKey: false 
});




// Creamos el modelo una sola vez y lo exportamos directamente
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;