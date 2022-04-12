const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true
    },
    class_id: {
        type: String,
        required: true
    },
    subject_id: {
        type: String,
        required: true
    },
    marks: {
        type: Number
    },
    semester: {
        type: Number
    },
    created_date: {
        type: Date
    },
    modified_date: {
        type: Date
    }
});

const compiledSchema = mongoose.model("m_marks", schema);
module.exports = compiledSchema;
