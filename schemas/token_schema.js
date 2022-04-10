const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    }
});

const tokenSchema = mongoose.model('tokens', schema);
module.exports = tokenSchema;
