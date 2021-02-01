const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: DataTypes.STRING(100),
    estado: DataTypes.INTEGER
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;