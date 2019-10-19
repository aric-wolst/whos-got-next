const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['facebookId', 'email'],
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

module.exports = authSchema
