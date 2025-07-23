// Structured logger for development and production
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

const currentLogLevel = isProduction ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG

interface LogEntry {
  timestamp: string
  level: keyof LogLevel
  message: string
  data?: any
  error?: Error | undefined
  context?: string | undefined
}

class StructuredLogger {
  private formatEntry(entry: LogEntry): string {
    const timestamp = new Date().toISOString()
    const level = entry.level.toUpperCase()
    const context = entry.context ? `[${entry.context}]` : ''
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : ''
    const error = entry.error ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}` : ''
    
    return `[${timestamp}] ${level}${context}: ${entry.message}${data}${error}`
  }

  private shouldLog(level: keyof LogLevel): boolean {
    return LOG_LEVELS[level] >= currentLogLevel
  }

  debug(message: string, data?: any, context?: string) {
    if (this.shouldLog('DEBUG')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        message,
        data,
        context
      }
      console.log(this.formatEntry(entry))
    }
  }

  info(message: string, data?: any, context?: string) {
    if (this.shouldLog('INFO')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message,
        data,
        context
      }
      console.info(this.formatEntry(entry))
    }
  }

  warn(message: string, data?: any, context?: string) {
    if (this.shouldLog('WARN')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message,
        data,
        context
      }
      console.warn(this.formatEntry(entry))
    }
  }

  error(message: string, error?: Error, data?: any, context?: string) {
    if (this.shouldLog('ERROR')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        error,
        data,
        context
      }
      console.error(this.formatEntry(entry))
    }
  }

  // API-specific logging
  api(message: string, endpoint?: string, data?: any) {
    this.info(message, data, `API${endpoint ? `:${endpoint}` : ''}`)
  }

  // Database-specific logging
  db(message: string, operation?: string, data?: any) {
    this.info(message, data, `DB${operation ? `:${operation}` : ''}`)
  }

  // Email-specific logging
  email(message: string, recipient?: string, data?: any) {
    this.info(message, data, `EMAIL${recipient ? `:${recipient}` : ''}`)
  }

  // Auth-specific logging
  auth(message: string, user?: string, data?: any) {
    this.info(message, data, `AUTH${user ? `:${user}` : ''}`)
  }

  // Performance logging
  perf(message: string, duration?: number, data?: any) {
    this.info(message, { duration, ...data }, 'PERF')
  }
}

// Create singleton instance
const logger = new StructuredLogger()

// Export individual functions for convenience
export const log = logger.debug.bind(logger)
export const info = logger.info.bind(logger)
export const warn = logger.warn.bind(logger)
export const error = logger.error.bind(logger)

// Export specialized loggers
export const apiLog = logger.api.bind(logger)
export const dbLog = logger.db.bind(logger)
export const emailLog = logger.email.bind(logger)
export const authLog = logger.auth.bind(logger)
export const perfLog = logger.perf.bind(logger)

// Export the main logger instance
export { logger }

// Legacy compatibility
export const debug = logger.debug.bind(logger) 