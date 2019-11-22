const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioShema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  apellido: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Usuario", usuarioShema);
