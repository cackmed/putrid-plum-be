const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  state: {
    type:  String,
    required: true,
  },
  country: {
    type: String, 
    required: true
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: [addressSchema]
},
{
  id: false,
  toJSON: { virtuals: true }
});
schema.virtual('films', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'studio',
  options: {
    limit: 1
  }
});


module.exports = mongoose.model('Studio', schema);
