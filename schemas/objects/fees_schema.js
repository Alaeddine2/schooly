const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    student_id:{
        type: String,
        required: true
    },
    payed_value:{
        type: Number,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    created_date: {
        type: Date
    },
    modified_date: {
        type: Date
    },
    student:{type: mongoose.Schema.Types.ObjectId, ref: 'm_students',required:true},
    is_activate: {
        type: Boolean,
        default: true
    },
});

const compiledSchema = mongoose.model("m_fees", schema);
module.exports = compiledSchema;
