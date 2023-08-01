const express = require('express');
const httpStatus = require('http-status');
const config = require('./config/config');
const logger = require('./config/logger');
const morgan = require('./config/morgan');
const { errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/api-error');

async function bootstrap() {
  const app = express();
  const port = config.port;

  if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }

  // 잘못된 api 접근시 에러처리
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // handle error 처리
  app.use(errorHandler);

  const server = app.listen(port, () => {
    logger.info(`Listening to port ${port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}
bootstrap();
