const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true
  },
  class_lvl: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true
  },
});

const compiledSchema = mongoose.model(
  "m_classes",
  schema
);
module.exports = compiledSchema;
