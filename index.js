const axios = require('axios').default;

module.exports = function (session) {
  const Store = session.Store;

  class RemoteStore extends Store {
    constructor(options) {
      super(options);

      if (!options || !options.uri) {
        throw new Error('Missing uri option');
      }

      this.request = axios.create({
        baseURL: options.uri,
        timeout: options.timeout || 6000,
        headers: { 'user-agent': 'connect-remote', 'accept': 'application/json' }
      });
    }

    // Required
    destroy(sid, cb) {
      this.request.delete(`/${sid}`)
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }
    get(sid, cb) {
      this.request.get(`/${sid}`)
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }
    set(sid, session, cb) {
      this.request.put(`/${sid}`, session)
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }

    // Optional
    all(cb) {
      this.request.get('/')
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }
    clear(cb) {
      this.request.delete('/')
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }
    length(cb) {
      this.request.get('/count')
        .then((response) => {
          const len = parseInt(response.data.data);
          cb(null, len)
        })
        .catch(cb);
    }
    // Recommended
    touch(sid, session, cb) {
      this.request.post(`/${sid}`, session)
        .then((response) => {
          cb(null, response.data.data)
        })
        .catch(cb);
    }
  }

  return RemoteStore;
};
