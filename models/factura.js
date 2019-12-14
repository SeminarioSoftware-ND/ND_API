const mongoose = require("mongoose");
const slug = require("slug");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const FacturaSchema = new Schema({
  productos: [
    {
      nombre: {
        type: String,
        trim: true
      },
      cantidad: {
        type: Number,
        default: 1
      },
      precio: {
        type: Number,
        default: 0
      },
      subTotal: {
        type: Number,
        default: 0
      }
    }
  ],
  total: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    trim: true
  },
  fecha: {
    type: String,
    trim: true
  }
});

// Middleware para crear url
FacturaSchema.pre("save", function(next) {
  // Crear la URL
  const url = slug(this.productos[0].nombre);
  this.url = `${url}-${shortid.generate()}`;
  //console.log(this.url);

  next();
});

module.exports = mongoose.model("Factura", FacturaSchema);
