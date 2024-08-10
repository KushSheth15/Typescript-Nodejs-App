import * as dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config  from '../config/config';
import db from '../sequelize-client'; 
import ApiError from '../utils/api-error';
import asyncHandler from '../utils/async-handler';
import User from '../models/user.model';

interface MyUserRequest extends Request{
  token?: string;
  user?: User;
}
  
  export const verifyToken = asyncHandler(async (req: MyUserRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
        return next(new ApiError(401, 'Unauthorized - Token not provided'));
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, config.JWT.SECRET as string) as { userId: string };
      

      // Find the token in the database
      const accessToken = await db.AccessToken.findOne({
        where: {
          token,
          userId:decoded.userId,
          tokenType: 'ACCESS',
        }
      });
  
      if (!accessToken) {
        console.log('Token not found or expired');
        return next(new ApiError(401, 'Unauthorized - Token not found or expired'));
      }
  
      // Find the user
      const user = await db.User.findOne({
        where: { id: decoded.userId }
      });
  
      if (!user) {
        return next(new ApiError(401, 'Unauthorized - User not found'));
      }
      
      
      // Attach token and user to the request object
      req.token = token;
      req.user = user;

      next();
    } catch (err) {
      console.error(err);
      return next(new ApiError(401, 'Unauthorized - Invalid token', [err]));
    }
  });