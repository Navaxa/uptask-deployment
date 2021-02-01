const { DataTypes } = require("sequelize");
const db = require("../config/db");
const Proyectos = require("./Proyectos");
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define("Usuarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Agrega un correo valido"
      },
      notEmpty: {
        msg: "Agrega un E-mail"
      }
    },
    unique: {
      args: true,
      msg: "El usaurio ya existe, intenta con otro email"
    }
  },

  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg:'Agrega una contraseña'
      }
    }
  },
  
  activo: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  token: DataTypes.STRING,
  expiracion: DataTypes.DATE
},
{
  hooks: {
    beforeCreate(usuario) {
      usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
    }
  }
});

Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
