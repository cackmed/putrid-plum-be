require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('Studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Universal Studios',
      address: [{ city: 'LA', state: 'Cal', country: 'USA', }]
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates a studio', () => {
    return request(app)
      .post('/api/v1/studio')
      .send({
        name: 'Universal Studios',
        address: [{ city: 'LA', state: 'Cal', country: 'USA', }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Universal Studios',
          address: [{ _id: expect.any(String), city: 'LA', state: 'Cal', country: 'USA', }],
          __v: 0
        });
      });
  });
  it('gets all studios', async() => {
    const studios = await Studio.create([
      { name: 'Universal Studios', address: [{ city: 'LA', state: 'Cal', country: 'USA', }] },
      { name: 'Lucas Films', address: [{ city: 'LA', state: 'Cal', country: 'USA', }] },
      { name: 'Pixar', address: [{ city: 'LA', state: 'Cal', country: 'USA', }] }
    ]);

    return request(app)
      .get('/api/v1/studio')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id.toString(),
            name: studio.name,
            address: [{ _id: expect.any(String), city: 'LA', state: 'Cal', country: 'USA', }],
            __v: 0
          });
        });
      });
  });
  it('gets a studio by id', async() => {
    return request(app)
      .get(`/api/v1/studio/${studio._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: studio._id.toString(),
          name:  studio.name,
          address: [{ _id: expect.any(String), city: 'LA', state: 'Cal', country: 'USA', }],
          __v: 0
        });
      });
  });
});
