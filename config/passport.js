const passport = require("passport");
const LocalStrategy = require("passport-local");

// Referenciar el modelo que se va autentificar
const Usuarios = require("../models/Usuarios");

// Local strategy - Login con credenciales (usuario y password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email: email,
            activo: 1
          },
        });
        // El usuario existe pero la contrasña es incorrecta
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: "La contraseña es incorrecta",
          });
        }

        return done(null, usuario);
      } catch (err) {
        // El usuario no existe
        return done(null, false, {
          message: "Esta cuenta no existe",
        });
      }
    }
  )
);

// Serializar el usuarios
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Desarializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;