const mongoose = require("mongoose");
const constants = require("../../utils/constants");

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
        default: 2
      },
      sex: {
        type: String,
      },
      dob: {
        type: Date
      },
      address: {
        type: String
      },
      reg_no: {
        type: String
      },
      reg_date: {
        type: Date
      },
      end_date: {
        type: Date
      },
      completed: {
        type: Boolean,
        default: false
      },
      institute: {
        type: String
      },
      speciality: {
        type: String
      },
      profile_img:{
        type: String,
        default: "public/1649836385095.png"
      },
      subject:{type: mongoose.Schema.Types.ObjectId, ref: 'm_subject'}
});

const teacherSchema = mongoose.model('m_teacher', schema);
module.exports = teacherSchema;

