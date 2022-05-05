const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  favorites: [
    { type: Schema.Types.ObjectId, ref: 'Product' } // Many to Many relationship
  ],
  sold_products: [
    { type: Schema.Types.ObjectId, ref: 'Product' } // One to Many Relationship
  ]
})

const User = mongoose.model('User', userSchema);

module.exports = User;