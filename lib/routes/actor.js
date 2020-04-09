const { Router } = require('express');
const Actor = require('../models/Actor');


module.exports = Router()
  .post('/', (req, res, next) => {
    Actor
      .create(req.body)
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ dob: false, pob: false })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .populate('films', { title: true, released: true })
      .then(actor => res.send(actor))
      .catch(next);
  });
