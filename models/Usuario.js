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
  },
  imagen: {
    type: String,
    trim: true
  },
  correo: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  token: {
    type: String,
    trim: true
  },
  expira: {
    type: String
  },
  url: {
    type: String,
    trim: true
  },
  estado: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Usuario", usuarioShema);
