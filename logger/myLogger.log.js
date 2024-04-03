'use strict'

const { createLogger, format, transports } = require('winston')

require('winston-daily-rotate-file')

/*
    error: nghiem trong, anh huong den hoat dong cua code
    warning,
    debug: khi trong moi truong develop,
    info,
    requestId or traceId
*/
class MyLogger {
  constructor () {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`
      }
    )

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH-mm-ss' }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          filename: 'application-%DATE%.info.log',
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD-HH',
          //   datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true, // true: backup zipped archive
          maxSize: '1m', //dung luong file log
          maxFiles: '7d', // neu dat thi se xoa log trong vong 14 ngay,
          level: 'info'
        }),
        new transports.DailyRotateFile({
          filename: 'application-%DATE%.error.log',
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD-HH',
          //   datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true, // true: backup zipped archive
          maxSize: '1m', //dung luong file log
          maxFiles: '7d', // neu dat thi se xoa log trong vong 14 ngay,
          level: 'error'
        })
      ]
    })
  }

  commonParams (params) {
    let context, req, metadata
    if (!Array.isArray(params)) {
      context = params
    } else {
      ;[context, req, metadata] = params
    }
    const requestId = req?.requestId || 'unknown'

    return {
      requestId,
      context,
      metadata
    }
  }

  log (message, params) {
    const paramsLog = this.commonParams(params)
    const logObject = Object.assign({ message }, paramsLog)

    this.logger.info(logObject)
  }

  error (message, params) {
    const paramsLog = this.commonParams(params)
    const logObject = Object.assign({ message }, paramsLog)

    this.logger.error(logObject)
  }
}

module.exports = new MyLogger()
