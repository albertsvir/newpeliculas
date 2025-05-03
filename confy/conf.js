const mongoose = require('mongoose'); // Importar mongoose para manejar la conexión a MongoDB

const uri = 'mongodb://localhost:27017/bdpeliculas'; // URI de conexión a la base de datos MongoDB
//funcion asinc para conectar a la base de datos
const connectDB = async () => {   // Función para conectar a la base de datos
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    return conn;

  } catch (err) {
    console.error(err);
  }
};

module.exports = { connectDB }; // Exportar la función connectDB para que pueda ser utilizada en otros archivos

