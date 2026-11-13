import { z } from 'zod';

// Lost & Found
export const createLostFoundSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    category: z.string().min(2),
    type: z.enum(['lost', 'found']),
    location: z.string().min(2),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

export const createClaimSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    proofDetails: z.string().min(5, 'Proof details are required to verify ownership'),
    proofImage: z.string().optional(),
  }),
});

// Clubs
export const createClubPostSchema = z.object({
  params: z.object({ id: z.string().min(1) }), // clubId
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    attachments: z.array(z.string()).default([]),
  }),
});

// Resources
export const createResourceRequestSchema = z.object({
  body: z.object({
    resourceId: z.string().min(1),
    quantity: z.number().int().positive(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    purpose: z.string().min(5),
  }),
});

// Attendance
export const bulkMarkAttendanceSchema = z.object({
  body: z.object({
    courseId: z.string().min(1),
    date: z.string(),
    records: z.array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(['present', 'absent', 'late', 'excused']),
        remarks: z.string().optional(),
      })
    ),
  }),
});
