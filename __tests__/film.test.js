require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('Film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor;
  let film;
  let studio;
  beforeEach(async() => {
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
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates a Film', () => {
    return request(app)
      .post('/api/v1/film')
      .send({
        title: 'The Irishman',
        studio: studio._id,
        released: 2019,
        cast: [{ role: 'Jimmy Hoffa', actor: actor._id }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'The Irishman',
          studio: studio._id.toString(),
          released: 2019,
          cast: [{ _id: expect.any(String), role: 'Jimmy Hoffa', actor: actor._id.toString() }],
          __v: 0
        });
      });
  });
  it('gets all Films', async() => {
    const films = await Film.create([
      { title: 'what', studio: studio._id, released: Date.now(), cast: [{ role: 'Who', actor: actor._id }] },
      { title: 'huh', studio: studio._id, released: Date.now(), cast: [{ role: 'What', actor: actor._id }]  },
      { title: 'maybe', studio: studio._id, released: Date.now(), cast: [{ role: 'I dont give a damn', actor: actor._id }]  }
    ]);

    return request(app)
      .get('/api/v1/film')
      .then(res => {
        films.forEach(film => {
          expect(res.body).toContainEqual({
            _id: film._id.toString(),
            title: film.title,
            studio: { _id: expect.any(String), name: expect.any(String), },
            released: film.released,
            __v: 0
          });
        });
      });
  });
  
  it('gets an film by id', async() => {
    return request(app)
      .get(`/api/v1/film/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: expect.any(String),
          studio:  JSON.parse(JSON.stringify(studio)),
          released: expect.any(Number),
          cast: [{ _id: expect.any(String), role: expect.any(String), actor: actor._id.toString() }],
          review: expect.any(Array),
          __v: 0
        });
      });
  });
  
});
