const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

module.exports = function() {
  // -----------------------------Control de usuarios-----------------------------|

  /*Agregar nuevos usuarios*/
  router.post("/usuarios", usuarioController.agregarUsuario);

  return router;
};
