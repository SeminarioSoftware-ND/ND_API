const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const cors = require("cors");

// creamos la constante del servidor
const app = express();

//Configuración de conexión a mogo y mongoose
const mongoUri =
  " mongodb+srv://root:SortoDiaz1414@cluster0-we4ac.mongodb.net/novedadesDaniela";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("Conectado con la base de datos");
});

mongoose.connection.on("error", err => {
  console.log("Error al conectar con la base de datos", err);
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Habilitar body -parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Implementar las rutas
app.use("/", routes());

// Habilitar el puerto de escucha del servidor
app.listen(9000, () => {
  console.log("Escuchando por el puerto 9000");
});
