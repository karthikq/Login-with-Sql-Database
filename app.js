/** @format */

const express = require("express");
const bodyParser = require("body-parser");

const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const countries = require("country-state-picker");
require('dotenv').config();

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/", require("./routes/user"));
function verifyUser(req, res, next) {
  if (req.cookies.user) {
    let decoded = jwt.verify(req.cookies.user, "shhhh");
    req.user = decoded.email;
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/home", (req, res) => {
  let countriesArray = countries.getCountries();
  let state = [];
  res.render("home", { user: req.user, countriesArray, state });
});
app.post("/country", (req, res) => {
  let state = countries.getStates(req.body.countries);
  let countriesArray = countries.getCountries();

  res.render("home", {
    user: req.user,
    state,
    countriesArray,
  });
});
app.post("/state", (req, res) => {
  let state = [];
  state.push(req.body.state);

  let countriesArray = countries.getCountries();
  res.render("home", { state: state, countriesArray, stateName: state });
});

app.listen(3000, function () {
  console.log("server is running");
});
