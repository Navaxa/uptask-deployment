const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require('crypto');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// Autenticar usuario
exports.autentificarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Los campos son obligatorios",
});

// Verificar si el usuarios esta logeado para tener permisos de visitar las demas rutas
exports.usuarioAutentucado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/iniciar-sesion");
};

// Cerrar sesion
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

exports.enviarToken = async (req, res) => {
  const { email } = req.body; // req.body.email
  const usuario = await Usuarios.findOne({
    where: {
      email: email,
    },
  });

  if (!usuario) {
    req.flash('error', 'No existe esta cuenta');
    res.render('reestablecer', {
        nombreProyecto: 'Restablecer tu contraseña',
        mensajes: req.flash()
    });
  }

  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  await enviarEmail.enviar({
    email: usuario.email,
    subject: 'Restablece tu contraseña',
    resetUrl,
    archivo: 'reestablecer-password'
  });

  req.flash('correcto', 'Se ha enviado un mesaje a tu correo para reestablecer tu contraseña');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  if(!usuario){
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  res.render('resetPassword', {
    nombreProyecto: 'Reestablecer contraseña'
  });

}

exports.actualizarPassword = async (req, res) => {
  // Verifica token valido y fecha de expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte] : Date.now()
      }
    }
  });

  if(!usuario) {
    req.flash('error', 'El token ya expiro, genera otro');
    res.redirect('/reestablecer');
  }

  // Hashear el password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  await usuario.save();

  req.flash('correcto', 'Tu password ha sido modificado');
  res.redirect('/iniciar-sesion');
}
