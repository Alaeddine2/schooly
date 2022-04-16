const express = require("express");
const router = express.Router();
const employeeSchema = require("../../schemas/actors/employee_schema");
const tokenSchema = require("../../schemas/token_schema");
const utils = require("../../utils/util_methods");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

//Get all employees
router.post("/retrieve", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      employeeSchema.find().exec().then(employees => {
        res.status(200).json(employees);
      }).catch(err=>{
        res.status(409).json({
          message: err
        });
      });
    });
});

//Get employee By ID
router.post("/retrieve/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      let id = req.params.id;
      employeeSchema
        .find({ _id: id })
        .exec()
        .then((employeeList) => {
          if (employeeList.length < 1) {
            return res.status(401).json({
              message: "ID not found!",
            });
          }
          if (employeeList) {
            res.json(employeeList[0]);
          }
        });
    });
});

//add new employee
router.post("/add", utils.extractToken, (req, res) => {
  employeeSchema.find(
    { $or: [{ phone: req.body.phone }] },
    function (err, matchingTeachers) {
      if (matchingTeachers.length >= 1) {
        console.log(matchingTeachers);
        res.status(409).json({
          message: "employee already exist change the phone number",
        });
      } else {
        const newObjectID = mongoose.Types.ObjectId();
        let employeeModel = new employeeSchema({
          _id: newObjectID,
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone,
          email: req.body.email,
          sex: req.body.sex,
          dob: req.body.dob,
          address: req.body.address,
          salary: req.body.salary,
          reg_date: new Date(),
          field: req.body.field,
          profile_img: req.body.profile_img
        });
        employeeModel
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: "New employee added successfully",
              createdEmployee: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              message: "Adding new employee failed",
              error: err,
            });
          });
      }
    }
  );
});

//Update employee
router.post("/update/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      
        employeeSchema
        .updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
        employeeSchema
        .find({ _id: req.params.id })
        .exec()
        .then((employeeList) => {
          res.status(200).json({
            message: "Updated successfully",
            result: result,
            createdEmployee: employeeList[0],
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
          });
        });
        });
    });
});

//employee Delete
router.delete("/delete/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      employeeSchema.findOneAndDelete({ _id: req.params.id }, (err, employee) => {
        if (err) {
          res.json(err);
        } else {
          res.json("Deleted successfully");
        }
      });
    });
});

router.post("/find", (req, res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  employeeSchema
    .find(query)
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

module.exports = router;
