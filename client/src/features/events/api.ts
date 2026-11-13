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

export const DEFAULT_EVENTS: EventItem[] = [
  {
    _id: 'ev-1',
    title: 'HackCampus 2026: 36-Hour National Hackathon',
    description:
      'Annual flagship hackathon bringing over 300 builders across Web3, AI Agents, and IoT hardware.',
    organizer: {
      _id: 'org-1',
      name: 'Dr. Sarah Jenkins',
      role: 'faculty',
    },
    club: {
      _id: 'club-1',
      name: 'Robotics & AI Guild',
      code: 'ROBO-AI',
    },
    venue: {
      _id: 'v-1',
      name: 'Main Auditorium (Hall A)',
      code: 'AUD-A',
      building: 'Academic Block 1',
    },
    startTime: '2026-11-20T09:00:00.000Z',
    endTime: '2026-11-21T21:00:00.000Z',
    capacity: 250,
    registeredCount: 248,
    waitlistCount: 14,
    status: 'published',
    tags: ['Hackathon', 'AI', 'Coding', 'Prizes'],
  },
  {
    _id: 'ev-2',
    title: 'Frontiers of Autonomous Robotics: Keynote',
    description:
      'Distinguished guest lecture on SLAM navigation, ROS2, and humanoid manipulation in unstructured environments.',
    organizer: {
      _id: 'org-2',
      name: 'Rohan Sharma',
      role: 'club_head',
    },
    club: {
      _id: 'club-1',
      name: 'Robotics & AI Guild',
      code: 'ROBO-AI',
    },
    venue: {
      _id: 'v-2',
      name: 'Alan Turing Seminar Hall',
      code: 'SEM-TUR',
      building: 'Computer Science Complex',
    },
    startTime: '2026-11-22T15:00:00.000Z',
    endTime: '2026-11-22T18:00:00.000Z',
    capacity: 120,
    registeredCount: 85,
    waitlistCount: 0,
    status: 'published',
    tags: ['Robotics', 'Keynote', 'Research'],
  },
  {
    _id: 'ev-3',
    title: 'Modern Product Design & UI/UX Teardown',
    description:
      'Hands-on session exploring obsidian palettes, accessible micro-interactions, and design tokens.',
    organizer: {
      _id: 'org-3',
      name: 'Design & Web Society',
      role: 'club_head',
    },
    venue: {
      _id: 'v-3',
      name: 'Innovation & Robotics Lab',
      code: 'LAB-INNOV',
      building: 'R&D Center',
    },
    startTime: '2026-11-25T16:00:00.000Z',
    endTime: '2026-11-25T18:30:00.000Z',
    capacity: 40,
    registeredCount: 40,
    waitlistCount: 8,
    status: 'published',
    tags: ['Design', 'UX', 'Workshop'],
  },
];

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
