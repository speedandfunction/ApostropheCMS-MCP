// @title Authentication Module Example
// @description Custom authentication configuration and methods

module.exports = {
  options: {
    alias: 'auth'
  },
  init(self) {
    self.enableMiddleware();
  },
  middleware(self) {
    return {
      async checkAuth(req, res, next) {
        if (!req.user) {
          return res.redirect('/login');
        }
        next();
      }
    };
  },
  apiRoutes(self) {
    return {
      post: {
        async login(req) {
          try {
            // Custom login logic here
            return {
              status: 'success',
              data: { /* user data */ }
            };
          } catch (error) {
            return {
              status: 'error',
              message: error.message
            };
          }
        }
      }
    };
  }
};
