const mongoose = require("mongoose");
const slug = require("slug");
const shortid = require("shortid");
const Schema = mongoose.Schema;

// definimos el esquema a utilizar

const productoSchemma = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: Schema.ObjectId,
    ref: "Categoria"
  },
  cantidad: {
    type: Number,
    default: 1
  },
  registradoPor: {
    type: Schema.ObjectId,
    ref: "Usuario"
  },
  fechaDeCreacion: {
    type: String,
    default: Date.now
  },
  imagen: {
    type: String,
    default: "productoImagen.jpg"
  },
  precio: {
    type: Number
  },
  estado: {
    type: Number,
    default: 1
  },
  url: {
    type: String,
    trim: true
  }
});

productoSchemma.pre("save", function(next) {
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

module.exports = mongoose.model("Producto", productoSchemma);
