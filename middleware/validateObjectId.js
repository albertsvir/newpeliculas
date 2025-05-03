
const mongoose = require('mongoose');

// Middleware para validar si un ID es un ObjectId válido
function validateObjectId(req, res, next) {
  // Verifica si el parámetro ID es válido
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' }); // Responde con un error si no es válido
  }


  next();
}

module.exports = { validateObjectId };
