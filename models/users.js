const db = require('../models/db.js');
const sequelize = require('sequelize');

const users = db.define('users', {
    name: sequelize.TEXT,
    email: sequelize.TEXT,
    phone: sequelize.TEXT,
    address: sequelize.TEXT,
    password: sequelize.TEXT,
    role: sequelize.TEXT,
    avatar: sequelize.TEXT
});
module.exports = users;