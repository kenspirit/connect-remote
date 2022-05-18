const request = require('requestretry');

module.exports = function (session) {
  const Store = session.Store;

  class RemoteStore extends Store {
    constructor(options) {
      super(options);

      if (!options || !options.uri) {
        throw new Error('Missing uri option');
      }

      this.request = request.defaults({
        baseUrl: options.uri,
        json: true,
        timeout: options.timeout || 6000,
        headers: {'user-agent': 'connect-remote'}
      });
    }

    // Required
    destroy(sid, cb) {
      this.request.del(`/${sid}`, cb);
    }
    get(sid, cb) {
      this.request.get(`/${sid}`, (err, response, body) => {
        cb(err, body ? body.data : null);
      });
    }
    set(sid, session, cb) {
      this.request.put(`/${sid}`, { body: session }, (err, response, body) => {
        cb(err, body ? body.data : null);
      });
    }

    // Optional
    all(cb) {
      this.request.get('/', (err, response, body) => {
        cb(err, body ? body.data : null);
      });
    }
    clear(cb) {
      this.request.del('/', cb);
    }
    length(cb) {
      this.request.get('/count', (err, response, body) => {
        const len = parseInt(body ? body.data : null);
        cb(err, len);
      });
    }
    // Recommended
    touch(sid, session, cb) {
      this.request.post(`/${sid}`, { body: session }, (err, response, body) => {
        cb(err, body ? body.data : null);
      });
    }
  }

  return RemoteStore;
};
