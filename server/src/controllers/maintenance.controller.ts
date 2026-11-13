import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenance.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, priority, myOnly, assignedToMe } = req.query;

  let reportedBy: string | undefined;
  let assignedTo: string | undefined;

  if (myOnly === 'true' && req.user) reportedBy = req.user._id.toString();
  if (assignedToMe === 'true' && req.user) assignedTo = req.user._id.toString();

  const tickets = await MaintenanceService.getAllTickets({
    status: status as string,
    priority: priority as string,
    reportedBy,
    assignedTo,
  });

  ApiResponse.success(res, { tickets }, 'Maintenance tickets retrieved');
});

export const getTicketById = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await MaintenanceService.getTicketById(req.params.id);
  ApiResponse.success(res, { ticket }, 'Ticket details retrieved');
});

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reporterId = req.user!._id.toString();
  const ticket = await MaintenanceService.createTicket(reporterId, req.body);
  ApiResponse.success(res, { ticket }, 'Ticket logged successfully', 201);
});

export const assignStaff = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await MaintenanceService.assignStaff(req.params.id, req.body.staffId);
  ApiResponse.success(res, { ticket }, 'Staff assigned successfully');
});

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const authorId = req.user!._id.toString();
  const { status, comment, resolutionNotes } = req.body;

  const ticket = await MaintenanceService.updateStatus(
    req.params.id,
    authorId,
    status,
    comment,
    resolutionNotes
  );

  ApiResponse.success(res, { ticket }, `Ticket marked as ${status}`);
});

export const rateTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const { rating, feedback } = req.body;

  const ticket = await MaintenanceService.rateTicket(req.params.id, userId, rating, feedback);
  ApiResponse.success(res, { ticket }, 'Rating submitted and ticket closed');
});
