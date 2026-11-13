import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Event title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    venueId: z.string().min(1, 'Venue is required'),
    clubId: z.string().optional(),
    startTime: z.string().datetime({ message: 'Valid ISO startTime required' }),
    endTime: z.string().datetime({ message: 'Valid ISO endTime required' }),
    capacity: z.number().int().positive('Capacity must be greater than 0'),
    bannerImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const checkInTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Event ID is required'),
  }),
  body: z.object({
    ticketCode: z.string().min(1, 'Ticket code is required'),
  }),
});
