const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clavesita';

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificación más explícita para depuración
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Comprueba que la ID del usuario existe en el token
    if (!decoded.id) {
      return res.status(403).json({ error: 'Token malformado - sin id de usuario' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido: ' + err.message });
  }
};