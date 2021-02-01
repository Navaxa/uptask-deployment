const nodeMailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");

let transport = nodeMailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user, // generated ethereal user
    pass: emailConfig.password, // generated ethereal password
  },
});

// Generar html
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${archivo}.pug`,
    opciones
  );
  return juice(html);
};

exports.enviar = async (opciones) => {
  const html = generarHTML(opciones.archivo, opciones);
  const text = htmlToText.fromString(html);
  let opcionesEmail = {
    from: "UpTask <no-reply@uptask.com>", // sender address
    to: opciones.email, // list of receivers
    subject: opciones.subject, // Subject line
    text: text, // plain text body
    html, // html body
  };

  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport, opcionesEmail);
};
