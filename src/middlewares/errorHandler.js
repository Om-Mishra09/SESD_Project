const { Prisma } = require('@prisma/client');

/**
 * Global Error Handler Middleware
 * Catches unhandled exceptions safely and intercepts Prisma Client errors
 * to translate them into standardized JSON HTTP responses.
 */
function errorHandler(err, req, res, next) {
  console.error('🔥 [Unhandled Error]:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  // 1. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = `Conflict: Unique constraint failed. Please ensure the data being submitted is unique.`;
        if (err.meta) message += ` Fields: ${err.meta.target}`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Not Found: The requested target record does not exist.';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Bad Request: A linked relation record structurally failed validation.';
        break;
      default:
        // Graceful fallback for unmapped Prisma known errors
        statusCode = 400;
        message = `Database Request Error: Payload integrity compromised.`;
    }
  } 
  // 2. Prisma Validation Errors (typing mismatch, malformed payload blocks)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Database Validation Error: Invalid payload mapping structure.';
  }
  // 3. Express core payload parsing failures
  else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Bad Request: Malformed JSON payload structurally rejected.';
  }
  // 4. Custom manually thrown Exceptions
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // 5. Raw Native Javascript error fallbacks
  else {
    message = err.message || message;
  }

  // Final Response emission preventing any crashing cycles
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
}

module.exports = errorHandler;
