const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

// configuramos la estrategia a utilizar

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done, res) => {
      const usuario = await Usuario.findOne({ correo: email });
      // si el usuario no existe
      if (!usuario) {
        return done(null, false, {
          mensaje: "Usuario no registrado"
        });
      }

      // si el usuario existe verificar contraseña

      const verificarPassword = usuario.compararPassword(password);

      if (!verificarPassword) {
        //password incorrecto
        return done(null, false, {
          mensaje: "La contraseña ingresada es incorrecta"
        });
      }

      // usuario y contraseña son correctas
      return done(null, usuario);
    }
  )
);

passport.serializeUser(function(usuario, done) {
  done(null, usuario._id);
});

passport.deserializeUser(async function(id, done) {
  const usuario = await Usuario.findById(id, function(err, usuario) {
    done(err, usuario);
  });
});
/*passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id).exec();
  return done(null, usuario);
});*/

module.exports = passport;
