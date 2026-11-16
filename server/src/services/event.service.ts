import mongoose from 'mongoose';
import { Event, IEvent } from '../models/Event.js';
import { EventRegistration, IEventRegistration } from '../models/EventRegistration.js';
import { Notification } from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';
import crypto from 'crypto';

export class EventService {
  static async getAllEvents(query: {
    status?: string;
    clubId?: string;
    venueId?: string;
  }): Promise<IEvent[]> {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.clubId) filter.club = query.clubId;
    if (query.venueId) filter.venue = query.venueId;

    return Event.find(filter)
      .populate('venue', 'name code building capacity')
      .populate('organizer', 'name email role department')
      .populate('club', 'name code category')
      .sort({ startTime: 1 });
  }

  static async getEventById(id: string): Promise<IEvent> {
    const event = await Event.findById(id)
      .populate('venue', 'name code building capacity')
      .populate('organizer', 'name email role department')
      .populate('club', 'name code category');

    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return event;
  }

  static async createEvent(
    organizerId: string,
    data: {
      title: string;
      description: string;
      venueId: string;
      clubId?: string;
      startTime: string;
      endTime: string;
      capacity: number;
      bannerImage?: string;
      tags?: string[];
    }
  ): Promise<IEvent> {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      throw new AppError('Start time must be before end time', 400);
    }

    const event = await Event.create({
      title: data.title,
      description: data.description,
      organizer: organizerId,
      club: data.clubId ? new mongoose.Types.ObjectId(data.clubId) : undefined,
      venue: new mongoose.Types.ObjectId(data.venueId),
      startTime: start,
      endTime: end,
      capacity: data.capacity,
      bannerImage: data.bannerImage || '',
      tags: data.tags || [],
      status: 'published', // default published for immediate discovery
    });

    return event.populate([
      { path: 'venue', select: 'name code building' },
      { path: 'organizer', select: 'name email role' },
    ]);
  }

  static async publishEvent(eventId: string): Promise<IEvent> {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    event.status = 'published';
    await event.save();
    return event;
  }

  static async registerForEvent(
    eventId: string,
    userId: string
  ): Promise<{ registration: IEventRegistration; isWaitlisted: boolean }> {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    if (event.status !== 'published') {
      throw new AppError('Registrations are only open for published events', 400);
    }

    // Check existing registration
    const existing = await EventRegistration.findOne({ event: eventId, user: userId });
    if (existing) {
      if (existing.status !== 'cancelled') {
        throw new AppError(`You are already ${existing.status} for this event`, 409);
      }
    }

    const ticketCode = `TKT-${event.title.substring(0, 3).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    let registration: IEventRegistration;

    // Atomically reserve a spot if registeredCount < capacity
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: 'published',
        $expr: { $lt: ['$registeredCount', '$capacity'] },
      },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    if (updatedEvent) {
      // Direct registration
      if (existing) {
        existing.status = 'registered';
        existing.ticketCode = ticketCode;
        existing.waitlistPosition = undefined;
        await existing.save();
        registration = existing;
      } else {
        registration = await EventRegistration.create({
          event: eventId,
          user: userId,
          status: 'registered',
          ticketCode,
        });
      }

      // Create notification
      await Notification.create({
        user: userId,
        title: 'Event Ticket Confirmed!',
        message: `You are registered for '${event.title}'. Ticket Code: ${ticketCode}`,
        type: 'event_update',
        link: '/events',
      });

      return { registration, isWaitlisted: false };
    } else {
      // Add to waitlist atomically
      const waitlistEvent = await Event.findByIdAndUpdate(
        eventId,
        { $inc: { waitlistCount: 1 } },
        { new: true }
      );
      const waitlistPos = waitlistEvent?.waitlistCount || 1;

      if (existing) {
        existing.status = 'waitlisted';
        existing.ticketCode = ticketCode;
        existing.waitlistPosition = waitlistPos;
        await existing.save();
        registration = existing;
      } else {
        registration = await EventRegistration.create({
          event: eventId,
          user: userId,
          status: 'waitlisted',
          ticketCode,
          waitlistPosition: waitlistPos,
        });
      }

      await Notification.create({
        user: userId,
        title: 'Event Waitlisted',
        message: `You are #${waitlistPos} on the waitlist for '${event.title}'. You will be promoted automatically if a spot opens!`,
        type: 'event_update',
        link: '/events',
      });

      return { registration, isWaitlisted: true };
    }
  }

  static async cancelRegistration(
    eventId: string,
    userId: string
  ): Promise<{ message: string; promotedUserId?: string }> {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    const reg = await EventRegistration.findOne({ event: eventId, user: userId });
    if (!reg || reg.status === 'cancelled') {
      throw new AppError('Active registration not found', 404);
    }

    const wasRegistered = reg.status === 'registered';
    reg.status = 'cancelled';
    await reg.save();

    let promotedUserId: string | undefined;

    if (wasRegistered) {
      // Check if someone is on the waitlist to promote
      const nextInLine = await EventRegistration.findOne({
        event: eventId,
        status: 'waitlisted',
      }).sort({ createdAt: 1 });

      if (nextInLine) {
        nextInLine.status = 'registered';
        nextInLine.waitlistPosition = undefined;
        await nextInLine.save();

        event.waitlistCount = Math.max(0, event.waitlistCount - 1);
        promotedUserId = nextInLine.user.toString();

        // Notify promoted person
        await Notification.create({
          user: nextInLine.user,
          title: 'Promoted from Waitlist!',
          message: `Great news! A spot opened for '${event.title}' and you have been registered! Ticket Code: ${nextInLine.ticketCode}`,
          type: 'event_update',
          link: '/events',
        });
      } else {
        event.registeredCount = Math.max(0, event.registeredCount - 1);
      }
      await event.save();
    } else {
      // User was waitlisted
      event.waitlistCount = Math.max(0, event.waitlistCount - 1);
      await event.save();
    }

    return { message: 'Registration cancelled', promotedUserId };
  }

  static async checkInAttendee(
    eventId: string,
    ticketCode: string
  ): Promise<IEventRegistration> {
    const reg = await EventRegistration.findOne({
      event: eventId,
      ticketCode: ticketCode.trim(),
    }).populate('user', 'name email role department');

    if (!reg) {
      throw new AppError('Invalid ticket code for this event', 404);
    }

    if (reg.status === 'attended') {
      throw new AppError(`Attendee '${(reg.user as any)?.name}' was already checked in`, 400);
    }

    if (reg.status !== 'registered') {
      throw new AppError(`Cannot check in ticket with status '${reg.status}'`, 400);
    }

    reg.status = 'attended';
    reg.checkedInAt = new Date();
    await reg.save();

    return reg;
  }

  static async completeEvent(eventId: string): Promise<IEvent> {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    event.status = 'completed';
    await event.save();
    return event;
  }

  static async getUserRegistrations(userId: string): Promise<IEventRegistration[]> {
    return EventRegistration.find({ user: userId })
      .populate({
        path: 'event',
        populate: { path: 'venue', select: 'name code building' },
      })
      .sort({ createdAt: -1 });
  }
}
