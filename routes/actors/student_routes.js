const express = require("express");
const studentSchema = require("../../schemas/actors/student_schema");
const tokenSchema = require("../../schemas/token_schema");
const mongoose = require("mongoose");
const utils = require("../../utils/util_methods");
const databaseSchema = require("../../schemas/objects/class_schema");

const router = express.Router();

//Get all student details
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
      studentSchema.find(function (err, student) {
        if (err) {
          console.log(err);
        } else {
          res.json(student);
        }
      });
    });
});

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
      studentSchema
        .find({ _id: id })
        .exec()
        .then((studentList) => {
          if (studentList.length < 1) {
            return res.status(401).json({
              message: "ID not found!",
            });
          }
          if (studentList) {
            res.json(studentList[0]);
          }
        });
    });
});

// Retrieve students list by them IDs
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
            try {
              studentSchema
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
            } catch (error) {
              return res.status(401).json({
                message: "Invalid Id list",
              });
            }

        });
});

//Add new student to db
router.post("/add", utils.extractToken, (req, res) => {
  studentSchema.find(
    { $or: [{ nic: req.body.username }, { phone: req.body.phone }] },
    function (err, matchingStudents) {
      if (matchingStudents.length >= 1) {
        res.status(409).json({
          message: "Student already exists",
        });
      } else {
        const newObjectID = mongoose.Types.ObjectId();
        const studentModel = new studentSchema({
          _id: newObjectID,
          nic: req.body.username,
          email: req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          sex: req.body.sex,
          dob: req.body.dob,
          phone: req.body.phone,
          reg_no: req.body.reg_no,
          reg_date: new Date()
        });
        studentModel
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "student added",
              createdStudent: result,
            });
          })
          .catch((err) => {
            console.log(err.message);
            res.status(500).json({
              error: err,
            });
          });
      }
    }
  );
});

//Update the student details
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
      studentSchema
        .updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
          studentSchema
          .find({ _id: req.params.id })
          .exec()
          .then((studentList) => {
              res.status(200).json({
                message: "Updated successfully",
                createdStudent: result,
                student: studentList[0]
              });
            })
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
        });
    });
});

// Delete the student
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
      studentSchema.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) res.json(err);
        else res.json("Successfully removed");
      });
    });
});

router.post("/find", (req, res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  studentSchema
    .find({ _id: req.params.id })
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

router.post("/affect/class", (req, res) => {
  databaseSchema
  .find({ _id: req.body.class_id })
  .exec()
  .then((resultList) => {
    if (resultList.length < 1) {
      return res.status(401).json({
        message: "class Id not found",
      });
    }
    if (resultList) {
      studentSchema
        .updateOne({ _id: req.body.student_id }, {
          "$set": {
            "class_id": req.body.class_id,
            "class": req.body.class_id
          }
        })
        .then((result) => {
          studentSchema
          .find({ _id: req.body.student_id })
          .populate('class')
          .exec()
          .then((studentList) => {
              res.status(200).json({
                message: "Successfully affect class",
                createdStudent: result,
                student: studentList[0]
              });
            })
          })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
        });
      });
    }
  })
});

router.post("/retrieveclass", utils.extractToken, (req, res) => {
  databaseSchema
  .find({ _id: req.body.class_id })
  .exec()
  .then((data) => {
    if (data.length < 1) {
      return res.status(401).json({
        message: "class Id not found",
      });
    }
    if (data) {
      studentSchema
        .find({ class_id : req.body.class_id })
        .exec()
        .then((resultList) => {
            if (resultList.length < 1) {
                return res.status(200).json({
                    message: "No student affected to that class",
                });
            }
            if (resultList) {
                res.status(200).json({students: resultList});
            }
        });
      }
    });
});

router.post("/retrieve/payment/all", utils.extractToken, async (req, res) => {
  const sum_payed_value = await studentSchema.aggregate([ {
    $group: {
       _id: null,
       TotalAmount: {
          $sum: "$payed_value_per_year"
        }
      }
  } ] );
  console.log(sum_payed_value);
  res.status(200).json({
    message: "successfully getting whole programmed payed amout",
    TotalAmount: sum_payed_value[0].TotalAmount
  })
});

module.exports = router;
