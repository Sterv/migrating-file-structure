import jwt from 'jsonwebtoken';

const secret = process.env.REACT_APP_JWT_SECRET;
const time = process.env.NODE_ENV === 'production' ?
                process.env.REACT_APP_JWT_TOKEN_EXPIRE_TIME :
                '1s';

// CREATE JWT TOKEN FOR USER
export const generateToken = user => jwt.sign({
  sub: user.id }, secret, { expiresIn: time }
);
