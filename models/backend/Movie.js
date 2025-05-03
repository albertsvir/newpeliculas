
const getModel = async(conn) => {

  const movieSchema = new mongoose.Schema({
    Titulo: String,
    Actores: String,
    Anio: Number,
    Categoria: String,
    Sinopsis: String,
    Imagen: String
  }, { collection: 'movie' }); // <- aquí va "movie"

  return conn.model('Movie', movieSchema);

}

module.exports = {
  
  getModel

};
