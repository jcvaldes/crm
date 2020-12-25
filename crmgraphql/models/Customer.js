const mongoose = require('mongoose')
const CustomerSchema = new mongoose.Schema({
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
  company: {
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
  phone: {
    type: String,
    trim: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: 'User'
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Customer', CustomerSchema)
