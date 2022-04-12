const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    teacher_id: {
        type: String,
        required: true
    },
    class_id: {
        type: String,
        required: true
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    is_activate: {
        type: Boolean,
        default: true
    }
});


const compiledSchema = mongoose.model("m_teacher_class", schema);
module.exports = compiledSchema;
