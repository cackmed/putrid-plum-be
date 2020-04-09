const { getReview, getReviews, getReviewer, getFilm } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');


describe('Review routes', () => {
  jest.setTimeout(30000);
  it('creates an Review', async() => {
    const reviewer = await getReviewer();
    const film = await getFilm();
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
    jest.setTimeout(30000);
    const reviews = await getReviews();
    return request(app)
      .get('/api/v1/review')
      .then(res => {        
        reviews.forEach(review => {
          expect(res.body).toContainEqual({
            _id: review._id.toString(),
            rating:  expect.any(Number),
            review: expect.any(String),
            film: {
              _id: expect.any(String), title: expect.any(String)
            },
            __v: 0
          });
          expect(res.body).toHaveLength(100);

        });
      });
  });
  it('can delete a review with DELETE', async() => {
    jest.setTimeout(30000);
    const review = await getReview();
    return request(app)
      .delete(`/api/v1/review/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating:  expect.any(Number),
          reviewer: expect.any(String),
          review: expect.any(String),
          film: expect.any(String),
          __v: 0
        });
      });
  });
});
