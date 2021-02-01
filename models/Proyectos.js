const { DataTypes } = require("sequelize");
const db = require("../config/db");
const slug = require('slug');
const shortId = require('shortid');

const Proyectos = db.define("proyectos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: DataTypes.STRING,
  url: DataTypes.STRING,
},
{
  hooks: {
    beforeCreate(proyecto) {
      const url = slug(proyecto.nombre);
      proyecto.url = `${url}-${shortId.generate()}`;
    }
  }
}
);

module.exports = Proyectos;
