import expressWinston from 'express-winston';
import winston from 'winston';

const config = {
  levels: {
    info: 0,
    warn: 1,
    error: 2
  },
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
}

winston.addColors(config.colors)

const consoleTransport = new winston.transports.Console()

const logger = winston.createLogger({
  transports: [
    consoleTransport
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  levels: config.levels
})

const errorLogger = expressWinston.logger({
  transports: [
    consoleTransport
  ],
  meta: false,
  expressFormat: true,
  colorize: true,
  winstonInstance: logger // The magic!
})

export default errorLogger