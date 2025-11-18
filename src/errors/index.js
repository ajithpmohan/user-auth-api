import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  // constructor (message) {
  //   super(message);
  // }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 400 Bad Request
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 401 Unauthorized
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class UnAthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 403 UnAthorized
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 404 No found
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 409 Conflict
    this.statusCode = StatusCodes.CONFLICT;
  }
}

class ContentTooLargeError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 413 Content Too Large
    this.statusCode = StatusCodes.ContentTooLargeError;
  }
}

class UnsupportedMediaError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 415 Unsupported Media Type
    this.statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  }
}

class UnprocessableContentError extends CustomAPIError {
  constructor(message) {
    super(message);
    // HTTP Status Code - 422 Unprocessable Content
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

export {
  CustomAPIError,
  BadRequestError,
  UnAuthenticatedError,
  UnAthorizedError,
  NotFoundError,
  ConflictError,
  ContentTooLargeError,
  UnsupportedMediaError,
  UnprocessableContentError
};
