const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  listaPeliculas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Hashea la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
module.exports.UserSchema = UserSchema; // Exporta el esquema si es necesario en otros lugares