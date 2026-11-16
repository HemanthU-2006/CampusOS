import { Event } from '../models/Event.js';
import { Venue } from '../models/Venue.js';
import { Club } from '../models/Club.js';
import { LostFoundItem } from '../models/LostFoundItem.js';
import { Booking } from '../models/Booking.js';
import { MaintenanceTicket } from '../models/MaintenanceTicket.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Resource } from '../models/Resource.js';
import { ResourceRequest } from '../models/ResourceRequest.js';

export class AnalyticsService {
  /* ============================================================
     GLOBAL SEARCH (Grouped Results)
     ============================================================ */
  static async searchAll(query: string) {
    if (!query || query.trim().length === 0) {
      return { events: [], venues: [], clubs: [], lostFound: [] };
    }

    const regex = new RegExp(query.trim(), 'i');

    const [events, venues, clubs, lostFound] = await Promise.all([
      Event.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }] })
        .populate('venue', 'name code')
        .limit(6),
      Venue.find({ $or: [{ name: regex }, { code: regex }, { building: regex }] }).limit(6),
      Club.find({ $or: [{ name: regex }, { code: regex }, { category: regex }] }).limit(6),
      LostFoundItem.find({
        $or: [{ title: regex }, { description: regex }, { location: regex }],
      }).limit(6),
    ]);

    return {
      events,
      venues,
      clubs,
      lostFound,
      totalCount: events.length + venues.length + clubs.length + lostFound.length,
    };
  }

  /* ============================================================
     ADMIN ANALYTICS (MongoDB Aggregation Pipelines)
     ============================================================ */
  static async getCampusAnalytics() {
    // 1. Events Per Month Aggregation
    const eventsPerMonth = await Event.aggregate([
      {
        $group: {
          _id: { $month: '$startTime' },
          count: { $sum: 1 },
          attendees: { $sum: '$registeredCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Venue Utilization Rate
    const venueStats = await Booking.aggregate([
      {
        $group: {
          _id: '$venue',
          totalBookings: { $sum: 1 },
          approvedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'venues',
          localField: '_id',
          foreignField: '_id',
          as: 'venueDetails',
        },
      },
      { $unwind: '$venueDetails' },
      {
        $project: {
          venueName: '$venueDetails.name',
          totalBookings: 1,
          approvedBookings: 1,
          utilizationRate: {
            $multiply: [{ $divide: ['$approvedBookings', { $max: ['$totalBookings', 1] }] }, 100],
          },
        },
      },
      { $sort: { approvedBookings: -1 } },
    ]);

    // 3. Maintenance Ticket Resolution SLA
    const ticketStats = await MaintenanceTicket.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] },
          },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    // 4. Resource Usage
    const resourceStats = await Resource.aggregate([
      {
        $project: {
          name: 1,
          category: 1,
          totalQuantity: 1,
          availableQuantity: 1,
          checkedOutUnits: { $subtract: ['$totalQuantity', '$availableQuantity'] },
        },
      },
    ]);

    return {
      eventsPerMonth,
      venueStats,
      ticketStats,
      resourceStats,
      generatedAt: new Date().toISOString(),
    };
  }
}
