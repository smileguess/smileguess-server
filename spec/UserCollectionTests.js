const Users = require('../collections/Users');

describe('User collection', () => {
  const users = new Users();
  it('should create users', () => {
    users.createUser('totallyNotADeviceID');
    const guineaPig = users.getOne(1);
    expect(typeof guineaPig).toBe('object');
    expect(Object.keys(guineaPig).length).toBe(8);
  });
  it('should destroy users', () => {
    expect(users.users.size).toEqual(1);
    users.destroy(1);
    expect(users.users.size).toEqual(0);
  });
  it('should retrieve users', () => {
    users.createUser('stillNotADeviceID');
    expect(typeof users.getOne(2)).toBe('object');
  });
});
