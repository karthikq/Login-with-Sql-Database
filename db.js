/** @format */

const mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "nodesql",
  multipleStatements: "true",
});

db.connect((err) => {
  if (err) throw err;
  else {
    console.log("connected to the db");
  }
});

module.exports = db;
