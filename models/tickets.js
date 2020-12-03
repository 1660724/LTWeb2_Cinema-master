const db = require('../models/db.js');
const sequelize = require('sequelize');

const tickets = db.define('tickets', {
    bookingid: sequelize.TEXT,
    roomid: sequelize.TEXT,
    seat: sequelize.TEXT
});
module.exports = tickets;