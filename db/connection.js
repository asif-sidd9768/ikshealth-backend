// database.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});

const connectDatabase = () => {
  connection.connect(function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }

    console.log('Connected to the database as id ' + connection.threadId);
  });
};

module.exports = { connection, connectDatabase };
