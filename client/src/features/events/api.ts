import api from '@/lib/axios';

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  organizer: {
    _id: string;
    name: string;
    role: string;
  };
  club?: {
    _id: string;
    name: string;
    code: string;
  };
  venue: {
    _id: string;
    name: string;
    code: string;
    building: string;
  };
  startTime: string;
  endTime: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  tags: string[];
}

export interface RegistrationItem {
  _id: string;
  event: EventItem;
  status: 'registered' | 'waitlisted' | 'cancelled' | 'attended';
  ticketCode: string;
  waitlistPosition?: number;
  checkedInAt?: string;
  createdAt: string;
}

// Default empty events list; real records will be created or fetched dynamically
export const DEFAULT_EVENTS: EventItem[] = [];

export const eventApi = {
  getEvents: async (): Promise<EventItem[]> => {
    try {
      const res = await api.get('/events');
      if (res.data?.data?.events?.length) return res.data.data.events;
    } catch (e) {
      // fallback
    }
    return DEFAULT_EVENTS;
  },

  register: async (eventId: string) => {
    const res = await api.post(`/events/${eventId}/register`);
    return res.data.data;
  },

  cancel: async (eventId: string) => {
    const res = await api.post(`/events/${eventId}/cancel`);
    return res.data.data;
  },

  checkIn: async (eventId: string, ticketCode: string) => {
    const res = await api.post(`/events/${eventId}/checkin`, { ticketCode });
    return res.data.data;
  },

  getMyRegistrations: async (): Promise<RegistrationItem[]> => {
    try {
      const res = await api.get('/events/my-registrations');
      if (res.data?.data?.registrations) return res.data.data.registrations;
    } catch (e) {
      // fallback
    }
    return [];
  },
};
