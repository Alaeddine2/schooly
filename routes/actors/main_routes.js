const express = require("express");
const app = express();
const adminRoutes = require("./admin_routes");
const studentRoutes = require("./student_routes");
const teacherRoutes = require("./teacher_routes");
const employeeRoutes = require("./employee_routes");

app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/employee", employeeRoutes);

module.exports = app;