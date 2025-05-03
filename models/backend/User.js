const mongoose = require('../../confy/conf');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  listaPeliculas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Exportamos el modelo de usuario
module.exports = mongoose.models.User || mongoose.model('User', userSchema);