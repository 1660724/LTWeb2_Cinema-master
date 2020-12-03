var Sequelize = require('sequelize');
var sequelize = '';
if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: true //false
    });
} else {
    // the application is executed on the local machine
    sequelize = new Sequelize('postgres://postgres:asdasd@127.0.0.1:5432/wings_cinema');
}
module.exports = sequelize;