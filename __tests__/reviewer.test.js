require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');



describe('Reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer;
  let studio;
  let film;
  let actor;
  let review;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Peter Bradshaw',
      company: 'The Guardian',
    });
    studio = await Studio.create({
      name: 'Universal Studios',
      address: [{ city: 'LA', state: 'Cal', country: 'USA', }]
    });
    actor = await Actor.create({
      name: 'Robert De Niro',
      dob: new Date('8/17/1943'),
      pob: 'New York City'
    });
    film = await Film.create({
      title: 'The Irishman',
      studio: studio._id,
      released: 2019,
      cast: [{ role: 'Frank Sheeran', actor: actor._id }]
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
  it('creates an Reviewer', () => {
    return request(app)
      .post('/api/v1/reviewer')
      .send({
        name: 'Peter Bradshaw',
        company: 'The Guardian',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Peter Bradshaw',
          company: 'The Guardian',
          __v: 0
        });
      });
  });
  it('gets all Reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Peter Bradshaw', company: 'The Guardian' },
      { name: 'Rex Reed', company: 'New York Observer' },
      { name: 'Barry Norman', company: 'BBC' }
    ]);

    return request(app)
      .get('/api/v1/reviewer')
      .then(res => {
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual({
            _id: reviewer._id.toString(),
            name: expect.any(String),
            company: expect.any(String),
            __v: 0
          });
        });
      });
  });
  it('gets an Reviewer by id', async() => {
    return request(app)
      .get(`/api/v1/reviewer/${reviewer._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: reviewer._id.toString(),
          name:  reviewer.name,
          company: expect.any(String),
          __v: 0
        });
      });
  });
  it('updates a Reviewer by id', async() => {
    return request(app)
      .patch(`/api/v1/reviewer/${reviewer._id}`)
      .send({ name: 'Tonny Broadshow' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Tonny Broadshow',
          company: 'The Guardian',
          // review: [{ 
          //   _id: expect.any(String),
          //   rating: expect.any(Number),
          //   review: expect.any(String),
          //   film: { _id: expect.any(String), title: expect.any(String) }
          // }],
          __v: 0
        });
      });
  });
  it('can delete a reviewer with DELETE', async() => {
    return request(app)
      .delete(`/api/v1/reviewer/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: reviewer.name,
          company: reviewer.company,
          __v: reviewer.__v
        });
      });
  });
});
