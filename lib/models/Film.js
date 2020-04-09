const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  role: {
    type: String,
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor',
    required: true
  },
});

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [castSchema],
},
{
  id: false,
  toJSON: { virtuals: true }
});
schema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'film',
  options: {
    limit: 5
  }
});


module.exports = mongoose.model('Film', schema);
