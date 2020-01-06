const mongoose = require('mongoose');
const Studio = require('./Studio');

describe('Studio model', () => {
  it('has a required name', () => {
    const studio = new Studio();
    const { errors } = studio.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and address field', () => {
    const studio = new Studio({
      name: 'Universal Studios',
      address: [{ city: 'LA', state: 'Cal', country: 'USA', }]
    });

    expect(studio.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Universal Studios',
      address: [{ _id: expect.any(mongoose.Types.ObjectId), city: 'LA', state: 'Cal', country: 'USA', }]
    });
  });
});
