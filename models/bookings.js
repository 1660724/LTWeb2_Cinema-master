const db = require('../models/db.js');
const sequelize = require('sequelize');

const bookings = db.define('bookings', {
    userid: sequelize.INTEGER,
    showingid: sequelize.INTEGER,
    date: sequelize.DATE,
    total: sequelize.INTEGER
});
module.exports = bookings;