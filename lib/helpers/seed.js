const chance = require('chance').Chance();
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = async({ studio = 3, actor = 10, film = 15, reviewer = 5, review = 100 } = {}) => {
  const studios = await Studio.create([...Array(studio)].map(() => ({
    name: chance.name(),
    address: [{ city: chance.city(), state: chance.state(), country: chance.country() }]
  })));
  const actors = await Actor.create([...Array(actor)].map(() => ({
    name: chance.name(),
    dob: chance.date(),
    pob: chance.city()
  })));
  const films = await Film.create([...Array(film)].map(() => ({
    title: chance.name(),
    studio: chance.pickone(studios.map(studio => studio._id)),
    released: chance.date(),
    cast: [{ role: chance.name(), actor: chance.pickone(actors.map(actor => actor._id)) }]
  })));
  const reviewers = await Reviewer.create([...Array(reviewer)].map(() => ({
    name: chance.name(),
    company: chance.company()
  })));
  await Review.create([...Array(review)].map(() => ({
    rating: chance.pickone([1, 2, 3, 4, 5]),
    reviewer: chance.pickone(reviewers.map(reviewer => reviewer._id)),
    review: chance.sentence(),
    film: chance.pickone(films.map(film => film._id))
  })));
};
