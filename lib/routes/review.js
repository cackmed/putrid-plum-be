const { Router } = require('express');
const Review = require('../models/Review');


module.exports = Router()
  .post('/', (req, res, next) => {
    Review
      .create(req.body)
      .then(review => res.send(review))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Review
      .find()
      .then(review => res.send(review))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Review
      .findById(req.params.id)
      .populate('reviewer')
      .populate('film')
      .then(review => res.send(review))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review))
      .catch(next);
  });
