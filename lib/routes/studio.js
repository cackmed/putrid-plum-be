const { Router } = require('express');
const Studio = require('../models/Studio');


module.exports = Router()
  .post('/', (req, res, next) => {
    Studio
      .create(req.body)
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ address: false })
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Studio
      .findById(req.params.id)
      .populate('films', { title: true }).lean()
      .then(studio => {
        studio.films.forEach(film => {
          delete film.studio;
        }); 
        res.send(studio);
      })
      .catch(next);
  });
