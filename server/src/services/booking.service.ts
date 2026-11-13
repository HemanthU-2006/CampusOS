import mongoose from 'mongoose';
import { Venue, IVenue } from '../models/Venue.js';
import { Booking, IBooking, BookingStatus } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';

export interface CreateBookingDTO {
  venueId: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string | Date;
  endTime: string | Date;
}

export class BookingService {
  // Venues Management
  static async getAllVenues(search?: string): Promise<IVenue[]> {
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } },
      ];
    }
    return Venue.find(filter).sort({ name: 1 });
  }

  static async createVenue(data: Partial<IVenue>): Promise<IVenue> {
    const existing = await Venue.findOne({ code: data.code?.toUpperCase() });
    if (existing) {
      throw new AppError(`Venue with code '${data.code}' already exists`, 409);
    }
    return Venue.create(data);
  }

  // Bookings Management
  static async getAllBookings(query: {
    venueId?: string;
    userId?: string;
    status?: string;
  }): Promise<IBooking[]> {
    const filter: Record<string, unknown> = {};
    if (query.venueId) filter.venue = query.venueId;
    if (query.userId) filter.user = query.userId;
    if (query.status) filter.status = query.status;

    return Booking.find(filter)
      .populate('venue', 'name code building capacity')
      .populate('user', 'name email role department')
      .populate('reviewedBy', 'name email role')
      .sort({ startTime: -1 });
  }

  static async createBooking(data: CreateBookingDTO): Promise<IBooking> {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      throw new AppError('Start time must be strictly before end time', 400);
    }

    if (start < new Date()) {
      throw new AppError('Cannot book a venue in the past', 400);
    }

    // Check venue existence
    const venue = await Venue.findById(data.venueId);
    if (!venue) {
      throw new AppError('Venue not found', 404);
    }

    if (!venue.isAvailable) {
      throw new AppError('This venue is currently marked unavailable for maintenance', 400);
    }

    // Real-Time Conflict Query:
    // Overlapping approved bookings for the same venue where:
    // (existing.startTime < new.endTime) AND (existing.endTime > new.startTime)
    const conflict = await Booking.findOne({
      venue: data.venueId,
      status: 'approved',
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      throw new AppError(
        `Venue booking conflict: '${venue.name}' is already reserved between ${conflict.startTime.toLocaleTimeString()} and ${conflict.endTime.toLocaleTimeString()}`,
        409
      );
    }

    // Save as pending
    const booking = await Booking.create({
      venue: data.venueId,
      user: data.userId,
      title: data.title,
      description: data.description,
      startTime: start,
      endTime: end,
      status: 'pending',
    });

    return booking.populate([
      { path: 'venue', select: 'name code building capacity' },
      { path: 'user', select: 'name email role department' },
    ]);
  }

  static async reviewBooking(
    bookingId: string,
    reviewerId: string,
    status: 'approved' | 'rejected',
    comment?: string
  ): Promise<IBooking> {
    const booking = await Booking.findById(bookingId).populate('venue', 'name code');
    if (!booking) {
      throw new AppError('Booking request not found', 404);
    }

    if (booking.status !== 'pending') {
      throw new AppError(`Cannot review booking already in '${booking.status}' status`, 400);
    }

    // If approving, re-check conflict in case another reservation was approved in the meantime
    if (status === 'approved') {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        venue: booking.venue,
        status: 'approved',
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime },
      });

      if (conflict) {
        throw new AppError('Cannot approve: another overlapping booking was already approved', 409);
      }
    }

    booking.status = status;
    booking.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
    booking.reviewedAt = new Date();
    booking.reviewComment = comment;
    await booking.save();

    // Create Notification for the requester
    const venueName = (booking.venue as any)?.name || 'Venue';
    await Notification.create({
      user: booking.user,
      title: `Booking Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your reservation for '${venueName}' on ${booking.startTime.toLocaleDateString()} was ${status}.${comment ? ` Note: "${comment}"` : ''}`,
      type: 'booking_status',
      link: '/venues',
      metadata: { bookingId: booking._id, status },
    });

    return booking.populate([
      { path: 'venue', select: 'name code building capacity' },
      { path: 'user', select: 'name email role department' },
      { path: 'reviewedBy', select: 'name email role' },
    ]);
  }
}
