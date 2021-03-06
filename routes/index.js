const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const categoriaController = require("../controllers/categoriaController");
const productoController = require("../controllers/productoController");
const impresionController = require("../controllers/impresionController");
const facturaController = require("../controllers/facturaController");
const authController = require("../controllers/authController");
const passport = require("passport");
const path = require("path");

//----------------------------------------------------------------------Acciones de acceso(autenticación)-------------------------------------------//
module.exports = function() {
  // ruta para autenticar accesos
  router.post("/autenticarUsuario", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        res
          .status(422)
          .send({ mensaje: "Correo o contraseña incorrecta ¡Revisa!" });
      } else {
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          return res.status(200).send({
            mensaje: "Bienvenido a tu cuenta   " + user.nombre,
            usuario: user.nombre,
            email: user.correo,
            admin: user.estado
          });
        });
      }
    })(req, res, next);
  });

  // Cerrar sesión
  router.get("/cerrarSesion", authController.cerrarSesion);
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

  // listar categorías inhabilitadas
  router.get(
    "/categoriasInhabilitadas",
    categoriaController.listarCategoriasInhabilitadas
  );

  // listar una caategorí en particular
  router.get("/categoria", categoriaController.mostrarCategoria);

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
  router.post(
    "/habilitarCategoria/:url",
    categoriaController.habilitarCategoria
  );

  //subir una imagen para la categoría
  router.post("/categoriaImagen", categoriaController.subirImagen);

  // mostar imagen de categoría
  router.get("/imagen", categoriaController.mostrarImagen);

  // ----------------------------------------------------Control de productos-------------------------------------------|

  // listar categorías disponibles para los productos
  router.get("/categoriasProducto", productoController.cargarCategorias);

  // listar todos los pruductos
  router.get("/listarProductos", productoController.listarProductos);

  // listar productos por categoría
  router.get(
    "/listarProductoCategoria",
    productoController.listarProductosCategoria
  );

  // listar productos inhabilitados
  router.get(
    "/listarProductosInhabilitados",
    productoController.listarProductosInhabilitados
  );

  // listar un producto en particular
  router.get("/mostrarProducto/:url", productoController.mostrarProducto);

  // agregar un nuevo producto
  router.post("/crearProducto", productoController.agregarProducto);

  // actualizar producto
  router.post(
    "/actualizarProducto/:url",
    productoController.actualizarProducto
  );

  // inhabilitar producto
  router.post(
    "/inhabilitarProducto/:url",
    productoController.inhabilitarProducto
  );

  //Habilitar producto
  router.post("/habilitarProducto/:url", productoController.habilitarProducto);

  // subir imagen de producto

  router.post("/productoImagen", productoController.subirImagen);

  // mostar imagen del producto

  router.get("/imagenProducto", productoController.mostrarImagen);

  // ----------------------------------------------------Control de impresiones-------------------------------------------|
  // listar todas las impresiones
  router.get("/impresiones", impresionController.listarImpresiones);

  // listar pedidos de impresiones pendientes
  router.get(
    "/listarPedidoImpresiones",
    impresionController.listarImpresionesPendientes
  );

  // listar impresiones realizadas
  router.get(
    "/listarPedidoImpresionesRealizadas",
    impresionController.listarImpresionesRealizadas
  );

  // mostrar una pedido de impresión en particular
  router.get("/mostrarImpresion", impresionController.mostrarImpresion);

  // agregar nuevo pedido de impresión
  router.post("/nuevaImpresion", impresionController.agregarImpresion);

  // actuaizar un pedido de impresion
  router.post(
    "/actualizarImpresion/:url",
    impresionController.actualizarImpresion
  );

  // eliminar un pedido de impresión
  router.delete(
    "/eliminarImpresion/:url",
    impresionController.eliminarImpresion
  );

  // subir un archivo al servidor
  router.post("/subirArchivo", impresionController.subirArchivo);

  // descargar un archivo de
  router.get("/descargarDocumento", function(req, res) {
    var root = path.join(__dirname, "../public/uploads/documentos/");
    res.download(`${root}/${req.query.nombreArchivo}`, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("listo");
      }
    });
  });

  // ----------------------------------------------------Control de facturas y pedidos-------------------------------------------|

  // guardar una factura generada
  router.post("/guardarPedido", facturaController.guardarFactura);

  /// enviar factura por correo

  router.post("/enviarCorreo", authController.enviarMensaje);

  return router;
};
