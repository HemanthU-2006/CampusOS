import api from '@/lib/axios';

export interface MaintenanceTicketItem {
  _id: string;
  title: string;
  description: string;
  category: 'electrical' | 'plumbing' | 'furniture' | 'hvac' | 'it_hardware' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  location: string;
  reportedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  comments: {
    _id?: string;
    author: {
      name: string;
      role: string;
    };
    content: string;
    createdAt: string;
  }[];
  resolutionNotes?: string;
  resolvedAt?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export const DEFAULT_TICKETS: MaintenanceTicketItem[] = [
  {
    _id: 'tick-1',
    title: 'HVAC Chiller Leak in CS Turing Hall',
    description: 'Water dripping near rear projector rack 4. Potential short circuit hazard if left unattended.',
    category: 'hvac',
    priority: 'high',
    status: 'assigned',
    location: 'CS Complex 2nd Floor, Room 204',
    reportedBy: {
      _id: 'u-student',
      name: 'Priya Patel (Student)',
      email: 'student@campus.edu',
      role: 'student',
    },
    assignedTo: {
      _id: 'u-maint',
      name: 'Suresh Kumar (Facilities)',
      email: 'maintenance@campus.edu',
      phone: '+91 98765 43213',
    },
    comments: [
      {
        author: { name: 'Suresh Kumar', role: 'maintenance' },
        content: 'Inspected lines. Sourcing 2-inch drainage valve replacement.',
        createdAt: '2026-11-13T11:00:00.000Z',
      },
    ],
    createdAt: '2026-11-13T09:30:00.000Z',
  },
  {
    _id: 'tick-2',
    title: 'Lab 3 Ethernet Switch Port 12 Failure',
    description: 'Benches 4 to 6 have dropped Gigabit LAN connection during practical exams.',
    category: 'it_hardware',
    priority: 'medium',
    status: 'open',
    location: 'Innovation Lab 3, Network Rack B',
    reportedBy: {
      _id: 'u-faculty',
      name: 'Dr. Sarah Jenkins',
      email: 'faculty@campus.edu',
      role: 'faculty',
    },
    comments: [],
    createdAt: '2026-11-12T15:20:00.000Z',
  },
  {
    _id: 'tick-3',
    title: 'Broken Armrest on Auditorium Seat D-14',
    description: 'Wood cracked and splintered on aisle seat.',
    category: 'furniture',
    priority: 'low',
    status: 'resolved',
    location: 'Main Auditorium (Hall A), Row D',
    reportedBy: {
      _id: 'u-student',
      name: 'Priya Patel (Student)',
      email: 'student@campus.edu',
      role: 'student',
    },
    assignedTo: {
      _id: 'u-maint',
      name: 'Suresh Kumar (Facilities)',
      email: 'maintenance@campus.edu',
    },
    resolutionNotes: 'Seat armrest replaced with oak hardware.',
    resolvedAt: '2026-11-11T16:00:00.000Z',
    rating: 5,
    feedback: 'Repaired super quickly before the seminar!',
    comments: [],
    createdAt: '2026-11-10T12:00:00.000Z',
  },
];

export const maintenanceApi = {
  getTickets: async (): Promise<MaintenanceTicketItem[]> => {
    try {
      const res = await api.get('/maintenance');
      if (res.data?.data?.tickets?.length) return res.data.data.tickets;
    } catch (e) {
      // fallback
    }
    return DEFAULT_TICKETS;
  },

  createTicket: async (payload: any) => {
    const res = await api.post('/maintenance', payload);
    return res.data.data.ticket;
  },

  updateStatus: async (ticketId: string, status: string, comment?: string, resolutionNotes?: string) => {
    const res = await api.patch(`/maintenance/${ticketId}/status`, {
      status,
      comment,
      resolutionNotes,
    });
    return res.data.data.ticket;
  },

  rateTicket: async (ticketId: string, rating: number, feedback?: string) => {
    const res = await api.post(`/maintenance/${ticketId}/rate`, { rating, feedback });
    return res.data.data.ticket;
  },
};
