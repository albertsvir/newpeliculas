const { Types } = require('mongoose');  

const validateObjectId = (req, res, next) => {   
  if (!Types.ObjectId.isValid(req.params.id)) {     
    return res.status(400).json({ message: 'ID no válido' });   
  }   
  next(); 
};

module.exports = { validateObjectId };