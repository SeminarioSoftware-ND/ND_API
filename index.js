const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const cors = require("cors");
const path = require("path");
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// creamos la constante del servidor
const app = express();

// Definir ruta para archivos estáticos
app.use(express.static("public"));
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
// Habilitar Handlebars como Template Engine
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));

app.set("view engine", "handlebars");

// configuraciónh de cookie-parser
app.use(cookieParser());
app.use(
  session({
    secret: "elSecretoMS",
    resave: false,
    saveUninitialized: false
  })
);

//  Implemetando password
app.use(passport.initialize());
app.use(passport.session());

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

// definiendo la ruta estática

// Implementar las rutas
app.use("/", routes());

// Habilitar el puerto de escucha del servidor
app.listen(9000, () => {
  console.log("Escuchando por el puerto 9000");
});
