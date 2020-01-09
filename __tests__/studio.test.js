const { getStudio, getStudios } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');


describe('Studio routes', () => {

  it('creates a studio', () => {
    jest.setTimeout(30000);
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
    jest.setTimeout(30000);
    const studios = await getStudios();
    
    return request(app)
      .get('/api/v1/studio')
      .then(res => {
        expect(res.body).toHaveLength(studios.length);
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id.toString(),
            name: studio.name,
            __v: 0
          });
        });
      });
  });
  it('gets a studio by id', async() => {
    jest.setTimeout(30000);
    const studio = await getStudio();

    return request(app)
      .get(`/api/v1/studio/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name:  studio.name,
          address: [{ _id: expect.any(String), city: expect.any(String), state: expect.any(String), country: expect.any(String), }],
          films: [{ _id: expect.any(String), title: expect.any(String), }],
          __v: 0
        });
      });
  });
});
