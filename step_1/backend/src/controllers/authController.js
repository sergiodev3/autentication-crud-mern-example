import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../utils/httpCodes.js';

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already in use', HTTP_STATUS.BAD_REQUEST));
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user);

  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED));
  }

  const token = signToken(user);
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});
