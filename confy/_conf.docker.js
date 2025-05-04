const mongoose = require('mongoose');

// Usamos mongoose en lugar del driver nativo para mantener consistencia
// const uri = 'mongodb://localhost:27017/bdpeliculas';

const uri = 'mongodb://root:example@localhost:27017/bdpeliculas?authSource=admin';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
};

let isConnected = false;

async function connectDB() {
  try {
    if (isConnected) return mongoose.connection.db;

    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('Conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión MongoDB:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
    });

    await mongoose.connect(uri, options);
    return mongoose.connection.db;
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    throw err;
  }
}


// Función para cerrar la conexión (útil para tests y shutdown limpio)
async function closeConnection() {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
    isConnected = false;
  }
}

// Señales para manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = { connectDB, closeConnection };