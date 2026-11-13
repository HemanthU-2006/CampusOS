import { Router } from 'express';
import {
  getVenues,
  createVenue,
  getBookings,
  createBooking,
  reviewBooking,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import {
  createVenueSchema,
  createBookingSchema,
  reviewBookingSchema,
} from '../validators/booking.validator.js';

const router = Router();

// Venues
router.get('/venues', getVenues);
router.post('/venues', authenticate, roleGuard('admin'), validate(createVenueSchema), createVenue);

// Bookings
router.get('/bookings', authenticate, getBookings);
router.post('/bookings', authenticate, validate(createBookingSchema), createBooking);
router.patch(
  '/bookings/:id/status',
  authenticate,
  roleGuard('faculty', 'admin'),
  validate(reviewBookingSchema),
  reviewBooking
);

export default router;
