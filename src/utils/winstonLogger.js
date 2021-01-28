const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "info.log",
      level: "info",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports.logger = logger;
