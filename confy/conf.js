const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/bdpeliculas'; // Cambia esto si tienes usuario/contraseña

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado a MongoDB.');
  console.log('Base de datos actual:', mongoose.connection.name); // <--- aqu
})
.catch((err) => {
  console.error('Error de conexión a MongoDB:', err);
});

function handleConnect() {
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
}  

module.exports = {handleConnect};