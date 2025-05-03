const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/bdpeliculas';

const connectDB = async () => {
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

module.exports = { connectDB };

