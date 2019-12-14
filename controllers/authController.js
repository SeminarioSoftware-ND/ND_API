const passport = require("passport");
const Usuario = require("../models/Usuario");

exports.cerrarSesion = (req, res, next) => {
  // cerramos la sesión actual
  try {
    req.logout();
    res.status(200).send({ mensaje: "Sesión finalizada." });
  } catch (error) {
    res.status(422).send({ mensaje: "Error al cerrar sesión." });
  }
};
