const db = require('../models/db.js');
const sequelize = require('sequelize');

const cinemas = db.define('cinemas', {
    name: sequelize.TEXT,
    address: sequelize.TEXT,
    map: sequelize.TEXT
});
module.exports = cinemas;