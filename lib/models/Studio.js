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
});

module.exports = mongoose.model('Studio', schema);
