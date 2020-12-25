const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
  order: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'PENDIENTE'
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Order', OrderSchema)
