function Auth0Lock(data) {

  this.on = jest.fn().mockImplementation((event, callback) => {
    if (event === 'authenticated') {
      callback({
        accessToken: 'dummyToken',
        expiresIn: 200,
        idToken: 'dummyAccountToken',
        idTokenPayload: null,
        state: null,
        tokenType: ''
      });
    }

    callback(new Error('UNAUTHORIZED!!!'));
  })

  this.getUserInfo = jest.fn().mockImplementation((event, callback) => {
    if (event === 'dummyToken') {
      callback();
    }
    callback(new Error('UNAUTHORIZED!!!'));
  })
  this.show = jest.fn()
}

module.exports = Auth0Lock;