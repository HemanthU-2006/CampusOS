import mongoose from 'mongoose';
import { MaintenanceTicket, IMaintenanceTicket } from '../models/MaintenanceTicket.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';

export class MaintenanceService {
  static async getAllTickets(query: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    reportedBy?: string;
  }): Promise<IMaintenanceTicket[]> {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;
    if (query.reportedBy) filter.reportedBy = query.reportedBy;

    return MaintenanceTicket.find(filter)
      .populate('reportedBy', 'name email role department')
      .populate('assignedTo', 'name email role department phone')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 });
  }

  static async getTicketById(id: string): Promise<IMaintenanceTicket> {
    const ticket = await MaintenanceTicket.findById(id)
      .populate('reportedBy', 'name email role department')
      .populate('assignedTo', 'name email role department phone')
      .populate('comments.author', 'name role');

    if (!ticket) throw new AppError('Ticket not found', 404);
    return ticket;
  }

  static async createTicket(
    reporterId: string,
    data: {
      title: string;
      description: string;
      category: any;
      priority: any;
      location: string;
      photos?: string[];
    }
  ): Promise<IMaintenanceTicket> {
    const ticket = await MaintenanceTicket.create({
      ...data,
      reportedBy: reporterId,
      status: 'open',
    });

    // Notify admins of new ticket
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: `New Maintenance Ticket: ${ticket.priority.toUpperCase()}`,
        message: `${ticket.title} at ${ticket.location}`,
        type: 'ticket_update',
        link: '/maintenance',
      });
    }

    return ticket.populate('reportedBy', 'name email role');
  }

  static async assignStaff(
    ticketId: string,
    staffId: string
  ): Promise<IMaintenanceTicket> {
    const ticket = await MaintenanceTicket.findById(ticketId);
    if (!ticket) throw new AppError('Ticket not found', 404);

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== 'maintenance') {
      throw new AppError('Assigned user must be maintenance staff', 400);
    }

    ticket.assignedTo = new mongoose.Types.ObjectId(staffId);
    ticket.status = 'assigned';
    await ticket.save();

    // Notify assigned staff member
    await Notification.create({
      user: staff._id,
      title: 'Work Order Assigned to You',
      message: `You were assigned ticket '${ticket.title}' at ${ticket.location}`,
      type: 'ticket_update',
      link: '/maintenance',
    });

    // Notify student
    await Notification.create({
      user: ticket.reportedBy,
      title: 'Staff Assigned to Your Ticket',
      message: `${staff.name} has been assigned to inspect '${ticket.title}'`,
      type: 'ticket_update',
      link: '/maintenance',
    });

    return ticket.populate([
      { path: 'reportedBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role phone' },
    ]);
  }

  static async updateStatus(
    ticketId: string,
    authorId: string,
    status: 'in_progress' | 'resolved' | 'closed',
    comment?: string,
    resolutionNotes?: string
  ): Promise<IMaintenanceTicket> {
    const ticket = await MaintenanceTicket.findById(ticketId);
    if (!ticket) throw new AppError('Ticket not found', 404);

    ticket.status = status;
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    if (status === 'resolved') ticket.resolvedAt = new Date();

    if (comment) {
      ticket.comments.push({
        author: new mongoose.Types.ObjectId(authorId),
        content: comment,
        createdAt: new Date(),
      });
    }

    await ticket.save();

    // Notify ticket reporter
    await Notification.create({
      user: ticket.reportedBy,
      title: `Maintenance Ticket ${status === 'resolved' ? 'Resolved' : 'Updated'}`,
      message: `Your ticket '${ticket.title}' is now marked as ${status}.${comment ? ` Update: "${comment}"` : ''}`,
      type: 'ticket_update',
      link: '/maintenance',
    });

    return ticket.populate([
      { path: 'reportedBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role phone' },
      { path: 'comments.author', select: 'name role' },
    ]);
  }

  static async rateTicket(
    ticketId: string,
    userId: string,
    rating: number,
    feedback?: string
  ): Promise<IMaintenanceTicket> {
    const ticket = await MaintenanceTicket.findById(ticketId);
    if (!ticket) throw new AppError('Ticket not found', 404);

    if (ticket.reportedBy.toString() !== userId) {
      throw new AppError('Only the reporter can rate this work order', 403);
    }

    ticket.rating = rating;
    if (feedback) ticket.feedback = feedback;
    ticket.status = 'closed';
    await ticket.save();

    // Reward staff with activity points on high rating
    if (ticket.assignedTo && rating >= 4) {
      await User.findByIdAndUpdate(ticket.assignedTo, {
        $inc: { activityPoints: 15 },
      });

      await Notification.create({
        user: ticket.assignedTo,
        title: 'High Rating Received! (+15 pts)',
        message: `Student awarded ${rating} stars for '${ticket.title}'!`,
        type: 'ticket_update',
        link: '/maintenance',
      });
    }

    return ticket.populate([
      { path: 'reportedBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role' },
    ]);
  }
}
