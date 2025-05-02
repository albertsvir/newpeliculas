const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/peliculas'; // Cambia esto si tienes usuario/contraseña

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado a MongoDB.');
})
.catch((err) => {
  console.error('Error de conexión a MongoDB:', err);
});

module.exports = mongoose;