const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(morgan(":method :url :status - :response-time ms "));

app.use(routes);

module.exports = app;
