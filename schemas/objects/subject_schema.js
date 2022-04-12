const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  max_mark: {
    type: Number,
    default: 20
  },
  min_mark: {
    type: Number,
    default: 0
  },
  graduation_mark: {
    type: Number,
    default: 10
  },
  multiple_value: {
    type: Number,
    default: 1
  },
  is_active: {
    type: Boolean,
    default: true
  },
});

const compiledSchema = mongoose.model(
  "m_subject",
  schema
);
module.exports = compiledSchema;
