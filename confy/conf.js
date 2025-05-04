const mongoose = require('mongoose');

// Usamos mongoose en lugar del driver nativo para mantener consistencia
const uri = 'mongodb://localhost:27017/bdpeliculas';

// Configuración para optimizar conexiones
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Limitar el número de conexiones en el pool
  serverSelectionTimeoutMS: 5000 // Timeout para selección de servidor
};

// Variable para controlar el estado de la conexión
let isConnected = false;

async function connectDB() {
  try {
    // Si ya estamos conectados, reusamos la conexión
    if (isConnected) {
      return mongoose.connection.db;
    }
    
    console.log('Conectando a MongoDB...');
    
    // Eventos para manejo de la conexión
    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('Conexión a MongoDB establecida');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión MongoDB:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
      isConnected = false;
    });
    
    // Conexión a la base de datos
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
    console.log('Cerrando conexión a MongoDB...');
    await mongoose.connection.close();
    isConnected = false;
    console.log('Conexión a MongoDB cerrada');
  }
}

// Señales para manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = { connectDB, closeConnection };