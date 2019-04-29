import expressWinston from 'express-winston';
import winston from 'winston';

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const winstonOptions = {
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.align(),
		winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),

	transports: [
		new winston.transports.Console(),
	],
};

const expressWinstonOptions = {
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
};

expressWinstonOptions.winstonInstance = winston.createLogger(winstonOptions);

export default expressWinston.logger({
  transports: [new winston.transports.Console()],
  expressWinstonOptions
});
