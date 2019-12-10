const Categoria = require("../models/Categoria");
const shortid = require("shortid");
const multer = require("multer");
const path = require("path");

// Mostrar una imagen  de categoría
exports.mostrarImagen = (req, res, next) => {
  console.log("petición");
  var options = {
    root: path.join(__dirname, "../public/uploads/categorias/"),
    dotfiles: "deny"
  };

  var fileName = req.query.url;

  res.status(200).sendFile(path.resolve(`${options.root}/${fileName}`));
};

//  Obtener la lista de categorias habilitadas
exports.listarCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({});
    // verificamosis hay categorias a mostar
    if (!categorias) {
      res.status(404).send({ mensaje: "No hay cantegorias registradas." });
    }

    res.status(200).send(categorias);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al cargar las categorias" });
  }
};

// Obtener la lista de categorias inhabilitadas
exports.listarCategoriasInhabilitadas = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({ estado: 0 });
    if (!categorias) {
      res.status(404).send({ mensaje: "No hay categorías inhabilitadas." });
    }
    res.status(200).send({ categorias });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al cargar las categorías." });
  }
};
// Obtener la información de una categoria en particular
exports.mostrarCategoria = async (req, res, next) => {
  try {
    const laCategoria = await Categoria.find({ url: req.params.url });
    if (!laCategoria) {
      res.status(404).send({
        mensaje: "La categoría especificada no se encuentra registrada."
      });
    }
    res.status(200).send(laCategoria);
  } catch (error) {
    res.status(422).send({ error: "Ocurrió un error al cargar la categoría." });
  }
};
// Agregar una nueva categoría
exports.agregarCategoria = async (req, res, next) => {
  // obtenemos los datos del req.body
  const categoria = new Categoria(req.body);
  console.log(req.body);
  ///validamos que los datos sean correctos
  if (!categoria.nombre) {
    res
      .status(422)
      .send({ mensaje: "Necesitas ingresar el nombre de la categoría" });
  } else if (!categoria.descripcion) {
    res
      .status(422)
      .send({ mensaje: "Necesitas ingresar la descripción de la categoría" });
  } else {
    categoria.fechaCreacion = Date.now();
    try {
      await categoria.save();
      res.status(200).send({ mensaje: "Categoría registrada correctamente." });
    } catch (error) {
      res
        .status(422)
        .send({ error: "Ocurrió un error al guardar la categoría." });
    }
  }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res, next) => {
  try {
    const laCategoria = await Categoria.findOneAndUpdate(
      {
        url: req.params.url
      },
      req.body,
      { new: true }
    );
    res.status(200).send({ mensaje: "Categoría actualizada correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de actualizar la categoría-"
    });
  }
};

// Inhabilitar una categoría
exports.inhabilitarCategoria = async (req, res, next) => {
  try {
    const laCategoria = await Categoria.findOneAndUpdate(
      { url: req.params.url },
      { estado: 0 },
      { new: true }
    );

    res.status(200).send({ mensaje: "Categoría inhabilitada correctamente" });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ha ocurrido un error durante la inhabilitación." });
  }
};

// Habilitar una categoria
exports.habilitarCategoria = async (req, res, next) => {
  try {
    const laCategoria = await Categoria.findOneAndUpdate(
      { url: req.params.url },
      { estado: 1 },
      { new: true }
    );

    res.status(200).send({ mensaje: "Categoría habilitada correctamente" });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ha ocurrido un error durante la habilitación." });
  }
};

// función para subir imagen de usuario
// Subir una imagen al servidor
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
      cb(null, __dirname + "../../public/uploads/categorias");
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
