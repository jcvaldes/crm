const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  availableStock: {
    //existencia
    type: Number,
    required: true,
    trim: true
  },
  price: {
    type: Number,
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
})
// indice para hacer busqueda x ese campo y que sea rapido
ProductSchema.index({ name: 'text' })
module.exports = mongoose.model('Product', ProductSchema)
