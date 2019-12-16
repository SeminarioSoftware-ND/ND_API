const passport = require("passport");
const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");
const enviarEmail = require("../handlers/email");

exports.cerrarSesion = (req, res, next) => {
  // cerramos la sesión actual
  try {
    req.logout();
    res.status(200).send({ mensaje: "Sesión finalizada." });
  } catch (error) {
    res.status(422).send({ mensaje: "Error al cerrar sesión." });
  }
};

exports.enviarMensaje = async (req, res) => {
  const usuario = await Usuario.find({ correo: req.body.correo });
  if (!usuario) {
    res.status(404).send({ mensaje: "El correo no existe." });
  } else {
    // enviaremos el email
    await enviarEmail.enviar({
      usuario
    });
    res
      .status(200)
      .send({ mensaje: "Factura enviada a tu correo, gracias por tu compra." });
  }
};
