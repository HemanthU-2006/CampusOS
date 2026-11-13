import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

// Venue Controllers
export const getVenues = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string;
  const venues = await BookingService.getAllVenues(search);
  ApiResponse.success(res, { venues }, 'Venues retrieved successfully');
});

export const createVenue = asyncHandler(async (req: Request, res: Response) => {
  const venue = await BookingService.createVenue(req.body);
  ApiResponse.success(res, { venue }, 'Venue created successfully', 201);
});

// Booking Controllers
export const getBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { venueId, status, myOnly } = req.query;
  const userId = myOnly === 'true' && req.user ? req.user._id.toString() : undefined;

  const bookings = await BookingService.getAllBookings({
    venueId: venueId as string,
    status: status as string,
    userId,
  });

  ApiResponse.success(res, { bookings }, 'Bookings retrieved successfully');
});

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const { venueId, title, description, startTime, endTime } = req.body;

  const booking = await BookingService.createBooking({
    venueId,
    userId,
    title,
    description,
    startTime,
    endTime,
  });

  ApiResponse.success(res, { booking }, 'Reservation requested and pending review', 201);
});

export const reviewBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reviewerId = req.user!._id.toString();
  const bookingId = req.params.id;
  const { status, reviewComment } = req.body;

  const booking = await BookingService.reviewBooking(
    bookingId,
    reviewerId,
    status,
    reviewComment
  );

  ApiResponse.success(res, { booking }, `Booking successfully ${status}`);
});
