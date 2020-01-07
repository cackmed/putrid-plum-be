require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('Reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Peter Bradshaw',
      company: 'The Guardian',
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
