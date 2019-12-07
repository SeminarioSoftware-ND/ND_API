const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const categoriaController = require("../controllers/categoriaController");

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

  // ----------------------------------------------------Control de categorías-------------------------------------------|

  // listar todas las categorías disponibles
  router.get("/categorias", categoriaController.listarCategorias);
  return router;
};

// listar categorías inhabilitadas
router.get(
  "/categoriasInhabilitadas",
  categoriaController.listarCategoriasInhabilitadas
);

// listar una caategorí en particular
router.get("/categoria/:url", categoriaController.mostrarCategoria);

// crear una nueva ctegoría
router.post("/crearCategoria", categoriaController.agregarCategoria);

// actualizar una categoría
router.post(
  "/actualizarCategoria/:url",
  categoriaController.actualizarCategoria
);

// inhabilitar  una categoría
router.post(
  "/inhabilitarCategoria/:url",
  categoriaController.inhabilitarCategoria
);

// habilitar una categoría
router.post("/habilitarCategoria/:url", categoriaController.habilitarCategoria);

//subir una imagen para la categoría
router.post("/categoriaImagen", categoriaController.subirImagen);
