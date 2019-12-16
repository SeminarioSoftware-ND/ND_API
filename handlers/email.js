const emailConfig = require("../config/email");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

// Utilizar template de Handlebars
transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".handlebars",
      partialsDir: __dirname + "/../vistas/emails",
      layoutsDir: __dirname + "/../vistas/emails",
      defaultLayout: ""
    },
    viewPath: __dirname + "/../vistas/emails",
    extName: ".handlebars"
  })
);

exports.enviar = async opciones => {
  const opcionesEmail = {
    from: "NovedadesDaniela <novedadesdaniela1@gmail.com>",
    to: opciones.usuario[0].correo,
    subject: "importante",
    template: "hola",
    context: {
      usuarioNombre: opciones.cliente,
      UsuarioCorreo: opciones.usuario[0].correo,
      productos: opciones.productos,
      total: opciones.total
    }
  };
  console.log(opciones.productos);

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
};
