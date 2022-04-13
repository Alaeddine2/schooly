const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    objectId: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    cin: {
      type: Number,
    },
    access_level: {
      type: Number,
      default: 0
    },
});

const adminSchema = mongoose.model("m_admin", schema);
module.exports = adminSchema;
