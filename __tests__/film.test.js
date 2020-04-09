const { getFilm, getFilms, getStudio, getActor } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('Film routes', () => {

  it('creates a Film', async() => {
    jest.setTimeout(30000);
    const studio = await getStudio();
    const actor = await getActor();
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
          studio: expect.any(String),
          released: 2019,
          cast: [{ _id: expect.any(String), role: 'Jimmy Hoffa', actor: expect.any(String) }],
          __v: 0
        });
      });
  });
  it('gets all Films', async() => {
    jest.setTimeout(30000);
    const films = await getFilms();
    return request(app)
      .get('/api/v1/film')
      .then(res => {
        expect(res.body).toHaveLength(films.length);
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
    jest.setTimeout(30000);
    const film = await getFilm();
    return request(app)
      .get(`/api/v1/film/${film._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: film._id.toString(),
          title: expect.any(String),
          studio:  { _id: expect.any(String), name: expect.any(String) },
          released: expect.any(Number),
          cast: [{ _id: expect.any(String), role: expect.any(String), actor: expect.any(String) }],
          review: expect.any(Array),
          __v: 0
        });
      });
  });
  
});
