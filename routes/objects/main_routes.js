const express = require("express");
const app = express();
const classRoutes = require("./class_routes");
const subjectRoutes = require("./subject_routes");
const markRoutes = require("./marks_routes");
const feesRoutes = require("./fees_routes");

app.use("/class", classRoutes);
app.use("/subject", subjectRoutes);
app.use('/mark', markRoutes);
app.use('/fees', feesRoutes);

module.exports = app;