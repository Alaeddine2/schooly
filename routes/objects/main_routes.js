const express = require("express");
const app = express();
const classRoutes = require("./class_routes");

app.use("/class", classRoutes);

module.exports = app;