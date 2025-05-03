const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  peliculaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  usuarioSolicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aprobado: Boolean,
  aprobadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('DeleteRequest', deleteRequestSchema);
