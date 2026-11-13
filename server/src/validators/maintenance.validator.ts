import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.enum(['electrical', 'plumbing', 'furniture', 'hvac', 'it_hardware', 'cleaning', 'other']),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    location: z.string().min(2, 'Location is required'),
    photos: z.array(z.string()).default([]),
  }),
});

export const assignTicketSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    staffId: z.string().min(1, 'Staff ID is required'),
  }),
});

export const updateTicketStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(['in_progress', 'resolved', 'closed']),
    comment: z.string().optional(),
    resolutionNotes: z.string().optional(),
  }),
});

export const rateTicketSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    feedback: z.string().optional(),
  }),
});
