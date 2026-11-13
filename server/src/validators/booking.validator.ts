import { z } from 'zod';

export const createVenueSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Venue name is required'),
    code: z.string().min(2, 'Venue code is required').toUpperCase(),
    capacity: z.number().int().positive('Capacity must be greater than 0'),
    building: z.string().min(2, 'Building is required'),
    floor: z.number().int().default(1),
    amenities: z.array(z.string()).default([]),
    isAvailable: z.boolean().default(true),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    venueId: z.string().min(1, 'Venue ID is required'),
    title: z.string().min(3, 'Booking title must be at least 3 characters'),
    description: z.string().optional(),
    startTime: z.string().datetime({ message: 'Valid ISO startTime is required' }),
    endTime: z.string().datetime({ message: 'Valid ISO endTime is required' }),
  }),
});

export const reviewBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    reviewComment: z.string().optional(),
  }),
});
