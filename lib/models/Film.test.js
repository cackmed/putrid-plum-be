const Film = require('./Film');

describe('Actor model', () => {
  it('has a required title', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('has a required Studio', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });
  it('has a required release date', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.released.message).toEqual('Path `released` is required.');
  });
});
