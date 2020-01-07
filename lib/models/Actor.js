const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  pob: {
    type: String,
    required: true
  }
},
{
  id: false,
  toJSON: { virtuals: true }
});
schema.virtual('films', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'actor',
  options: {
    limit: 5
  }
});

module.exports = mongoose.model('Actor', schema);
