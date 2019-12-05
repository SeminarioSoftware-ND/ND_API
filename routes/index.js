const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

module.exports = function() {
  // ----------------------------------------------------Control de usuarios-------------------------------------------|

  /*Agregar nuevos usuarios*/
  router.post("/usuarios", usuarioController.agregarUsuario);

  // subir imagen
  router.post("/usuarioImagen", usuarioController.subirImagen);

  /*Listar todos los usuarios habilitados*/
  router.get("/usuarios/usuariosHabilitados", usuarioController.listarUsuarios);

  /*Listar todos los usuarios inhabilitados */
  router.get(
    "/usuarios/usuariosInhabilitados",
    usuarioController.listarUsuariosInhabilitados
  );

  /*Listar la información de un usuario */
  router.get("/usuario/:url", usuarioController.mostrarUsuario);

  /*Editar la información de perfil de usuario */
  router.post(
    "/usuario/editarPerfil/:url",
    usuarioController.actualizarUsuario
  );

  /*Inhabiltar un perfil de usuario */
  router.post(
    "/usuarios/inhabilitarPerfil/:url",
    usuarioController.inhabilitarUsuario
  );

  /*Habilitar Perfil de usuario */
  router.post(
    "/usuarios/habilitarPerfil/:url",
    usuarioController.habilitarUsuario
  );

  return router;
};
