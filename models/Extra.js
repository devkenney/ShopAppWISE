const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const extraSchema = new Schema({
  image: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  product: { type: Schema.Types.ObjectId, ref: 'Product' } // One to One Relationship
})

const Extra = mongoose.model('Extra', extraSchema);

module.exports = Extra;