import { Router } from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  assignStaff,
  updateStatus,
  rateTicket,
} from '../controllers/maintenance.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import {
  createTicketSchema,
  assignTicketSchema,
  updateTicketStatusSchema,
  rateTicketSchema,
} from '../validators/maintenance.validator.js';

const router = Router();

router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicketById);
router.post('/', authenticate, validate(createTicketSchema), createTicket);
router.patch(
  '/:id/assign',
  authenticate,
  roleGuard('admin'),
  validate(assignTicketSchema),
  assignStaff
);
router.patch(
  '/:id/status',
  authenticate,
  roleGuard('maintenance', 'admin'),
  validate(updateTicketStatusSchema),
  updateStatus
);
router.post('/:id/rate', authenticate, validate(rateTicketSchema), rateTicket);

export default router;
