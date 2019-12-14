const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const shortid = require("shortid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// listar todos los porductos
exports.listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find({}).populate("categoria");

    if (!productos) {
      res.status(404).send({ mensaje: "No hay productos para mostar" });
    }

    // mapeamos el nombre del estado de cada uno
    productos.forEach(productos => {
      if (productos.estado == 1) {
        productos.nombreEstado = "Habilitado";
      } else {
        productos.nombreEstado = "Inhabilitado";
      }
    });

    res.status(200).send(productos);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al momento de listar los productos" });
  }
};

// listar todos los productos inhabilitados
exports.listarProductosInhabilitados = async (req, res, next) => {
  try {
    const productos = await Producto.find({ estado: 0 });

    if (!productos) {
      res
        .status(404)
        .send({ mensaje: "No hay productos inhabilitados para mostrar." });
    }

    res.status(200).send(productos);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al momento de listar los productos." });
  }
};

// mostrar un producto en particular
exports.agregarProducto = async (req, res, next) => {
  const producto = new Producto(req.body);

  // validamos los datos ingresados
  if (!producto.nombre) {
    res
      .status(422)
      .sed({ mensaje: "Necesitas ingresar el nombre del producto." });
  } else if (!producto.descripcion) {
    res
      .status(422)
      .send({ mensaje: "Necesitas ingresar la descripción del producto." });
  } else if (!producto.categoria) {
    res
      .status(422)
      .send({ mensaje: "Necesitas seleccionar la categoría del producto." });
  } else if (!producto.precio) {
    res
      .status(422)
      .send({ mensaje: "Necesitas ingresar el precio del producto." });
  } else {
    try {
      await producto.save();
      res.status(200).send({ mensaje: "Producto registrado correctamente." });
    } catch (error) {
      res
        .status(422)
        .send({ error: "Ocurrió un error al guardar el producto" });
    }
  }
};

// mostrar un producto en particualr
exports.mostrarProducto = async (req, res, next) => {
  try {
    const elProducto = await Producto.find({ url: req.params.url });
    if (!elProducto) {
      res.status(404).send({
        mensaje: "El producto especificado no se encuentra registrado."
      });
    }
    res.status(200).send({ elProducto });
  } catch (error) {
    res.status(422).send({ error: "Ocurrió un error al cargar el producto." });
  }
};

// actualizar un producto
exports.actualizarProducto = async (req, res, next) => {
  // validamos si se cambio de imagen.
  if (
    req.body.imagenActual != req.body.imagen &&
    req.body.imagenActual != "productoImagen.jpg"
  ) {
    // 2. Eliminamos el logo anterior

    fs.unlink(
      path.join(
        __dirname,
        `../public/uploads/productos/${req.body.imagenActual.trim()}`
      ),
      err => {
        if (err) throw err;
      }
    );
  }

  try {
    const elproducto = await Producto.findOneAndUpdate(
      {
        url: req.params.url
      },
      req.body,
      { new: true }
    );
    res.status(200).send({ mensaje: "Producto actualizado correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de actualizar el producto."
    });
  }
};

// inhabilitar un producto
exports.inhabilitarProducto = async (req, res, next) => {
  try {
    const elProducto = await Producto.findOneAndUpdate(
      { url: req.params.url },
      { estado: 0 },
      { new: true }
    );
    res.status(200).send({ mensaje: "Producto inahilitado correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de inahbilitar el producto."
    });
  }
};

// habilitar un producto
exports.habilitarProducto = async (req, res, next) => {
  try {
    const elProducto = await Producto.findOneAndUpdate(
      { url: req.params.url },
      { estado: 1 },
      { new: true }
    );
    res.status(200).send({ mensaje: "Producto habilitado correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de habilitado el producto."
    });
  }
};

// función para subir imagen de producto
exports.subirImagen = (req, res, next) => {
  upload(req, res, function(error) {
    if (error) {
      // Errores de multer
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          res.status(422).send({ mensaje: "Tamaño de imagen muy grande" });
        } else {
          res.status(422).send({ mensaje: `${error.message}` });
        }
      } else {
        // Errores del usuario
        res.status(422).send({ mensaje: `${error.message}` });
      }
      return;
    } else {
      res.status(200).send({ imagen: `${req.file.filename}` });
    }
  });
};

// función para mostrar una imagen
// Mostrar una imagen  de categoría
exports.mostrarImagen = (req, res, next) => {
  var options = {
    root: path.join(__dirname, "../public/uploads/productos/"),
    dotfiles: "deny"
  };

  var fileName = req.query.url;

  res.sendFile(path.resolve(`${options.root}/${fileName}`));
};

// cargar las categorías habilitadas
exports.cargarCategorias = async (req, res, next) => {
  var categoriaFormato = [(label = "")];

  try {
    const lasCategorias = await Categoria.find({ estado: 1 });

    lasCategorias.forEach(cat => {
      categoriaFormato.push({ label: cat.nombre, value: cat._id });
    });

    if (!lasCategorias) {
      res.status(404).send({ mensaje: "No hay categorías disponibles." });
    }
    res.status(200).send(categoriaFormato);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al cargar las categorías." });
  }
};

// listar productos por una categoría
exports.listarProductosCategoria = async (req, res, next) => {
  try {
    // traemos los valores de la categoría seleccionada
    const cat = await Categoria.find({ url: req.query.url });

    const losProductos = await Producto.find({ categoria: cat[0]._id });
    if (!losProductos) {
      res.status(404).send({ mensaje: "No hay productos registrados." });
    }

    res.status(200).send(losProductos);
  } catch (error) {
    res.status(422).send({ error: "Ocurrió un error al cargar los productos" });
  }
};

// Opciones de configuración de Multer
const configuracionMulter = {
  // Tamaño máximo del archivo en bytes
  limits: {
    fileSize: 200000
  },
  // Donde se almacena la imagen
  storage: (fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, __dirname + "../../public/uploads/productos");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    }
  })),

  // Verificar que es una imagen válida mediante mimetype
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      // El callback se ejecuta como true o false
      // se retorna true cuando se acepta la imagen
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no válido. Solo JPEG o PNG."), false);
    }
  }
};

const upload = multer(configuracionMulter).single("file");
