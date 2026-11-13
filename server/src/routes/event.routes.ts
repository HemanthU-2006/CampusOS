import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  publishEvent,
  registerForEvent,
  cancelRegistration,
  checkInAttendee,
  completeEvent,
  getMyRegistrations,
} from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createEventSchema, checkInTicketSchema } from '../validators/event.validator.js';

const router = Router();

router.get('/', getEvents);
router.get('/my-registrations', authenticate, getMyRegistrations);
router.get('/:id', getEventById);
router.post(
  '/',
  authenticate,
  roleGuard('club_head', 'faculty', 'admin'),
  validate(createEventSchema),
  createEvent
);
router.patch('/:id/publish', authenticate, roleGuard('club_head', 'faculty', 'admin'), publishEvent);
router.post('/:id/register', authenticate, registerForEvent);
router.post('/:id/cancel', authenticate, cancelRegistration);
router.post(
  '/:id/checkin',
  authenticate,
  roleGuard('club_head', 'faculty', 'admin'),
  validate(checkInTicketSchema),
  checkInAttendee
);
router.patch('/:id/complete', authenticate, roleGuard('club_head', 'faculty', 'admin'), completeEvent);

export default router;
