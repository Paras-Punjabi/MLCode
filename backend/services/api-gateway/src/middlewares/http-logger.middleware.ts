import winston from 'winston';
import morgan from 'morgan';

const { combine, json, timestamp, printf } = winston.format;

const httpLogger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
    process.env.NODE_ENV === 'prod'
      ? json()
      : printf(({ message }) => `${message}`)
  ),
  transports: [new winston.transports.Console()],
});

const httpLoggerMiddleware = morgan(
  process.env.NODE_ENV === 'prod' ? 'combined' : 'dev',
  {
    stream: {
      write: (message) => httpLogger.http(message.trim()),
    },
  }
);

export default httpLoggerMiddleware;
