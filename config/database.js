var Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Synchronizing any model changes with database.
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log('Database synchronized'); // eslint-disable-line no-console
    })
    .catch((error) => {
        if (error) console.log('An error occured %j', error); // eslint-disable-line no-console
    });

module.exports = sequelize;


