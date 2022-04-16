const express = require("express");
const router = express.Router();
const databaseSchema = require("../../schemas/objects/fees_schema");
const utils = require("../../utils/util_methods");

router.post("/retrieve", utils.extractToken, (req, res) => {
    databaseSchema
      .find()
      .populate('student')
      .skip(req.body.skip)
      .limit(req.body.limit)
      .then((results) => {
        res.json(results);
      });
});

router.post("/retrieve/student/date", utils.extractToken, (req, res) => {
    if(req.body.student_id != null){
        if(req.body.year != null){
            databaseSchema
            .find({student_id: req.body.student_id, year: req.body.year})
            .populate('student')
            .skip(req.body.skip)
            .limit(req.body.limit)
            .then((results) => {
                res.json(results);
            });
        }else{
            res.status(400).json({
                message: "set search periode"
            })
        }
    }else{
        res.status(400).json({
            message: "invalid student id"
        })
    }
});

router.post("/retrieve/student/all", utils.extractToken, (req, res) => {
    if(req.body.student_id != null){
        databaseSchema
        .find({student_id: req.body.student_id})
        .populate('student')
        .skip(req.body.skip)
        .limit(req.body.limit)
        .then((results) => {
            res.json(results);
        });
    }else{
        res.status(400).json({
            message: "invalid student id"
        })
    }
});

router.post("/payment/student", utils.extractToken, (req, res) => {
    try {
      if(req.body.student_id != null){
        if(req.body.year != null){
            databaseSchema
            .find({student_id: req.body.student_id, year: req.body.year})
            .populate('student')
            .then((results) => {
                var payed_amount = 0;
                results.forEach((res) =>{
                    payed_amount += res.payed_value;
                })
                res.status(200).json({
                    message: "successfully getting data",
                    total_payed_amount: payed_amount,
                    programmed_payed_value: results[0].student.payed_value_per_year
                })
            });
        }else{
            res.status(400).json({
                message: "set search periode"
            })
        }
    }else{
        res.status(400).json({
            message: "invalid student id"
        })
    }  
    } catch (error) {
        res.status(402).json({
            message: "Failed getting data",
            error: error
        })  
    }
});

//Grouped by student
router.post("/payment/class", utils.extractToken, async (req, res) => {
    const marks = await databaseSchema.aggregate([
        //{$match: {year: req.body.year}},
        { $unwind : "$year" },
        {$group: {
            _id: '$year',
            "student" : {"$push":"$student"},
            "created_date" : {"$push":"$created_date"},
            "payed_value": {"$push":"$payed_value"}
        }},
        { $lookup: { from: 'm_students', localField: 'student', foreignField: '_id', as: 'student' } },
        ])
        res.json(marks);
});

router.post("/add", utils.extractToken, (req, res) => {
    let databaseModel = new databaseSchema({
        payed_value: req.body.payed_value,
        year: req.body.year,
        created_date: new Date(),
        student: req.body.student,
        student_id: req.body.student, 
    });
    databaseModel
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Added successfully",
          createdFees: databaseModel,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Adding new failed",
          error: err,
        });
    });
});

//update payed amout
router.post("/update/:id", utils.extractToken, (req, res) => {
    databaseSchema.updateOne({_id: req.params.id}, {
        "$set": {
          "payed_value": req.body.payed_value,
          "modified_date": new Date()
        }
      })
        .then(result => {
            databaseSchema.find({_id: req.params.id})
        .exec()
        .then(resultList => {
            res.status(200).json({
                message: "Updated successfully",
                created: resultList[0]
            });
        })
            
        })
        .catch(err => {
            res.status(400).json({
                message: "Updating failed",
                error: err
            });
    });
});

module.exports = router;
