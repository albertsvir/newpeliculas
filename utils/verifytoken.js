// utils/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const secretKey = 'clavesita';  // La misma clave secreta
    const decoded = jwt.verify(token, secretKey); // Verifica el token
    return decoded; // Si es válido, devuelve la información decodificada
  } catch (err) {
    throw new Error('Token no válido');
  }
};

module.exports = verifyToken;
