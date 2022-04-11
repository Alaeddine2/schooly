const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nic: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  is_activate: {
    type: Boolean,
    default: true
  },
  access_level: {
    type: Number,
    default: 3
  },
  sex: {
    type: String,
  },
  reg_no: {
    type: Number
  },
  reg_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  dob: {
    type: Date
  },
  class_id: {
    type: String
  }
});

const studentSchema =  mongoose.model("m_students", schema);
module.exports = studentSchema;
