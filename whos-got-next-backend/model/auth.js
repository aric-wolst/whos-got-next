const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["facebookId", "email"],
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  token: {
    type:String,
    required: false
  }
});

module.exports = authSchema
