const express = require("express");
const router = express.Router();
const teacherSchema = require("../../schemas/actors/teacher_schema");
const tokenSchema = require("../../schemas/token_schema");
const utils = require("../../utils/util_methods");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

//Get all teachers
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
      teacherSchema.find((err, teacher) => {
        if (err) {
          console.log(err);
        } else {
          res.json(teacher);
        }
      });
    });
});

//Get teacher By ID
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
      teacherSchema
        .find({ _id: id })
        .exec()
        .then((teacherList) => {
          if (teacherList.length < 1) {
            return res.status(401).json({
              message: "ID not found!",
            });
          }
          if (teacherList) {
            res.json(teacherList[0]);
          }
        });
    });
});

// Retrieve admin  by ID
router.post("/retrieveList", utils.extractToken, (req, res) => {
    tokenSchema
        .find({ token: req.token })
        .exec()
        .then((resultList) => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token",
                });
            }
            console.log(req.body.list);
            // let id = req.params.id;
            teacherSchema
                .find({ _id : { $in : req.body.list } })
                .exec()
                .then((resultList) => {
                    if (resultList.length < 1) {
                        return res.status(401).json({
                            message: "ID not found!",
                        });
                    }
                    if (resultList) {
                        res.json(resultList);
                    }
                });
        });
});

//add new teacher
router.post("/add", utils.extractToken, (req, res) => {
  console.log('hi');
  teacherSchema.find(
    { $or: [{ nic: req.body.username }, { phone: req.body.phone }] },
    function (err, matchingTeachers) {
      if (matchingTeachers.length >= 1) {
        console.log(matchingTeachers);
        res.status(409).json({
          message: "teacher already exists",
        });
      } else {
        const newObjectID = mongoose.Types.ObjectId();
        let teacherModel = new teacherSchema({
          _id: newObjectID,
          nic: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone,
          email: req.body.email,
          sex: req.body.sex,
          dob: req.body.dob,
          address: req.body.address,
          institute: req.body.institute,
          speciality: req.body.speciality,
          reg_no: req.body.reg_no,
        });
        teacherModel
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: "New teacher added successfully",
              createdTeacher: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              message: "Adding new teacher failed",
              error: err,
            });
          });
      }
    }
  );
});

//Update teacher
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
      teacherSchema
        .find({ _id: req.params.id })
        .exec()
        .then((teacherList) => {
          teacherSchema
        .updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
          res.status(200).json({
            message: "Updated successfully",
            result: result,
            createdTeacher: teacherList[0],
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

//teacher Delete
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
      teacherSchema.findOneAndDelete({ _id: req.params.id }, (err, teacher) => {
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
  teacherSchema
    .find(query)
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

module.exports = router;
