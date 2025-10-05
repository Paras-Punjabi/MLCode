import config from './dotenv.config';
import winston from 'winston';

const { colorize, combine, errors, json, printf, timestamp } = winston.format;

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        errors({ stack: true }),
        printf(
          ({ level, message, timestamp }) =>
            `[${timestamp}] ${level}: ${message}`
        )
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
    }),
  ],
  exitOnError: false,
  defaultMeta: { service: 'auth-service' },
});

export default logger;
