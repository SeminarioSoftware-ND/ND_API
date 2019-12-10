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
    trim: true,
    default: Date.now()
  },
  registradoPor: {
    type: Schema.ObjectId,
    ref: "Usuario"
  },
  imagen: {
    type: String,
    trim: true,
    default: "categoriaDefecto.jpg"
  },
  url: {
    type: String,
    trim: true
  }
});

// Middleware para crear el url
categoriaSchema.pre("save", function(next) {
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;
  next();
});
module.exports = mongoose.model("Categoria", categoriaSchema);
