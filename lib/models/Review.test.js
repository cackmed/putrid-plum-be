// const mongoose = require('mongoose');
const Review = require('./Review');

describe('Review model', () => {
  it('has a required rating', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a required review field', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.review.message).toEqual('Path `review` is required.');
  });
  it('has a required reviewer field', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });
  it('has a required film field', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.film.message).toEqual('Path `film` is required.');
  });
});
