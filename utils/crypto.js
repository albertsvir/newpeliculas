// utils/generateUniqueId.js
const crypto = require('crypto');

/**
 * Genera un ID único de 16 bytes codificado en hexadecimal (32 caracteres).
 * Ejemplo de salida: '9f1c2a8b3d4e5f60718293a4b5c6d7e8'
 */
function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = generateUniqueId;
