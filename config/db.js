const { Sequelize } = require("sequelize");
const fs = require('fs');
require('dotenv').config({ path: 'variables.env' });

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
    },
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync( process.env.SSL ),
      },
    },
  }
);

module.exports = db;
