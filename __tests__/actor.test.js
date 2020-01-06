require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('Actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor;
  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Robert De Niro',
      dob: new Date('8/17/1943'),
      pob: 'New York City'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates an Actor', () => {
    return request(app)
      .post('/api/v1/actor')
      .send({
        name: 'Robert De Niro',
        dob: new Date('8/17/1943'),
        pob: 'New York City'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Robert De Niro',
          dob: expect.any(String),
          pob: 'New York City',
          __v: 0
        });
      });
  });
  it('gets all Actors', async() => {
    const actors = await Actor.create([
      { name: 'Robert De Niro', dob: new Date('08/17/1943'), pob: 'New York City' },
      { name: 'Tom Hanks', dob: new Date('07/9/1956'), pob: 'Concord' },
      { name: 'Al Pacino', dob: new Date('04/25/1940'), pob: 'New York City' }
    ]);

    return request(app)
      .get('/api/v1/actor')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: expect.any(String),
            dob: expect.any(String),
            pob: expect.any(String),
            __v: 0
          });
        });
      });
  });
  it('gets an Actor by id', async() => {
    return request(app)
      .get(`/api/v1/actor/${actor._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: actor._id.toString(),
          name:  actor.name,
          dob: expect.any(String),
          pob: actor.pob,
          __v: 0
        });
      });
  });
});
