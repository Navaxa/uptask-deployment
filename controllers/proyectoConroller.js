const Proyectos = require("../models/Proyectos");
const Tarea = require("../models/Tareas");

exports.home = async (request, response) => {
  const UsuarioId = response.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});
  response.render("index", {
    nombreProyecto: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto = async (request, response) => {
  const UsuarioId = response.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});
  response.render("nuevoProyecto", {
    nombreProyecto: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (request, response) => {
  const UsuarioId = response.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});

  const { nombre } = request.body;

  let errores = [];

  if (!nombre) {
    errores.push({ text: "Agrega un nombre al proyecto" });
  }

  if (errores.length > 0) {
    response.render("nuevoProyecto", {
      nombreProyecto: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    const usuarioId = response.locals.usuario.id;
    const proyecto = await Proyectos.create({ 
      nombre: nombre,
      UsuarioId: usuarioId
     });
    response.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const UsuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});
  // const urlProyecto = req.params.url;
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      UsuarioId
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  const tareas = await Tarea.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    include: [
      { 
        model: Proyectos 
      }
    ],
  });

  if (!proyecto) {
    return next();
  }

  res.render("tareas", {
    nombreProyecto: "Tareas del proyecto",
    proyecto,
    proyectos,
    tareas,
  });
};

exports.editarProyecto = async (req, res) => {
  const UsuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      UsuarioId
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombreProyecto: "Editar proyecto",
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (request, response) => {
  const UsuarioId = response.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: {
    UsuarioId: UsuarioId
  }});

  const { nombre } = request.body;

  let errores = [];

  if (!nombre) {
    errores.push({ text: "Agrega un nombre al proyecto" });
  }

  if (errores.length > 0) {
    response.render("nuevoProyecto", {
      nombreProyecto: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    await Proyectos.update(
      { nombre },
      {
        where: {
          id: request.params.id,
        },
      }
    );
    response.redirect("/");
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  // query o params para leer los datos que se estan enviando al servidor
  const { urlProyecto } = req.query;

  const resulado = await Proyectos.destroy({
    where: {
      url: urlProyecto,
    },
  });

  if (!resulado) {
    return next();
  }

  res.status(200).send("El proyecto fue eliminado exitosamente");
};
