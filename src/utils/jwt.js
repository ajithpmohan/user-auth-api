import jwt from 'jsonwebtoken';

import ENV from './constants.js';

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_LIFETIME
  });
  return token;
};

const validateToken = ({ token }) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, payload }) => {
  const token = createJWT({ payload });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    signed: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax'
  });
};

export { createJWT, validateToken, attachCookiesToResponse };
