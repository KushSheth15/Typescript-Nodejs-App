import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import db from '../sequelize-client';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.token';
import encryption from '../utils/encryption';
import User from '../models/user.model';

interface MyUserRequest extends Request{
  token?: string;
  user?: User;
}

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password required'));
  }

  try {
    const newUser = await db.User.create({
      email,
      password,
      firstName,
      lastName,
    });

    const response = new ApiResponse(201, newUser, 'User created successfully');
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    return next(new ApiError(500, 'Internal server error', [error]));
  }
});


export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password required'));
  }

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid credentials"));
    };

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const encryptedAccessToken = encryption.encryptWithAES(accessToken);
    const encryptedRefreshToken = encryption.encryptWithAES(refreshToken);

    await db.AccessToken.bulkCreate([
      {
        tokenType: 'ACCESS',
        token: encryptedAccessToken,
        userId: user.id,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        tokenType: 'REFRESH',
        token: encryptedRefreshToken,
        userId: user.id,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    ]);

    const response = new ApiResponse(201, { accessToken, refreshToken, user }, 'Login Successfully')
    res.status(200).send(response);
  } catch (error) {
    console.error('Error logging in user:', error);
    return next(new ApiError(500, 'Internal server error', [error]));
  }
});

export const changePassword = asyncHandler(async (req: MyUserRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user as User;

  if (!user) {
    return next(new ApiError(401, 'User not authenticated'));
  }

  if (!oldPassword || !newPassword) {
    return next(new ApiError(400, 'Old password and new password required'));
  }

  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new ApiError(401, 'Old password is incorrect'));
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    const response = new ApiResponse(200, null, 'Password updated successfully');
    res.json(response);
  } catch (error) {
    console.error('Error changing password:', error);
    return next(new ApiError(500, 'Internal server error'));
  }
})

export const logoutUser = asyncHandler(async (req: MyUserRequest, res: Response, next: NextFunction) => {
  const token = req.token;
  if (!token) {
    return next(new ApiError(401, 'User not authenticated'));
  }

  try {
    const deletedToken = await db.AccessToken.destroy({
      where: { token, tokenType: 'ACCESS' }
    });

    if (deletedToken === 0) {
      return next(new ApiError(401, 'Unauthorized-Token not found'));
    }

    await db.AccessToken.destroy({
      where: { userId: req.user?.id, tokenType: 'REFRESH' }
    });

    const response = new ApiResponse(200, null, 'Logged out successfully');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error logging out:', error);
    return next(new ApiError(500, 'Internal server error', [error]));
  }
})