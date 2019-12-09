const Producto = require("../models/Producto");
const shortid = require("shortid");
const multer = require("multer");

// listar todos los porductos
exports.listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find({});
    if (!productos) {
      res.status(404).send({ mensaje: "No hay productos para mostar" });
    }

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
exports.actualizarProdcuto = async (req, res, next) => {
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
      { url: req.params.ur },
      { estado: 1 },
      { new: true }
    );
    res.status(200).send({ mensaje: "Producto habilitado correctamente." });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al momento de habilitar el producto." });
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
