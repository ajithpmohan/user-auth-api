import * as CustomError from '../errors/index.js';

const offsetPagination = (req, res, next) => {
  if (isNaN(Math.floor(req.query.limit)) || isNaN(Math.floor(req.query.page))) {
    throw new CustomError.BadRequestError(
      'Provide a valid limit and page number values.'
    );
  }

  req.query.limit = Math.floor(req.query.limit) || 10;
  req.query.page = Math.floor(req.query.page) || 1;
  next();
};

export { offsetPagination };
