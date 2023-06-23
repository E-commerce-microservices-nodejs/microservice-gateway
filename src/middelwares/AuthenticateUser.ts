<<<<<<< HEAD
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


interface CustomRequest extends Request {
    user?: any;
  }
  
  
const AuthenticateUser = (req:CustomRequest, res:Response, next:NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
=======
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
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
  }
  try {
    const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    req.user = decoded;
  } catch (err) {
<<<<<<< HEAD
    return res.status(401).send("Invalid Token");
=======
    return res.status(401).send('Invalid Token');
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
  }
  return next();
};

<<<<<<< HEAD
export default AuthenticateUser;
=======
export default AuthenticateUser;
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
