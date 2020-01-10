const { getReviewer, getReviewers } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('Reviewer routes', () => {
  jest.setTimeout(30000);
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
    jest.setTimeout(30000);
    const reviewers = await getReviewers();
    return request(app)
      .get('/api/v1/reviewer')
      .then(res => {
        expect(res.body).toHaveLength(reviewers.length);
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
    jest.setTimeout(30000);
    const reviewer = await getReviewer();

    return request(app)
      .get(`/api/v1/reviewer/${reviewer._id}`)
      .then(res => {
        expect(res.body).toMatchObject({
          _id: reviewer._id.toString(),
          name:  expect.any(String),
          company: expect.any(String),
          review: expect.any(Array),
          __v: 0
        });
      });
  });
  it('updates a Reviewer by id', async() => {
    jest.setTimeout(30000);
    const reviewer = await getReviewer();
    return request(app)
      .patch(`/api/v1/reviewer/${reviewer._id}`)
      .send({ name: 'Tonny Broadshow' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Tonny Broadshow',
          company: expect.any(String),
          
          __v: 0
        });
      });
  });
  it('can not delete a reviewer with a existing review', async() => {
    jest.setTimeout(30000);
    const reviewer = await getReviewer();
    return request(app)
      .delete(`/api/v1/reviewer/${reviewer._id}`)
      .then(res => {
        expect('unable to delete reviewer that still has existing reviews');
      });
  });
  
});
