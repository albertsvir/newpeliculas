
const getModel = async(conn) => {

  const movieSchema = new conn.Schema({
    Titulo: String,
    Actores: String,
    Anio: Number,
    Categoria: String,
    Sinopsis: String,
    Imagen: String
  }, { collection: 'movies' }); // <- aquí va "movie"

  return conn.model('Movie', movieSchema);

}

module.exports = {
  
  getModel

};
