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

// Default empty repair tickets; real tickets will be reported by users or loaded from backend
export const DEFAULT_TICKETS: MaintenanceTicketItem[] = [];

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

  updateStatus: async (
    ticketId: string,
    status: string,
    comment?: string,
    resolutionNotes?: string
  ) => {
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
