const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration SSL conditionnelle basée sur l'environnement
const dialectOptions = process.env.NODE_ENV === 'production' 
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize; 