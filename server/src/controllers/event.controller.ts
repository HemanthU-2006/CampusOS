import { Request, Response } from 'express';
import { EventService } from '../services/event.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { status, clubId, venueId } = req.query;
  const events = await EventService.getAllEvents({
    status: status as string,
    clubId: clubId as string,
    venueId: venueId as string,
  });
  ApiResponse.success(res, { events }, 'Events retrieved successfully');
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await EventService.getEventById(req.params.id);
  ApiResponse.success(res, { event }, 'Event details retrieved');
});

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const organizerId = req.user!._id.toString();
  const event = await EventService.createEvent(organizerId, req.body);
  ApiResponse.success(res, { event }, 'Event created successfully', 201);
});

export const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await EventService.publishEvent(req.params.id);
  ApiResponse.success(res, { event }, 'Event published successfully');
});

export const registerForEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const eventId = req.params.id;

  const result = await EventService.registerForEvent(eventId, userId);
  ApiResponse.success(
    res,
    result,
    result.isWaitlisted
      ? 'Event capacity full. You are placed on the auto-promoting waitlist.'
      : 'Ticket confirmed! QR code generated.'
  );
});

export const cancelRegistration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const eventId = req.params.id;

  const result = await EventService.cancelRegistration(eventId, userId);
  ApiResponse.success(res, result, result.message);
});

export const checkInAttendee = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const { ticketCode } = req.body;

  const registration = await EventService.checkInAttendee(eventId, ticketCode);
  ApiResponse.success(
    res,
    { registration },
    `Check-in verified for ${(registration.user as any)?.name}!`
  );
});

export const completeEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await EventService.completeEvent(req.params.id);
  ApiResponse.success(res, { event }, 'Event marked as completed');
});

export const getMyRegistrations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  const registrations = await EventService.getUserRegistrations(userId);
  ApiResponse.success(res, { registrations }, 'My event tickets retrieved');
});
