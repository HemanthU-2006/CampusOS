import { Router } from 'express';
import {
  getLostFound,
  createLostFound,
  submitClaim,
  approveClaim,
  getClubs,
  joinClub,
  leaveClub,
  getClubPosts,
  createClubPost,
  getResources,
  getResourceRequests,
  createResourceRequest,
  updateResourceStatus,
  getCourses,
  bulkMarkAttendance,
  getStudentAttendance,
  exportAttendanceCSV,
} from '../controllers/community.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import {
  createLostFoundSchema,
  createClaimSchema,
  createClubPostSchema,
  createResourceRequestSchema,
  bulkMarkAttendanceSchema,
} from '../validators/community.validator.js';

const router = Router();

// Lost & Found
router.get('/lost-found', authenticate, getLostFound);
router.post('/lost-found', authenticate, validate(createLostFoundSchema), createLostFound);
router.post('/lost-found/:id/claim', authenticate, validate(createClaimSchema), submitClaim);
router.patch('/lost-found/claims/:id/approve', authenticate, approveClaim);

// Clubs
router.get('/clubs', authenticate, getClubs);
router.post('/clubs/:id/join', authenticate, joinClub);
router.post('/clubs/:id/leave', authenticate, leaveClub);
router.get('/clubs/posts', authenticate, getClubPosts);
router.post(
  '/clubs/:id/posts',
  authenticate,
  roleGuard('club_head', 'admin'),
  validate(createClubPostSchema),
  createClubPost
);

// Resources
router.get('/resources', authenticate, getResources);
router.get('/resources/requests', authenticate, getResourceRequests);
router.post(
  '/resources/requests',
  authenticate,
  validate(createResourceRequestSchema),
  createResourceRequest
);
router.patch(
  '/resources/requests/:id/status',
  authenticate,
  roleGuard('faculty', 'admin', 'maintenance'),
  updateResourceStatus
);

// Attendance
router.get('/attendance/courses', authenticate, getCourses);
router.post(
  '/attendance/bulk',
  authenticate,
  roleGuard('faculty', 'admin'),
  validate(bulkMarkAttendanceSchema),
  bulkMarkAttendance
);
router.get('/attendance/my-records', authenticate, getStudentAttendance);
router.get('/attendance/export/:courseId', authenticate, roleGuard('faculty', 'admin'), exportAttendanceCSV);

export default router;
