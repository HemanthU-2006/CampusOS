import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await AuthService.register(req.body);

  res.cookie('token', token, cookieOptions);

  ApiResponse.success(
    res,
    { user },
    'Account registered successfully',
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.login(email, password);

  res.cookie('token', token, cookieOptions);

  ApiResponse.success(
    res,
    { user },
    'Login successful',
    200
  );
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  ApiResponse.success(
    res,
    { user: req.user },
    'Current authenticated user profile',
    200
  );
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  ApiResponse.success(
    res,
    null,
    'Logged out successfully',
    200
  );
});
