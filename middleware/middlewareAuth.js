// middlewareAuth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'miSecretoSuperSecreto'; // Define tu secreto aquí

const auth = (req, res, next) => {
  // Paso 1: Verificar que el token está presente en los headers
  const token = req.header('Authorization');
  console.log('Token recibido:', token); // Verifica si el token llega

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Paso 2: Verificar el token con el secreto
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded); // Verifica la decodificación del token

    req.user = decoded.user; // Guarda los datos del usuario en req.user
    next(); // Continúa al siguiente middleware o ruta
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = { auth };
