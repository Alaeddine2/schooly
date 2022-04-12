const express = require("express");
const router = express.Router();
const databaseSchema = require("../../schemas/relation/teacher_class_schema");
const teacherSchema = require("../../schemas/actors/teacher_schema");
const classSchema = require("../../schemas/objects/class_schema");

router.post("/retrieve", (req, res) => {
  databaseSchema
    .find()
    .skip(req.body.skip)
    .limit(req.body.limit)
    .then((results) => {
      res.json(results);
    });
});

router.post("/retrieve/class", (req, res) => {
  teacherSchema.find({_id: req.body.teacher_id}).exec().then((teacherList) =>{
    if (teacherList.length < 1) {
      return res.status(401).json({
        message: "Teacher id not found",
        element: "teacher"
      });
    }
    if (teacherList) {
      databaseSchema
        .find({teacher_id: req.body.teacher_id})
        .then((results) => {
          res.json(results);
        });
    }
  });
});

router.post("/retrieve/teacher", (req, res) => {
  classSchema.find({_id: req.body.class_id}).exec().then((classList) =>{
    if (classList.length < 1) {
      return res.status(401).json({
        message: "class id not found",
        element: "class"
      });
    }
    if (classList) {
      databaseSchema
        .find({class_id: req.body.class_id})
        .then((results) => {
          res.json(results);
        });
    }
  });
});

router.post("/retrieve/:id", (req, res) => {
  let id = req.params.id;
  databaseSchema
    .find({ _id: id })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "ID not found!",
        });
      }
      if (resultList) {
        res.json(resultList[0]);
      }
    });
});

router.post("/add", (req, res) => {
  teacherSchema.find({_id: req.body.teacher_id}).exec().then((teacherList) =>{
    if (teacherList.length < 1) {
      return res.status(401).json({
        message: "Teacher id not found",
        element: "teacher"
      });
    }
    if (teacherList) {
      var teacher = teacherList[0];
      classSchema.find({_id: req.body.class_id}).exec().then((classList) =>{
        if (classList.length < 1) {
          return res.status(401).json({
            message: "class id not found",
            element: "class"
          });
        }
        if (classList) {
          var classes = classList[0];
          databaseModel = new databaseSchema({
            teacher_id: req.body.teacher_id,
            class_id: req.body.class_id,
            start_date: new Date()
          });
          databaseModel
            .save()
            .then((result) => {
              res.status(200).json({
                message: "Added successfully",
                createdTeacherClass: databaseModel,
                selectedTeacher: teacher,
                selectedClass: classes
              });
            })
            .catch((err) => {
              res.status(400).json({
                message: "Adding new failed",
                error: err,
              });
            });
        }
      });
    }
  });
});

router.post("/update/:id", (req, res) => {
  databaseSchema
    .updateOne({ _id: req.params.id }, req.body)
    .then((result) => {
      databaseSchema
    .find({ _id: req.params.id })
    .exec()
    .then((resultList) => {
      res.status(200).json({
        message: "Updated successfully",
        newData: resultList[0],
      });
    });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Updating failed",
        error: err,
      });
    });
});

router.delete("/delete/:id", (req, res) => {
  databaseSchema.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json("Deleted successfully");
    }
  });
});

router.post("/find", (req, res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  databaseSchema
    .find(query)
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

module.exports = router;
