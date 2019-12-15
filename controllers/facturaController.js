const Factura = require("../models/factura");
const shortid = require("shortid");
const multer = require("multer");
const Cliente = require("../models/Usuario");

// guardar una factura de pedido

exports.guardarFactura = async (req, res, next) => {
  const { productos, total, email } = req.body;

  const factura = new Factura();
  factura.productos = productos;
  factura.total = total;

  // obtenemos el id del cliente
  const elCliente = await Cliente.find({ correo: email });
  const Dates = new Date();

  const laFecha = `${Dates.getDate()}/${Dates.getMonth() +
    1}/${Dates.getFullYear()}`;
  const laHora = `${Dates.getHours()}: ${Dates.getMinutes()}: ${Dates.getSeconds()}`;

  const fecha = `${laFecha}-${laHora}`;

  // asignamos los valores correspondientes a la factura.
  factura.cliente = elCliente[0]._id;
  factura.fecha = fecha;

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
