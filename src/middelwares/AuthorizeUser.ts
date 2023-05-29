import { NextFunction, Request, Response } from "express";
import UserType from "../types/UserType";
interface CustomRequest extends Request{
    user:UserType
}

const AuthorizeUser = (requiredRole: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Check if the user has the required role
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      // User is authorized, proceed to the next middleware
      next();
    };
  };

  export default AuthorizeUser;