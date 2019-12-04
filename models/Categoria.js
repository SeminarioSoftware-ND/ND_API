const mongoose = require("mongoose");
const slug = require("slug");
const shortid = require("shortid");
const Schema = mongoose.Schema;

// Definimos el esquema a utilizar

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  estado: {
    type: Number,
    default: 1
  },
  fechaCreacion: {
    type: String,
    trim: true
  },
  fechaModificacion: {
    type: String,
    trim: true
  },
  registradoPor: {
    type: Schema.ObjectId,
    ref: "Usuario"
  },
  url: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.Schema("Categoria", categoriaSchema);
