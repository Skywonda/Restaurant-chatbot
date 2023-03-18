const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product'
  },
  price: {
    type: Number
  },
  owner: {
    type: String,
  },
  quantity: {
    type: String,
    default: '1'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
},
  { TimeStampz: true }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order