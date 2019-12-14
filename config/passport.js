const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

// configuramos la estrategia a utilizar

passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "password"
    },
    async (correo, password, done) => {
      const usuario = await Usuario.findOne({ correo: correo });

      // si el usuario no existe
      if (!usuario) {
        return done(null, false, {
          mensaje: ["Correo ingresado no es válido, revise"]
        });
      }

      // si el usuario existe verificar contraseña

      const verificarPassword = Usuario.compa;

      if (!verificarPassword) {
        //password incorrecto
        return done(null, false, {
          mensaje: "La contraseña ingresada es incorrecta"
        });
      }

      // usuario y contraseña son correctas
      return null, usuario;
    }
  )
);

passport.serializeUser((usuario, done) => donde(null, usuario._id));

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id).exec();

  return donde(null, usuario);
});

module.exports = passport;
