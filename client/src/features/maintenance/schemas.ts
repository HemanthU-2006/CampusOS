import { z } from 'zod';

export const createTicketFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum([
    'electrical',
    'plumbing',
    'furniture',
    'hvac',
    'it_hardware',
    'cleaning',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string().min(2, 'Campus location is required'),
});

export type CreateTicketFormData = z.infer<typeof createTicketFormSchema>;
