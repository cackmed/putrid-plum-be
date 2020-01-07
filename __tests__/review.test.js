require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');


describe('Review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer;
  let film;
  let review;
  let studio;
  let actor;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Peter Bradshaw',
      company: 'The Guardian',
    });
    studio = await Studio.create({
      name: 'Universal Studios',
      address: [{ city: 'LA', state: 'Cal', country: 'USA', }]
    });
    actor = await Actor.create({ name: 'Al Pacino', dob: new Date('04/25/1940'), pob: 'New York City' });

    film = await Film.create({
      title: 'The Irishman',
      studio: studio._id,
      released: 2019,
      cast: [{ role: 'Jimmy Hoffa', actor: actor._id }]
    });
    review = await Review.create({
      rating: 5,
      reviewer: reviewer._id,
      review: 'Great movie, Alpachino has a another legendary performance',
      film: film._id
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates an Review', () => {
    return request(app)
      .post('/api/v1/review')
      .send({
        rating: 5,
        reviewer: reviewer._id,
        review: 'Great movie, Alpachino has a another legendary performance',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 5,
          reviewer: expect.any(String),
          review: 'Great movie, Alpachino has a another legendary performance',
          film: expect.any(String),
          __v: 0
        });
      });
  });
  it('gets all Reviews', async() => {
    const reviews = await Review.create([
      { rating: 4, reviewer: reviewer._id, review: 'not bad', film: film._id },
      { rating: 1, reviewer: reviewer._id, review: 'horrific', film: film._id },
      { rating: 3, reviewer: reviewer._id, review: 'could be better', film: film._id },
    ]);

    return request(app)
      .get('/api/v1/review')
      .then(res => {
        reviews.forEach(review => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(review)));
        });
      });
  });

  it('gets an Review by id', async() => {
    return request(app)
      .get(`/api/v1/review/${review._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: expect.any(String),
          rating:  5,
          reviewer: JSON.parse(JSON.stringify(reviewer)),
          review: expect.any(String),
          film: JSON.parse(JSON.stringify(film)),
          __v: 0
        });
      });
  });

  it('can delete a review with DELETE', async() => {
    return request(app)
      .delete(`/api/v1/review/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: review._id.toString(),
          rating:  5,
          reviewer: reviewer._id.toString(),
          review: expect.any(String),
          film: film._id.toString(),
          __v: 0
        });
      });
  });
});
