// import express from 'express';
const express = require("express");
// crea una app de express
const app = express();
const routes = require("./routes/index");
const path = require("path");
const bodyParser = require("body-parser");
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// helpers con funcion
const helper = require('./helpers');

// crea la conexión a la DB
const db = require("./config/db");

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
  .then(() => console.log("Conexión exitosa"))
  .catch((err) => console.log(err));

// Cargar archivos estaticos
app.use(express.static("public"));

// habilita template engine pug
app.set("view engine", "pug");

 // habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Agrega expresss validator a toda la aplicación
// app.use(expressValidator()); 


// Añade carpeta de las vistas
app.set("views", path.join(__dirname, "./views"));

// Agregar flash mensajes
app.use(flash());

app.use(cookieParser());

// sesiones para navegar en diferentes paginas sin volver a autentificarse
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// pasar var dump a las aplicaciones
app.use((request, response, next) => {
  response.locals.vardump = helper.vardump;
  response.locals.mensajes = request.flash();
  response.locals.usuario = {...request.user} || null;
  next();
});


app.use("/", routes());

app.listen(3000);

require('./handlers/email');