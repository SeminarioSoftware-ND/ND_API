const Impresion = require("../models/Impresion");
const multer = require("multer");
const shortid = require("shortid");
const Cliente = require("../models/Usuario");

// listar todas las impresiones

exports.listarImpresiones = async (req, res, next) => {
  try {
    const lasImpresiones = await Impresion.find({});

    if (!lasImpresiones) {
      req
        .status(404)
        .send({ mensaje: "No hay pedido de impresiones a mostar." });
    }
    res.status(200).send({ lasImpresiones });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de cargar pedido de impresiones."
    });
  }
};

// listar impresiones pendientes
exports.listarImpresionesPendientes = async (req, res, next) => {
  try {
    const lasImpresiones = await Impresion.find({ estado: 1 });
    if (!lasImpresiones) {
      res.status(404).send({ mensaje: "No hay impresiones pendientes." });
    }
    res.status(200).send(lasImpresiones);
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de cargar pedido de impresiones."
    });
  }
};

//listar impresiones realizadas

exports.listarImpresionesRealizadas = async (req, res, next) => {
  try {
    const lasImpresiones = await Impresion.find({ estado: 0 });
    if (!lasImpresiones) {
      res
        .status(404)
        .send({ mensaje: "No hay pedido de impresiones realizadas." });
    }
    res.status(200).send(lasImpresiones);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ocurrió un error al cargar pedido de impresiones." });
  }
};

// listar impresión en particular
exports.mostrarImpresion = async (req, res, next) => {
  try {
    const laImpresion = await Impresion.find({ url: req.params.url });
    if (!laImpresion) {
      res
        .status(404)
        .send({ mensaje: "No se encuentra el pedido solicitado." });
    }
    res.status(200).send(laImpresion);
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de cargar el pedido especificado."
    });
  }
};

// agregar una nueva impresión
exports.agregarImpresion = async (req, res, next) => {
  const impresion = new Impresion(req.body);

  const elCliente = await Cliente.find({ correo: req.body.email });

  const Dates = new Date();

  const laFecha = `${Dates.getDate()}/${Dates.getMonth() +
    1}/${Dates.getFullYear()}`;
  const laHora = `${Dates.getHours()}: ${Dates.getMinutes()}: ${Dates.getSeconds()}`;

  const fecha = `${laFecha}-${laHora}`;

  // anexamos el cliente a la impresión
  impresion.cliente = elCliente[0]._id;
  impresion.fecha = fecha;
  impresion.correo = req.body.email;

  // evaluamos que vengan los datos correctos
  if (!impresion.documento) {
    res
      .status(422)
      .send({ mensaje: "Necesitas agregar el archivo a imprimir." });
  } else if (!impresion.tamanio || !impresion.tipoHoja) {
    res.status(422).send({
      mensaje: "Necesitas seleccionar el tipo de hoja y el tamaño del papel."
    });
  } else if (!impresion.cantidadHojas) {
    res
      .status(422)
      .send({ mensaje: "Necesitas especificar la cantidad de hojas." });
  } else {
    // los datos ingresados son correctos
    try {
      await impresion.save();
      res
        .status(200)
        .send({ mensaje: "Solicitud de impresión enviada correctamente." });
    } catch (error) {
      res.status(422).send({
        mensaje:
          "Ocurrió un error al momento de guardar el pedido de impresión."
      });
    }
  }
};

// editar una  impresión
exports.actualizarImpresion = async (req, res, next) => {
  try {
    const laImpresion = await Impresion.findOneAndUpdate(
      {
        url: req.params.url
      },
      req.body,
      { new: true }
    );

    res.status(200).send({ mensaje: "Estado actualizado correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un error al momento de actualizar el pedido de impresión."
    });
  }
};

// eliminar una impresión
exports.eliminarImpresion = async (req, res, next) => {
  try {
    const laImpresion = await Impresion.finOneandDelete(
      {
        url: req.params.url
      },
      { new: true }
    );

    res
      .status(200)
      .send({ mensaje: "Pedido de impresión eliminado correctamente." });
  } catch (error) {
    res.status(422).send({
      error: "Ocurrió un erro al momento de eliminar pedido de impresión."
    });
  }
};

// subir una image
// Subir un archivo al servidor
exports.subirArchivo = (req, res, next) => {
  upload(req, res, function(error) {
    if (error) {
      // Errores de multer
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          res.status(422).send({ mensaje: "Tamaño de documento muy grande" });
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
      cb(null, __dirname + "../../public/uploads/documentos");
    },

    filename: (req, file, cb) => {
      const extension = file.originalname.split(".")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    }
  })),

  // Verificar que es una imagen válida mediante mimetype
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "video/x-flv" ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/quicktime" ||
      file.mimetype === "application/x-mpegURL" ||
      file.mimetype === "video/3gpp" ||
      file.mimetype === "video/x-msvideo" ||
      file.mimetype === "video/x-ms-wmv" ||
      file.mimetype === "video/x-msvideo"
    ) {
      // El callback se ejecuta como true o false
      // se retorna true cuando se acepta el documente
      cb(
        new Error("Formato de archivo no válido, solo documentos e imágenes"),
        false
      );
    } else {
      cb(null, true);
    }
  }
};

const upload = multer(configuracionMulter).single("file");
