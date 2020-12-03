const sequelize = require('sequelize');
const db = require('../models/db.js');

const rooms = db.define('rooms', {
    name: sequelize.TEXT,
    cinemaid: sequelize.INTEGER
});

module.exports = rooms;