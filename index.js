const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const configs = require('./config/config');
const loginRoute = require("./routes/login_route");
const actorRoutes = require("./routes/actors/main_routes");
const objectRoutes = require("./routes/objects/main_routes");
//const path = require('path'); //used for file path

//app.use(express.static(path.join(__dirname, 'public')));

mongoose
    .connect(
        configs.MONGO_URI + "/" + "schooly",
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log("MongoDB database connection established successfully");
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) =>{
    res.send('hi')
})
app.use("/login", loginRoute);
app.use("/actors", actorRoutes);
app.use("/objects", objectRoutes);

const server = app.listen(configs.BACKEND_PORT, function () {
    console.log("Student management system backend server is running on port : " + configs.BACKEND_PORT);
});