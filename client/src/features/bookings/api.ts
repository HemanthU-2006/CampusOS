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

// Default realistic venues list used as fallback when offline
export const DEFAULT_VENUES: VenueItem[] = [
  {
    _id: 'v-1',
    name: 'Main Auditorium (Hall A)',
    code: 'AUD-A',
    capacity: 450,
    building: 'BGS Central Block',
    floor: 1,
    amenities: ['Dual Projectors', 'Surround Audio', 'Stage Lighting', 'Air Conditioned'],
    isAvailable: true,
  },
  {
    _id: 'v-2',
    name: 'Alan Turing Seminar Hall',
    code: 'SEM-TUR',
    capacity: 120,
    building: 'CS/IS Department Block',
    floor: 3,
    amenities: ['Interactive Smartboard', 'Conference Mic', 'AV System'],
    isAvailable: true,
  },
  {
    _id: 'v-3',
    name: 'Innovation & Robotics Lab',
    code: 'LAB-INNOV',
    capacity: 60,
    building: 'Mechanical & Mechatronics Block',
    floor: 2,
    amenities: ['3D Printers', 'Power Workbenches', 'Soldering Stations'],
    isAvailable: true,
  },
];

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
