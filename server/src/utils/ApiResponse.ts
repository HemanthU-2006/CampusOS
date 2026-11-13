import { Response } from 'express';

export interface ApiResponseOptions<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: Record<string, unknown>
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
      meta: meta || undefined,
    });
  }

  static error(
    res: Response,
    message = 'An unexpected error occurred',
    statusCode = 500,
    meta?: Record<string, unknown>
  ): void {
    res.status(statusCode).json({
      success: false,
      data: null,
      message,
      meta: meta || undefined,
    });
  }
}
