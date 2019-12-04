const Categoria = require("../models/Categoria");
const multer = require("multer");

//  Obtener la lista de categorias habilitadas
exports.listarCategorias = async (req, res, next) => {
  try {
    const categorias = Categoria.find({ estado: 1 });

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
exports.actualizarCategoria = async (req, res, next) => {};

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

// Subir una imagen
