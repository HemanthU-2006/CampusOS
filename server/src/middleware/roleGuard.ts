import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { AppError } from '../utils/AppError.js';
import { UserRole } from '../models/User.js';

export const roleGuard = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required before checking permissions', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};
