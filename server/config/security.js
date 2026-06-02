const helmet = require('helmet');

module.exports = function configureSecurity(app) {
  app.use(helmet());
};
