const sequelize = require('sequelize');
const db = require('../models/db.js');
const rooms = require('./rooms');

const showings = db.define('showings', {
    starttime: sequelize.TEXT,
    endtime: sequelize.TEXT,
    price: sequelize.BIGINT,
    movieid: sequelize.INTEGER,
    roomid: sequelize.INTEGER,
    date: sequelize.DATE
});

showings.belongsTo(rooms, {foreignKey : 'roomid'});

module.exports = showings;