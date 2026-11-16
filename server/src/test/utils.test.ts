import { describe, it, expect } from 'vitest';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

describe('Server Utilities & Error Handling', () => {
  it('instantiates AppError with correct status code and operational flag', () => {
    const error = new AppError('Venue not found', 404);
    expect(error.message).toBe('Venue not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('formats ApiResponse.success correctly', () => {
    let capturedStatus = 0;
    let capturedJson: any = null;

    const mockRes: any = {
      status(code: number) {
        capturedStatus = code;
        return this;
      },
      json(payload: any) {
        capturedJson = payload;
        return this;
      },
    };

    ApiResponse.success(mockRes, { venue: 'Auditorium' }, 'Loaded successfully', 200);

    expect(capturedStatus).toBe(200);
    expect(capturedJson.success).toBe(true);
    expect(capturedJson.data.venue).toBe('Auditorium');
    expect(capturedJson.message).toBe('Loaded successfully');
  });

  it('formats ApiResponse.error correctly', () => {
    let capturedStatus = 0;
    let capturedJson: any = null;

    const mockRes: any = {
      status(code: number) {
        capturedStatus = code;
        return this;
      },
      json(payload: any) {
        capturedJson = payload;
        return this;
      },
    };

    ApiResponse.error(mockRes, 'Unauthorized action', 403);

    expect(capturedStatus).toBe(403);
    expect(capturedJson.success).toBe(false);
    expect(capturedJson.data).toBeNull();
    expect(capturedJson.message).toBe('Unauthorized action');
  });
});
