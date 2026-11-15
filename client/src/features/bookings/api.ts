import api from '@/lib/axios';
import { BookingFormData } from './schemas';

export interface VenueItem {
  _id: string;
  name: string;
  code: string;
  capacity: number;
  building: string;
  floor: number;
  amenities: string[];
  isAvailable: boolean;
}

export interface BookingItem {
  _id: string;
  venue: VenueItem;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedBy?: {
    _id: string;
    name: string;
    role: string;
  };
  reviewComment?: string;
  createdAt: string;
}

// Default empty venues list; real facilities will be configured by administrators
export const DEFAULT_VENUES: VenueItem[] = [];

export const bookingApi = {
  getVenues: async (search?: string): Promise<VenueItem[]> => {
    try {
      const res = await api.get('/venues', { params: { search } });
      if (res.data?.data?.venues?.length) {
        return res.data.data.venues;
      }
    } catch (e) {
      // Fallback
    }
    if (search) {
      return DEFAULT_VENUES.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.code.toLowerCase().includes(search.toLowerCase()) ||
          v.building.toLowerCase().includes(search.toLowerCase())
      );
    }
    return DEFAULT_VENUES;
  },

  getBookings: async (params?: { venueId?: string; myOnly?: boolean }): Promise<BookingItem[]> => {
    try {
      const res = await api.get('/bookings', { params });
      if (res.data?.data?.bookings) {
        return res.data.data.bookings;
      }
    } catch (e) {
      // Fallback
    }
    return [];
  },

  createBooking: async (payload: {
    venueId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
  }): Promise<BookingItem> => {
    const res = await api.post('/bookings', payload);
    return res.data.data.booking;
  },

  reviewBooking: async (
    bookingId: string,
    status: 'approved' | 'rejected',
    reviewComment?: string
  ): Promise<BookingItem> => {
    const res = await api.patch(`/bookings/${bookingId}/status`, { status, reviewComment });
    return res.data.data.booking;
  },
};
