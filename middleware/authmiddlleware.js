const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clavesita';

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Encabezado Authorization recibido:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token no enviado o malformado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token);

  try {
    // Verificación más explícita para depuración
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token decodificado correctamente:', decoded);
    
    // Comprueba que la ID del usuario existe en el token
    if (!decoded.id) {
      console.log('El token decodificado no contiene id:', decoded);
      return res.status(403).json({ error: 'Token malformado - sin id de usuario' });
    }
    
    req.user = decoded;
    console.log('req.user asignado:', req.user);
    next();
  } catch (err) {
    console.log('Error al verificar token:', err.message);
    console.log('Error completo:', err);
    return res.status(403).json({ error: 'Token inválido: ' + err.message });
  }
};