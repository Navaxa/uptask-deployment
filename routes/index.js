const express = require("express");
const router = express.Router();
const controlador = require("../controllers/proyectoConroller");
const controladorTareas = require("../controllers/tareaController");
const controldorUsuario = require("../controllers/usuraioController");
const authController = require("../controllers/authController");
const { body } = require("express-validator/check");

module.exports = () => {

  router.get("/", 
    authController.usuarioAutentucado, 
    controlador.home
  );

  router.get("/nuevo-proyecto", 
    authController.usuarioAutentucado,
    controlador.formularioProyecto
  );

  router.post(
    "/nuevo-proyecto",
    authController.usuarioAutentucado,
    body("nombre").not().isEmpty().trim().escape(),
    controlador.nuevoProyecto
  );

  router.post(
    "/nuevo-proyecto/:id",
    authController.usuarioAutentucado,
    body("nombre").not().isEmpty().trim().escape(),
    controlador.actualizarProyecto
  );

  router.get("/proyectos/:url", 
    authController.usuarioAutentucado,
    controlador.proyectoPorUrl
  );

  router.get("/proyecto/editar/:id", 
    authController.usuarioAutentucado,
    controlador.editarProyecto
  );

  router.delete("/proyectos/:url", 
    authController.usuarioAutentucado,
    controlador.eliminarProyecto
  );

  router.post("/proyectos/:url",
    authController.usuarioAutentucado,
    controladorTareas.agregarTarea
  );

  router.patch("/tareas/:id",
    authController.usuarioAutentucado,
    controladorTareas.cambiarEstadoTarea
  );

  router.delete("/tareas/:id", 
    authController.usuarioAutentucado,
    controladorTareas.eliminarTarea
  );

  router.get("/crear-cuenta", 
    controldorUsuario.formCurearCuenta
  );

  router.post("/crear-cuenta", 
    controldorUsuario.crearCuenta);

  router.get('/confirmar/:correo', controldorUsuario.confirmarCuenta);

  router.get("/iniciar-sesion", controldorUsuario.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autentificarUsuario);

  router.get('/cerrar-sesion', authController.cerrarSesion);

  router.get('/reestablecer', controldorUsuario.formReestablecerPassword)
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);

  return router;
};
