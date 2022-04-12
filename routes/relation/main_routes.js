const express = require("express");
const app = express();
const teacherClassRoutes = require("./teacher_class_routes");

app.use("/teacherClass", teacherClassRoutes);

module.exports = app;