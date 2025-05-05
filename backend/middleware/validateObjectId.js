const { Types } = require('mongoose');  

const validateObjectId = (req, res, next) => { 

  const id = req.params.id || req.body._id; // Obtener el ID del cuerpo o de los parámetros

  if(Types.ObjectId.isValid(id) || Types.ObjectId.isValid(id)) next();
  else res.status(400).json({ message: 'ID inválido' });
  
};

module.exports = { validateObjectId };