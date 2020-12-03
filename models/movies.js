const db = require('../models/db.js');
const sequelize = require('sequelize');

const movies = db.define('movies', {
    name: sequelize.TEXT,
    release: sequelize.DATE,
    poster: sequelize.TEXT,
    duration: sequelize.TEXT,
    genre: sequelize.TEXT,
    description: sequelize.TEXT,
    trailer: sequelize.TEXT
});
module.exports = movies;