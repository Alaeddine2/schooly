const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
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
      sex: {
        type: String,
      },
      dob: {
        type: Date
      },
      address: {
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
      field: {
        type: String
      },
      salary:{
        type: Number
      },
      profile_img:{
        type: String,
        default: "public/1649870625005.png"
      }
});

const emplyeeSchema = mongoose.model('m_employee', schema);
module.exports = emplyeeSchema;

