const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');



module.exports = Router()
  .post('/', (req, res, next) => {
    Reviewer
      .create(req.body)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .populate('review', { rating: true, review: true, film: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Review
      .find()
      .then(review => { if(!review[0]) {
        Reviewer
          .findByIdAndDelete(req.params.id)
          .then(reviewer => res.send(reviewer));
      } else {
        throw 'unable to delete reviewer that still has existing reviews';
        
      }})
      .catch(next);
  });
