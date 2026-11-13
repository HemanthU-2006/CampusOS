import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PillCard } from '@/components/ui/PillCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { toast } from 'sonner';
import { DEFAULT_EVENTS, EventItem, RegistrationItem } from '../api';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const isOrganizer = user?.role === 'club_head' || user?.role === 'faculty' || user?.role === 'admin';

  const getRegBadgeVariant = (status: RegistrationItem['status']): BadgeVariant => {
    switch (status) {
      case 'registered':
        return 'lime';
      case 'waitlisted':
        return 'pending';
      case 'attended':
        return 'approved';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'neutral';
    }
  };

  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [activeTab, setActiveTab] = useState<'browse' | 'my_tickets' | 'scanner'>('browse');

  // User's tickets state
  const [userTickets, setUserTickets] = useState<RegistrationItem[]>([
    {
      _id: 'reg-demo-1',
      event: DEFAULT_EVENTS[0],
      status: 'registered',
      ticketCode: 'TKT-HAC-B84F01',
      createdAt: '2026-11-12T10:00:00.000Z',
    },
  ]);

  // Selected ticket modal for QR view
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<RegistrationItem | null>(null);

  // Scanner state
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    name: string;
    event: string;
    time: string;
  } | null>(null);

  const handleRegister = (event: EventItem) => {
    // Check if user already registered
    const alreadyReg = userTickets.find((t) => t.event._id === event._id && t.status !== 'cancelled');
    if (alreadyReg) {
      toast.info(`You are already ${alreadyReg.status} for this event.`);
      return;
    }

    const isFull = event.registeredCount >= event.capacity;
    const ticketCode = `TKT-${event.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (!isFull) {
      // Register directly
      const newReg: RegistrationItem = {
        _id: `reg-${Date.now()}`,
        event,
        status: 'registered',
        ticketCode,
        createdAt: new Date().toISOString(),
      };

      setUserTickets([newReg, ...userTickets]);
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, registeredCount: e.registeredCount + 1 } : e))
      );

      setActiveTicket(newReg);
      setTicketModalOpen(true);
      toast.success('Registration Confirmed!', {
        description: `Your QR ticket for ${event.title} is ready.`,
      });
    } else {
      // Add to waitlist
      const waitlistPos = event.waitlistCount + 1;
      const newReg: RegistrationItem = {
        _id: `reg-${Date.now()}`,
        event,
        status: 'waitlisted',
        ticketCode,
        waitlistPosition: waitlistPos,
        createdAt: new Date().toISOString(),
      };

      setUserTickets([newReg, ...userTickets]);
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, waitlistCount: e.waitlistCount + 1 } : e))
      );

      toast.info('Added to Waitlist', {
        description: `You are #${waitlistPos} in line. If an attendee cancels, you will be auto-promoted!`,
      });
    }
  };

  const handleCancelTicket = (regId: string) => {
    const reg = userTickets.find((t) => t._id === regId);
    if (!reg) return;

    setUserTickets((prev) => prev.filter((t) => t._id !== regId));

    // Waitlist promotion logic
    setEvents((prev) =>
      prev.map((e) => {
        if (e._id === reg.event._id) {
          if (e.waitlistCount > 0) {
            toast.success('Waitlist Promoted!', {
              description: `Earliest waitlisted student automatically promoted to registered status.`,
            });
            return {
              ...e,
              waitlistCount: e.waitlistCount - 1,
            };
          } else {
            return {
              ...e,
              registeredCount: Math.max(0, e.registeredCount - 1),
            };
          }
        }
        return e;
      })
    );

    toast.info('Ticket Cancelled', {
      description: `Registration for ${reg.event.title} was released.`,
    });
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    const code = scanCode.trim().toUpperCase();

    // Check against registered tickets
    const matched = userTickets.find((t) => t.ticketCode.toUpperCase() === code);

    if (matched) {
      if (matched.status === 'attended') {
        toast.error('Already Checked In', {
          description: `This ticket was already scanned at ${matched.checkedInAt || 'earlier today'}.`,
        });
        return;
      }

      setUserTickets((prev) =>
        prev.map((t) =>
          t._id === matched._id
            ? { ...t, status: 'attended', checkedInAt: new Date().toLocaleTimeString() }
            : t
        )
      );

      setScanResult({
        success: true,
        name: user?.name || 'Verified Student',
        event: matched.event.title,
        time: new Date().toLocaleTimeString(),
      });
      toast.success('Check-in Verified!', {
        description: `Welcome to ${matched.event.title}! Attendance marked.`,
      });
      setScanCode('');
    } else {
      // Simulate verifying a valid external ticket
      setScanResult({
        success: true,
        name: 'Aarav Sharma (Student ID: CS-2024-089)',
        event: DEFAULT_EVENTS[0].title,
        time: new Date().toLocaleTimeString(),
      });
      toast.success('Check-in Verified!', {
        description: `Ticket ${code} authenticated successfully.`,
      });
      setScanCode('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Events &amp; Passes
            </h1>
            <Badge variant="lime">QR Check-in Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Automated registration capacity, dynamic waitlist promotion, and contactless verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userTickets.length > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveTab('my_tickets')}
              className="gap-1.5"
            >
              <QrCode className="w-4 h-4" /> My Tickets ({userTickets.length})
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-btn bg-card border border-ring/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('my_tickets')}
          className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'my_tickets'
              ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          My Passes ({userTickets.length})
        </button>
        {isOrganizer && (
          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Check-in Terminal</span>
          </button>
        )}
      </div>

      {/* View 1: Browse Events Grid */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isFull = event.registeredCount >= event.capacity;
            const pct = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
            const userReg = userTickets.find((t) => t.event._id === event._id && t.status !== 'cancelled');

            return (
              <div
                key={event._id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-all duration-200 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
              >
                <div className="space-y-3">
                  {/* Status & Club Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                      {event.club?.name || 'Campus Wide'}
                    </span>
                    <Badge variant={isFull ? 'pending' : 'approved'} dot>
                      {isFull ? `Waitlist (${event.waitlistCount})` : 'Spots Open'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-lime transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-1.5 pt-2 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-lime" />
                      <span>
                        {new Date(event.startTime).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-lime" />
                      <span>
                        {new Date(event.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(event.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-lime" />
                      <span>{event.venue.name}</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/50">Capacity Status</span>
                      <span className="font-mono text-white/80">
                        {event.registeredCount} / {event.capacity} seats ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-row overflow-hidden border border-ring/50">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull ? 'bg-amber-400' : 'bg-lime shadow-[0_0_8px_#83F34D]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="pt-4 border-t border-ring/60 flex items-center justify-between">
                  {userReg ? (
                    <div className="flex items-center gap-2">
                      <Badge variant={userReg.status === 'registered' ? 'lime' : 'pending'}>
                        {userReg.status.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveTicket(userReg);
                          setTicketModalOpen(true);
                        }}
                      >
                        View Pass
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={isFull ? 'outline' : 'lime'}
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => handleRegister(event)}
                    >
                      {isFull ? 'Join Auto-Waitlist' : 'Register & Get Ticket'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: User's Tickets */}
      {activeTab === 'my_tickets' && (
        <div className="space-y-4">
          {userTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {userTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-6 rounded-2xl bg-card border border-ring/80 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row text-white/70 border border-ring">
                        Pass #{ticket.ticketCode}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">
                        {ticket.event.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        {ticket.event.venue.name}
                      </p>
                    </div>
                    <Badge variant={getRegBadgeVariant(ticket.status)} dot>
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-row/80 border border-ring/60 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        Unique Pass Token
                      </p>
                      <p className="font-mono text-sm font-bold text-lime tracking-wider">
                        {ticket.ticketCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTicket(ticket);
                        setTicketModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-card border border-ring text-lime hover:scale-105 transition-all cursor-pointer shadow-[0_0_12px_rgba(131,243,77,0.2)]"
                    >
                      <QrCode className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-white/50">
                      Date: {new Date(ticket.event.startTime).toLocaleDateString()}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelTicket(ticket._id)}
                    >
                      Cancel Pass
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <QrCode className="w-10 h-10 text-lime/50 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Tickets Yet</h3>
              <p className="text-xs text-white/60">
                Browse campus events and register to claim your contactless pass.
              </p>
            </div>
          )}
        </div>
      )}

      {/* View 3: Organizer QR Check-in Terminal */}
      {activeTab === 'scanner' && isOrganizer && (
        <div className="max-w-xl mx-auto space-y-6 p-6 sm:p-8 rounded-2xl bg-card border border-ring/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-lime/10 border border-lime/30 text-lime flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(131,243,77,0.25)]">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Event QR Check-in Terminal
            </h2>
            <p className="text-xs text-white/60">
              Enter or scan attendee ticket codes to mark real-time attendance.
            </p>
          </div>

          <form onSubmit={handleManualCheckIn} className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. TKT-HAC-B84F01"
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                className="font-mono uppercase text-sm tracking-wide"
              />
              <Button type="submit" variant="lime">
                Verify
              </Button>
            </div>
          </form>

          {scanResult && (
            <div className="p-4 rounded-xl bg-row border border-lime/30 space-y-2 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 text-lime font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Attendance Verified &amp; Recorded</span>
              </div>
              <div className="text-xs space-y-1 text-white/70">
                <p>
                  <span className="text-white/40">Attendee:</span>{' '}
                  <span className="text-white font-semibold">{scanResult.name}</span>
                </p>
                <p>
                  <span className="text-white/40">Event:</span> {scanResult.event}
                </p>
                <p>
                  <span className="text-white/40">Time:</span> {scanResult.time}
                </p>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-row/60 border border-ring/50 text-[11px] text-white/50 space-y-1">
            <p className="font-semibold text-white/70">Demo Quick Codes to test:</p>
            <p className="font-mono text-lime cursor-pointer hover:underline" onClick={() => setScanCode('TKT-HAC-B84F01')}>
              • TKT-HAC-B84F01 (Priya Patel - HackCampus)
            </p>
            <p className="font-mono text-lime cursor-pointer hover:underline" onClick={() => setScanCode('TKT-ROB-94E21C')}>
              • TKT-ROB-94E21C (Robotics Keynote Attendee)
            </p>
          </div>
        </div>
      )}

      {/* Ticket QR Modal */}
      <Modal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Campus Event Pass"
        description="Present this QR code or token code at the venue gate for check-in."
        size="sm"
        footer={
          <Button variant="lime" onClick={() => setTicketModalOpen(false)}>
            Close Ticket
          </Button>
        }
      >
        {activeTicket && (
          <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
            {/* Visual QR Code Display Representation */}
            <div className="p-4 rounded-2xl bg-white text-page shadow-[0_0_30px_rgba(131,243,77,0.3)] flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-black" strokeWidth={1.5} />
              <p className="font-mono text-xs font-black tracking-widest text-black pt-1">
                {activeTicket.ticketCode}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-base">
                {activeTicket.event.title}
              </h4>
              <p className="text-white/60">
                {activeTicket.event.venue.name} · {new Date(activeTicket.event.startTime).toLocaleDateString()}
              </p>
              <div className="pt-2">
                <Badge variant={getRegBadgeVariant(activeTicket.status)} dot>
                  {activeTicket.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
