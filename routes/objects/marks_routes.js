const express = require("express");
const router = express.Router();
const databaseSchema = require("../../schemas/objects/marks_schema");
const utils = require("../../utils/util_methods");

router.post("/retrieve", utils.extractToken, async (req, res) => {
    databaseSchema.find().populate('student').populate('class').populate('subject')
        .skip(req.body.skip)
        .limit(req.body.limit)
        .then(results => {
            res.json(results);
    })
    /*const orders = await databaseSchema.aggregate([
        //{$match: {year: "2022-2023"}},
        {$group: {
            _id: '$student_id',
            "student" : {"$addToSet":"$student"},
            "class" : {"$push":"$class"},
            "marksList" : {"$addToSet":"$marks"},
            "sbjectsList" : {"$addToSet":"$subject"},
            "year" : {"$addToSet":"$year"},
            "semester": {"$addToSet":"$semester"}
        }},
        { $lookup: { from: 'm_students', localField: 'student', foreignField: '_id', as: 'student' } },
        { $lookup: { from: 'm_classes', localField: 'class', foreignField: '_id', as: 'class' } },
        { $lookup: { from: 'm_sbject', localField: 'subject', foreignField: '_id', as: 'subject' } },])
        console.log(orders);*/
});

router.get("/retrieve", utils.extractToken, async (req, res) => {
    const marks = await databaseSchema.aggregate([
        //{$match: {year: "2022-2023"}},
        {$group: {
            _id: '$student_id',
            "student" : {"$addToSet":"$student"},
            "class" : {"$push":"$class"},
            "marksList" : {"$addToSet":"$marks"},
            "sbjectsList" : {"$addToSet":"$subject"},
            "year" : {"$addToSet":"$year"},
            "semester": {"$addToSet":"$semester"}
        }},
        { $lookup: { from: 'm_students', localField: 'student', foreignField: '_id', as: 'student' } },
        { $lookup: { from: 'm_classes', localField: 'class', foreignField: '_id', as: 'class' } },
        { $lookup: { from: 'm_sbject', localField: 'subject', foreignField: '_id', as: 'subject' } },
        ])
        res.json(marks);
});

//get all marks of a year
router.post("/retrieve/date", async (req, res) => {
    databaseSchema.find({year: req.body.year})
        .skip(req.body.skip)
        .limit(req.body.limit)
        .populate('student')
        .populate('class')
        .populate('subject')
        .then(async results => {
            res.json(results);
    })
});

//Grouped by student
router.post("/retrieve/date/grouped", async (req, res) => {
    const marks = await databaseSchema.aggregate([
        {$match: {year: req.body.year}},
        { $unwind : "$year" },
        {$group: {
            _id: '$student_id',
            "student" : {"$first":"$student"},
            "class" : {"$first":"$class"},
            "marksList" : {"$push":"$marks"},
            "sbjectsList" : {"$push":"$subject"},
            "year" : {"$push":"$year"},
            "semester": {"$push":"$semester"}
        }},
        { $lookup: { from: 'm_students', localField: 'student', foreignField: '_id', as: 'student' } },
        { $lookup: { from: 'm_classes', localField: 'class', foreignField: '_id', as: 'class' } },
        { $lookup: { from: 'm_sbject', localField: 'subject', foreignField: '_id', as: 'subject' } },
        {$limit: req.body.limit == null ? 10000 : req.body.limit},
        {$skip: req.body.skip== null ? 0 : req.body.skip}
        ])
        res.json(marks);
});

//get all marks of a by user and date
router.post("/retrieve/student", async (req, res) => {
    databaseSchema.find({year: req.body.year, student_id: req.body.student_id})
        .skip(req.body.skip)
        .limit(req.body.limit)
        .populate('student')
        .populate('class')
        .populate('subject')
        .then(async results => {
            res.json(results);
    })
});

//get all marks of a year
router.post("/retrieve/class", async (req, res) => {
    databaseSchema.find({year: req.body.year, class_id: req.body.class_id})
        .skip(req.body.skip)
        .limit(req.body.limit)
        .populate('student')
        .populate('class')
        .populate('subject')
        .then(async results => {
            res.json(results);
    })
});

//get all marks of a year
router.post("/retrieve/class/grouped", async (req, res) => {
   const marks = await databaseSchema.aggregate([
    {$match: {year: req.body.year, class_id: req.body.class_id}},
    { $unwind : "$year" },
    {$group: {
        _id: '$student_id',
        "student" : {"$first":"$student"},
        "class" : {"$first":"$class"},
        "marksList" : {"$push":"$marks"},
        "sbjectsList" : {"$push":"$subject"},
        "year" : {"$push":"$year"},
        "semester": {"$push":"$semester"}
    }},
    { $lookup: { from: 'm_students', localField: 'student', foreignField: '_id', as: 'student' } },
    { $lookup: { from: 'm_classes', localField: 'class', foreignField: '_id', as: 'class' } },
    { $lookup: { from: 'm_sbject', localField: 'subject', foreignField: '_id', as: 'subject' } },
    {$limit: req.body.limit == null ? 10000 : req.body.limit},
    {$skip: req.body.skip== null ? 0 : req.body.skip}
    ])
    res.json(marks);
});

//get student averge
router.post("/retrieve/student/averge", async (req, res) => {
    databaseSchema.find({year: req.body.year, student_id: req.body.student_id,semester: req.body.semester})
        .populate('student')
        .populate('class')
        .populate('subject')
        .then(async results => {
            var marks = [];
            var subjectInfoList = [];
            var coeff = [];
            results.forEach((data) => {
                if(data.subject != null){
                    console.log(data.marks);
                    console.log(data.subject.subject);
                    console.log(data.subject.multiple_value);
                    subjectInfoList.push({
                        "subjectName": data.subject.subject,
                        "mark": data.marks,
                        "multiple_value": data.subject.multiple_value,
                    })
                    marks.push(data.marks)
                    coeff.push(data.subject.multiple_value) 
                }
            });
            var averge = 0.0;
            var coeffValue = 0;
            for(i = 0; i < marks.length; i++){
                averge += (marks[i] * coeff[i]);
                coeffValue += coeff[i];
            }
            if((averge > 0) && (coeffValue > 0)){
                averge = averge / coeffValue;
            }
            res.status(200).json({
                message: "success getting data",
                subjectData: subjectInfoList,
                average: averge
            });
    })
});

router.post("/retrieve/:id", (req, res) => {
    let id = req.params.id;
    databaseSchema.find({_id: id})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "ID not found!"
                });
            }
            if (resultList) {
                res.json(resultList[0]);
            }
        })
});

router.post("/add", (req, res) => {
    let databaseModel = new databaseSchema(req.body);
    databaseModel
        .save()
        .then(result => {
            res.status(200).json({
                message: "Added successfully",
                createdParent: result
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Adding new failed",
                error: err
            });
        });
});

router.post("/update/:id", (req, res) => {
    databaseSchema.updateOne({_id: req.params.id}, req.body)
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

router.delete("/delete/:id", (req, res) => {
    databaseSchema.findOneAndDelete(
        {_id: req.params.id},
        (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json("Deleted successfully");
            }
        }
    );
});

module.exports = router;
