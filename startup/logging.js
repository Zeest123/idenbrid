const winston = require("winston");
require("winston-daily-rotate-file");
require("express-async-errors");
const MySQL = require("winston-mysql");

const { createLogger, format, transports } = winston;

module.exports = function () {
  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    // exitOnError: false,
    transports: [
      //
      // - Write to all logs with level `info` and below to `app-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
      //
      new transports.File({
        filename: "error.log",
        level: "error",
      }),
      new transports.File({ filename: "combined.log" }),
      new transports.DailyRotateFile({
        filename: "combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m", // Maximum log file size before rotation (e.g., 20MB)
        maxFiles: "7d", // Retain logs for the last 7 days
      }),
      new MySQL({
        host: "localhost",
        user: "root",
        password: "root@123",
        database: "color_management",
        table: "log_exception",
        columns: {
          level: "level",
          message: "message",
          meta: "meta",
          timestamp: "timestamp",
        },
      }),
    ],
    exceptionHandlers: [
      new transports.File({
        filename: "uncaughtExceptions.log",
        level: "error",
      }),

      new MySQL({
        host: "localhost",
        user: "root",
        password: "root@123",
        database: "color_management",
        table: "unhandle_exception",
        columns: {
          level: "level",
          message: "message",
          meta: "meta",
          timestamp: "timestamp",
        },
      }),
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
          //   format.prettyPrint()
        ),
      }),
    ],
  });

  //
  // If we're not in production then **ALSO** log to the `console`
  // with the colorized simple format.
  //
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      })
    );
  }
  global.logger = logger;
};

// module.exports = function validateLogEntry(logEntry) {
// Check if the log entry has the required fields
// if (
//   // !logEntry.level ||
//   !logEntry.message ||
//   !logEntry.meta ||
//   !logEntry.timestamp
// ) {
//   throw new Error("Invalid log entry: missing required fields");
// }
// // Check the data types of the fields
// if (
//   // typeof logEntry.level !== "string" ||
//   typeof logEntry.message !== "string" ||
//   typeof logEntry.meta !== "string" ||
//   !(logEntry.timestamp instanceof Date)
// ) {
//   throw new Error("Invalid log entry: incorrect data types");
// }
// };
