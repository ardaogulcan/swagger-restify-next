const Runner = require('swagger-node-runner');

const ALL_METHODS = ['del', 'get', 'head', 'opts', 'post', 'put', 'patch'];

const swaggerRestify = (restifyServer, config) =>
  new Promise((resolve, reject) => {
    Runner.create(config, function (error, runner) {
      if (error) {
        return reject(error)
      }

      const connectMiddleware = runner.connectMiddleware();
      const chain = connectMiddleware.middleware();

      ALL_METHODS.forEach((method) => {
        restifyServer[method]('*', (req, res, next) => {
          chain(req, res, (err) => {
            if (err) {
              return next(err);
            }

            if (!res.finished) {
              res.statusCode = 404;
              res.end('Not found');
            }

            next();
          });
        });
      });

      connectMiddleware.register(restifyServer);

      resolve(runner);
    });
  });

module.exports = swaggerRestify;
