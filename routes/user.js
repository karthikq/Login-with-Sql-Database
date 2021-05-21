/** @format */

const express = require("express");
var router = express.Router();
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dataBase = require("../db");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.render("login");
});
router.post("/", (req, res) => {
  const password = req.body.date;
  const username = req.body.username;
  let errors = [];
  if (!username || !password) {
    errors.push({ msg: "Enter all the fileds" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be 6 char long" });
  }

  if (errors.length > 1) {
    res.render("login", { errors, password, username });
  } else {
    let sql = `SELECT * FROM user_database WHERE username = '${username}'`;

    dataBase.query(sql, function (error, results, fields) {
      if (error) throw error;
      else {
        if (results.length == 0) {
        } else {
          bcrypt.compare(password, results[0].password, function (err, result) {
            if (result == true) {
              let token = jwt.sign({ email: username }, "shhhh");
              res.cookie("user", token, { httpOnly: true });

              res.redirect("/home");
            } else {
              errors.push({ msg: "Password Entered is Wrong" });
              res.render("login", { errors, password, username });
            }
          });
        }
      }
    });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const password = req.body.date;
  const username = req.body.username;
  const password2 = req.body.password2;

  let errors = [];

  if (!username || !password || !password2) {
    errors.push({ msg: "Enter all the fileds" });
  }
  if (!username) {
    errors.push({ msg: "Enter the username" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password should be 6 char long" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password don't match" });
  }

  if (errors.length > 1) {
    res.render("register", { errors, password, password2, username });
  } else {
    let sql = `SELECT * FROM user_database WHERE username = '${username}'`;

    dataBase.query(sql, function (error, results, fields) {
      if (error) console.log(error);

      if (results.length == 0) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          console.log(hash);

          let data = { username: username, password: hash };

          let sql = "INSERT INTO user_database SET ?";

          dataBase.query(sql, data, function (error, results) {
            if (error) console.log(error);
            else {
              let token = jwt.sign({ email: username }, "shhhh");
              res.cookie("user", token, { httpOnly: true });
              res.redirect("/home");
            }
          });
        });
      } else {
        errors.push({ msg: "Username Exists" });
        res.render("register", { errors, password, password2, username });
      }
    });
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});
module.exports = router;
