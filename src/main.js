async function bootstrap() {
  const express = require('express');
  const httpStatus = require('http-status');
  const config = require('./config/config');
  const { errorHandler } = require('./middlewares/error');
  const ApiError = require('./utils/api-error');

  const app = express();
  const port = config.port;

  // 잘못된 api 접근시 에러처리
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // handle error 처리
  app.use(errorHandler);

  const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}
bootstrap();
