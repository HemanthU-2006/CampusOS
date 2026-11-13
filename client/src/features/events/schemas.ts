import { z } from 'zod';

export const createEventFormSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  venueId: z.string().min(1, 'Venue is required'),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  tags: z.string().optional(),
});

export type CreateEventFormData = z.infer<typeof createEventFormSchema>;
