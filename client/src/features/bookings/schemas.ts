import { z } from 'zod';

export const bookingFormSchema = z.object({
  venueId: z.string().min(1, 'Please select a venue'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
