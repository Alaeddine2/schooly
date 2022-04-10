const express = require("express");
const app = express();
const adminRoutes = require("./admin_routes");

app.use("/admin", adminRoutes);

module.exports = app;