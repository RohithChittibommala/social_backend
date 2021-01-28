const { logger } = require("../utils/winstonLogger");

module.exports = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send({ error: "something failed" });
};
