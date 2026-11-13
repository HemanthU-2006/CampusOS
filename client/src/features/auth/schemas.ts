import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid campus email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid campus email').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'faculty', 'club_head', 'maintenance', 'admin']),
  department: z.string().min(2, 'Department is required'),
  rollNumber: z.string().optional(),
  phone: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
