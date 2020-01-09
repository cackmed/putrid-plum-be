const { getActor, getActors } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('Actor routes', () => {

  it('creates an Actor', () => {
    jest.setTimeout(30000);
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
    jest.setTimeout(30000);
    const actors = await getActors();

    return request(app)
      .get('/api/v1/actor')
      .then(res => {
        expect(res.body).toHaveLength(actors.length);
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: expect.any(String),
            __v: 0
          });
        });
      });
  });
  it('gets an Actor by id', async() => {
    jest.setTimeout(30000);
    const actor = await getActor();
    return request(app)
      .get(`/api/v1/actor/${actor._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: actor._id.toString(),
          name:  actor.name,
          dob: expect.any(String),
          pob: actor.pob,
          films: [{ _id: expect.any(String), title: expect.any(String), released: expect.any(Number) }],
          __v: 0
        });
      });
  });
});
