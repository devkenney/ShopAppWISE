const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  availability: { type: Boolean, required: true, default: true },
  extra_info: { type: Schema.Types.ObjectId, ref: 'Extra' }, // One to One Relationship
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // One to Many Relationship
  favorite_users: [
    { type: Schema.Types.ObjectId, ref: 'User' } // Many to Many Relationship
  ]
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;