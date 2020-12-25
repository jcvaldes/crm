const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  // is_deleted: {
  //   type: Boolean,
  //   default: false,
  // },
  created_on: {
    type: Date,
    default: Date.now()
  }
  // created_timestamp: {
  //   type: Number,
  //   default: new Date().valueOf(),
  // },
  // updated_on: Date,
  // updated_timestamp: {
  //   type: Number,
  //   default: new Date().valueOf(),
  // },
})

module.exports = mongoose.model('User', UserSchema)
