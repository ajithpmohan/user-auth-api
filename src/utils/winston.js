// import  path from 'path';
import winston from 'winston';

// define the custom settings for each transport (file, console)
const options = {
  // file: {
  //   level: 'warn',
  //   filename: path.join(path.dirname(__dirname), '../logs/app.log'),
  //   handleExceptions: true,
  //   maxsize: 5242880, // 5MB
  //   maxFiles: 5,
  //   format: winston.format.combine(
  //     winston.format.timestamp(),
  //     winston.format.json()
  //   )
  // },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
};

// instantiate a new Winston Logger with the settings defined above
const winstonLogger = winston.createLogger({
  transports: [
    // new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
winstonLogger.stream = {
  write: function (message) {
    // use the 'info' log level so the output will be picked up by both
    // transports (file and console)
    winstonLogger.info(message);
  }
};

export default winstonLogger;
