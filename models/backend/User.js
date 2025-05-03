
const getModelUser = (conn) => {
  const userSchema = new conn.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    listaPeliculas: [{ type: conn.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  return userSchema;
}


module.exports = {

  getModelUser

}



