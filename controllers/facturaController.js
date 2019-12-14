const Factura = require("../models/factura");
const shortid = require("shortid");
const multer = require("multer");

// guardar una factura de pedido

exports.guardarFactura = async (req, res, next) => {
  const factura = new Factura(req.body);
  // validamos que vengan productos a guardar
  if (!factura.productos) {
    res.status(422).send({ mensaje: "No hay productos a procesar.¡Revisa!" });
  }

  try {
    await factura.save();
    res.status(200).send({ mensaje: "Orden procesada correctamente." });
  } catch (error) {
    console.log(error);
    res.status(422).send({ error: "Ocurrió un error al guardar el pedido." });
  }
};
