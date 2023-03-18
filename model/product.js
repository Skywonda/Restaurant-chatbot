const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  productName: {
    type: String
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: Number
  },
},
  { TimeStampz: true }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product