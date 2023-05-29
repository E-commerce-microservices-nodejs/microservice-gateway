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
  }
  try {
    const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default AuthenticateUser;