const Usuario = require("../models/Usuario");

// Agregar un nuevo usuario
exports.agregarUsuario = async (req, res, next) => {
  console.log(req.body);
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
