import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface CustomRequest extends Request {
  user?: unknown;
}

const AuthenticateUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Response<unknown, Record<string, unknown>> | void => {
  let token: string | undefined;

  if (typeof req.body.token === 'string') {
    token = req.body.token;
  } else if (typeof req.query.token === 'string') {
    token = req.query.token;
  } else {
    token = req.headers['x-access-token'] as string | undefined;
  }

  if (token == null) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default AuthenticateUser;
