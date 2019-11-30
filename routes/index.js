const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

module.exports = function() {
  // ----------------------------------------------------Control de usuarios-------------------------------------------|

  /*Agregar nuevos usuarios*/
  router.post("/usuarios", usuarioController.agregarUsuario);

  /*Listar todos los usuarios habilitados*/
  router.get("/usuarios/listaDeUsuarios", usuarioController.listarUsuarios);

  /*Listar todos los usuarios inhabilitados */
  router.get(
    "/usuarios/listaDeUsuariosInhabilitados",
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
