const Usuario = require("../models/Usuario");
// obtener la lista de usuario habilitados
exports.listarUsuarios = async (req, res, next) => {};

// Agregar un nuevo usuario
exports.agregarUsuario = async (req, res, next) => {
  const usuario = new Usuario(req.body);

  try {
    await usuario.save();
    res.status(200).send({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al momento de guardar el usuario" });
  }
};

// Actualizar la información de un usuario en específico
exports.actualizarUsuario = async (req, res, next) => {};

//Inhabilitar un usuario
exports.inhabilitarUsuario = async (req, res, next) => {};
