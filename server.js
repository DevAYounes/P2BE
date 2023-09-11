const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv").config();
const router = require("./api/api");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//api
app.use(router);

var port = process.env.PORT || 2000;

app.listen(port, function () {
  console.log(`Server ON in Port ` + port);
});

