const Usuario = require("../models/Usuario");
const shortid = require("shortid");
const multer = require("multer");

// obtener la lista de usuarios habilitados
exports.listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find({ estado: 1 });
    res.status(200).send(usuarios);
  } catch (error) {
    res
      .status(422)
      .send({ error: "Hay un problema al momento de obtener los usuarios." });
  }
};

//obtener la lista de usuarios inhabilitados
exports.listarUsuariosInhabilitados = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find({ estado: 0 });

    if (!usuarios) {
      res
        .status(404)
        .send({ mensaje: "No hay perfiles de usuario inhabilitados." });
    } else {
      res.status(200).send(usuarios);
    }
  } catch (error) {
    res
      .status(422)
      .send({ error: "Hay un problema al momento de obtener los usuarios." });
  }
};

// obtener la información de un usuario en particular
exports.mostrarUsuario = async (req, res, next) => {
  try {
    const elUsuario = await Usuario.find({ url: req.params.url });

    // validamos su¿i existe el usuario
    if (!elUsuario) {
      res.status(404).send({ error: "El perfil de usuario no existe." });
    }
    res.status(200).send(elUsuario);
  } catch (error) {
    res.status(422).send({
      error: "Ha ocurrido un error al momento de obtener el perfil de usuario"
    });
  }
};

// Agregar un nuevo usuario
exports.agregarUsuario = async (req, res, next) => {
  console.log("nueva solicitud");
  console.log(req.body);
  console.log("**************************************************");
  console.log(req);

  const usuario = new Usuario(req.body);

  // evaluar si se ingresan los datos necesarios.
  if (!usuario.nombre) {
    res
      .status(422)
      .send({ mensaje: "Necesitas ingresar el nombre de usuario." });
  } else if (!usuario.correo) {
    res.status(422).send({ mensaje: "Necesitas ingresar un correo." });
  } else if (!usuario.password) {
    res.status(422).send({ mensaje: "Debe ingresar una contraseña." });
  } else {
    //evaluamos si hay una imagen de perfil
    if (req.file) {
      usuario.imagen = req.file.filename;
    }

    try {
      await usuario.save();
      res.status(200).send({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
      res
        .status(422)
        .send({ mensaje: "Ocurrió un error al momento de guardar el usuario" });
    }
  }
};

// Actualizar la información de un usuario en específico
exports.actualizarUsuario = async (req, res, next) => {
  try {
    const elUsuario = await Usuario.findOneAndUpdate(
      {
        url: req.params.url
      },
      req.body,
      { new: true }
    );

    res.status(200).send({ mensaje: "Perfil actualizado satisfactoriamente." });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ha ocurrido un error durante la actualización." });
  }
};

//Inhabilitar un usuario
exports.inhabilitarUsuario = async (req, res, next) => {
  try {
    const elUsuario = await Usuario.findOneAndUpdate(
      { url: req.params.url },
      { estado: 0 },
      { new: true }
    );

    res
      .status(200)
      .send({ mensaje: "Perfil de usuario inhabilitado satifactoriamente." });
  } catch (error) {
    res
      .status(422)
      .send({ error: "Ha ocurrido un error durante la inhabilitación." });
  }
};

// habilitar un usuario
exports.habilitarUsuario = async (req, res, next) => {
  try {
    const elUsuario = await Usuario.findOneAndUpdate(
      { url: req.params.url },
      { estado: 1 },
      { new: true }
    );

    res
      .status(200)
      .send({ mensaje: "Perfil de usuario habilitado satifactoriamente." });
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
          res.status(422).send({ mensaje: "Ocurrió un error de subida" });
        }
      } else {
        // Errores del usuario
        res.status(422).send({ mensaje: `${error.message}` });
      }
      return;
    } else {
      return next();
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
      cb(null, __dirname + "../..   /public/uploads/perfiles");
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

const upload = multer(configuracionMulter).single("imagen");
