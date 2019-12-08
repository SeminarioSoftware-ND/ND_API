const mongoose = require("mongoose");
const shortid = require("shortid");
const slug = require("slug");
const Schemma = mongoose.Schema;

const impresionSchemma = new Schemma({
  documento: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  tamanio: {
    type: String,
    trim: true
  },
  tipoHoja: {
    type: String,
    trim: true,
    default: "Carta"
  },
  cantidadHojas: {
    type: Number,
    default: 0
  },
  especificaciones: {
    type: String
  },
  usuario: {
    type: Schema.objectId,
    ref: "Usuario"
  },
  estado: {
    type: Number,
    default: 1
  },
  url: {
    type: String
  },
  fechaEntrega: {
    type: Date,
    default: Date.now
  }
});

// Middleware para generar el url
impresionSchemma.pre("save", function(next) {
  //creamos la url
  const url = slug(this.documento);
  this.url = `${url}-${shortid.generate()}`;

  next();
});
