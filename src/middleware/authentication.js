import User from '../models/User.js';

import * as CustomError from '../errors/index.js';

import { validateToken } from '../utils/jwt.js';

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnAuthenticatedError(
      'Authentication Failed - Token missing'
    );
  }

  try {
    validateToken({ token });
  } catch (error) {
    console.log(error);
    throw new CustomError.UnAuthenticatedError(
      'Authentication Failed - Invalid Token'
    );
  }

  const { email, id, role } = validateToken({ token });

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnAuthenticatedError(
      'Authentication Failed - Invalid User'
    );
  }
  if (!user.isAccountVerified) {
    throw new CustomError.UnAuthenticatedError(
      'Authentication Failed - User not Verified'
    );
  }

  req.user = { email, id, role };
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnAthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

const checkAndSetUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (token && validateToken({ token })) {
    const { email, id, role } = validateToken({ token });
    const user = await User.findOne({ email });
    if (user) {
      req.user = { email, id, role };
    }
  }
  next();
};

export { authenticateUser, authorizePermissions, checkAndSetUser };
