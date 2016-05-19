const User = require('../models/User');

describe('User model', () => {
  const user = new User(1, 'fake-device-id');
  it('should instantiate with correct properties', () => {
    expect(typeof user).toBe('object');
    expect(Object.keys(user).length).toBe(8);
  });
});
