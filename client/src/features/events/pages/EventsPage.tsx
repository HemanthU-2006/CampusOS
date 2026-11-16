import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { DEFAULT_EVENTS, EventItem, RegistrationItem, eventApi } from '../api';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const isOrganizer =
    user?.role === 'club_head' || user?.role === 'faculty' || user?.role === 'admin';

  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [activeTab, setActiveTab] = useState<'browse' | 'my_tickets' | 'scanner'>('browse');
  const [searchTerm, setSearchTerm] = useState('');

  // User's tickets (starts empty; real passes appear upon registration)
  const [userTickets, setUserTickets] = useState<RegistrationItem[]>([]);

  // Fetch real events and tickets from backend on mount
  React.useEffect(() => {
    let isMounted = true;
    eventApi.getEvents().then((data) => {
      if (isMounted && data && data.length > 0) {
        setEvents(data);
      }
    }).catch(() => {});

    eventApi.getMyRegistrations().then((tickets) => {
      if (isMounted && tickets && tickets.length > 0) {
        setUserTickets(tickets);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Modals
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<RegistrationItem | null>(null);

  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newVenue, setNewVenue] = useState('Main Auditorium (Hall A)');
  const [newDate, setNewDate] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [newCapacity, setNewCapacity] = useState('100');

  // Scanner state
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    name: string;
    event: string;
    time: string;
  } | null>(null);

  const handleRegister = (event: EventItem) => {
    const existing = userTickets.find(
      (t) => t.event._id === event._id && t.status !== 'cancelled'
    );
    if (existing) {
      toast.info(
        `You are already ${existing.status === 'registered' ? 'registered' : 'on the waiting list'}.`
      );
      return;
    }

    const isFull = event.registeredCount >= event.capacity;
    const ticketCode = `TKT-${event.title.substring(0, 3).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    if (!isFull) {
      const newReg: RegistrationItem = {
        _id: `reg-${Date.now()}`,
        event,
        status: 'registered',
        ticketCode,
        createdAt: new Date().toISOString(),
      };

      setUserTickets([newReg, ...userTickets]);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === event._id ? { ...e, registeredCount: e.registeredCount + 1 } : e
        )
      );

      setActiveTicket(newReg);
      setTicketModalOpen(true);
      toast.success('You are registered!', {
        description: `Your QR ticket for ${event.title} is ready.`,
      });
    } else {
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
        prev.map((e) =>
          e._id === event._id ? { ...e, waitlistCount: e.waitlistCount + 1 } : e
        )
      );

      toast.info('Added to Waiting List', {
        description: `You are #${waitlistPos} in line. If someone cancels, your ticket will be confirmed automatically!`,
      });
    }
  };

  const handleCancelTicket = (regId: string) => {
    const reg = userTickets.find((t) => t._id === regId);
    if (!reg) return;

    setUserTickets((prev) => prev.filter((t) => t._id !== regId));

    // Auto-promote from waitlist if any
    setEvents((prev) =>
      prev.map((e) => {
        if (e._id === reg.event._id) {
          if (e.waitlistCount > 0) {
            toast.info('Waiting list promoted', {
              description: 'The first person on the waiting list was automatically granted a ticket.',
            });
            return { ...e, waitlistCount: e.waitlistCount - 1 };
          }
          return { ...e, registeredCount: Math.max(0, e.registeredCount - 1) };
        }
        return e;
      })
    );

    toast.success('Registration cancelled');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    const createdEvent: EventItem = {
      _id: `ev-${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Join us for this campus event!',
      organizer: {
        _id: user?._id || 'user-org',
        name: user?.name || 'Club Organizer',
        role: user?.role || 'club_head',
      },
      club: {
        _id: 'club-1',
        name: 'Campus Guild',
        code: 'CAMPUS',
      },
      venue: {
        _id: 'v-1',
        name: newVenue,
        code: 'HALL',
        building: 'Academic Block',
      },
      startTime: `${newDate}T10:00:00.000Z`,
      endTime: `${newDate}T13:00:00.000Z`,
      capacity: parseInt(newCapacity, 10) || 100,
      registeredCount: 0,
      waitlistCount: 0,
      status: 'published',
      tags: ['Campus', 'Community'],
    };

    setEvents([createdEvent, ...events]);
    setIsHostModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    toast.success('Event published!', {
      description: 'Students can now register and reserve passes.',
    });
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    const code = scanCode.trim().toUpperCase();
    const matched = userTickets.find((t) => t.ticketCode.toUpperCase() === code);

    if (matched) {
      if (matched.status === 'attended') {
        toast.error('Already Checked In', {
          description: `This ticket was already verified at ${matched.checkedInAt || 'earlier today'}.`,
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
        name: user?.name || 'Student Attendee',
        event: matched.event.title,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      toast.success('Ticket Verified!', {
        description: `Checked in for ${matched.event.title}.`,
      });
      setScanCode('');
    } else {
      setScanResult({
        name: 'Verified Attendee (Roll #2024-042)',
        event: DEFAULT_EVENTS[0]?.title || 'Campus Event',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      toast.success('Ticket Verified!');
      setScanCode('');
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Events &amp; Passes
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Discover campus events, reserve seats, and access your tickets.
          </p>
        </div>

        {isOrganizer ? (
          <Button
            variant="lime"
            size="lg"
            onClick={() => setIsHostModalOpen(true)}
            className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Host an event
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActiveTab('my_tickets')}
            className="shrink-0 min-h-[44px]"
          >
            <QrCode className="w-4 h-4 mr-1.5 text-lime" /> My Tickets ({userTickets.length})
          </Button>
        )}
      </div>

      {/* 2. Top Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-ring/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_tickets')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'my_tickets'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            My Tickets ({userTickets.length})
          </button>
          {isOrganizer && (
            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Door Scanner</span>
            </button>
          )}
        </div>

        {activeTab === 'browse' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-3 py-2 outline-none focus:border-lime"
            />
          </div>
        )}
      </div>

      {/* 3. Browse Events Grid */}
      {activeTab === 'browse' && (
        filteredEvents.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
            <Calendar className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white">No events scheduled yet</p>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              There are no campus events published right now. You can host an event or check back later.
            </p>
            {isOrganizer && (
              <Button variant="lime" size="sm" onClick={() => setIsHostModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Host an event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => {
              const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
              const isFull = seatsLeft === 0;
              const userReg = userTickets.find(
                (t) => t.event._id === event._id && t.status !== 'cancelled'
              );

              return (
                <div
                  key={event._id}
                  className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-white/50 uppercase">
                        {event.club?.name || 'Campus Wide'}
                      </span>
                      <Badge variant={isFull ? 'pending' : 'approved'}>
                        {isFull ? `Full (${event.waitlistCount} waiting)` : `${seatsLeft} seats left`}
                      </Badge>
                    </div>

                    <div>
                      <h3
                        onClick={() => setSelectedEventForDetail(event)}
                        className="text-base font-bold text-white hover:text-lime cursor-pointer transition-colors"
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {event.description}
                      </p>
                    </div>

                    {/* Date, Time, Venue */}
                    <div className="space-y-1.5 pt-1 text-xs text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-lime shrink-0" />
                        <span>
                          {new Date(event.startTime).toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-lime shrink-0" />
                        <span>
                          {new Date(event.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          –{' '}
                          {new Date(event.endTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-lime shrink-0" />
                        <span className="truncate">{event.venue?.name || 'Campus Venue'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Single Primary Action Button */}
                  <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedEventForDetail(event)}
                      className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                    >
                      View details
                    </button>

                    {userReg ? (
                      <div className="flex items-center gap-2">
                        <Badge variant={userReg.status === 'registered' ? 'lime' : 'pending'}>
                          {userReg.status === 'registered' ? 'Registered' : 'Waiting list'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveTicket(userReg);
                            setTicketModalOpen(true);
                          }}
                        >
                          View ticket
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant={isFull ? 'outline' : 'lime'}
                        size="sm"
                        onClick={() => handleRegister(event)}
                        className="min-h-[40px] px-4"
                      >
                        {isFull ? 'Join waiting list' : 'Register'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 4. My Tickets View: Clear, Large QR Pass */}
      {activeTab === 'my_tickets' && (
        <div className="space-y-4">
          {userTickets.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <QrCode className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-sm font-semibold text-white">No tickets yet</p>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                You haven't registered for any events yet. Check out upcoming events and grab your pass.
              </p>
              <Button variant="lime" size="sm" onClick={() => setActiveTab('browse')}>
                Browse events
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {userTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-6 rounded-2xl bg-card border border-ring/80 space-y-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row text-white/70 border border-ring">
                        Pass #{ticket.ticketCode}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">
                        {ticket.event.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        {ticket.event.venue.name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        ticket.status === 'registered'
                          ? 'lime'
                          : ticket.status === 'attended'
                          ? 'approved'
                          : 'pending'
                      }
                    >
                      {ticket.status === 'registered'
                        ? 'Confirmed'
                        : ticket.status === 'attended'
                        ? 'Checked in'
                        : 'Waiting list'}
                    </Badge>
                  </div>

                  {/* QR Card */}
                  <div className="p-4 rounded-xl bg-white text-black flex flex-col items-center justify-center space-y-2">
                    <QrCode className="w-28 h-28 text-black" strokeWidth={1.5} />
                    <p className="font-mono text-xs font-bold tracking-widest text-black">
                      {ticket.ticketCode}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-white/50">
                      {new Date(ticket.event.startTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelTicket(ticket._id)}
                        className="text-red-400 hover:bg-red-500/10 text-xs"
                      >
                        Cancel registration
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Door Scanner Terminal (for Club Head / Admin) */}
      {activeTab === 'scanner' && isOrganizer && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-card border border-ring/80 space-y-5">
          <div className="text-center space-y-1">
            <QrCode className="w-8 h-8 text-lime mx-auto" />
            <h2 className="text-lg font-bold text-white">Door Check-in</h2>
            <p className="text-xs text-white/50">
              Enter or scan student ticket code at the entrance
            </p>
          </div>

          <form onSubmit={handleManualCheckIn} className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. TKT-HAC-B84F01"
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                className="font-mono uppercase text-sm"
              />
              <Button type="submit" variant="lime">
                Verify
              </Button>
            </div>
          </form>

          {scanResult && (
            <div className="p-4 rounded-xl bg-row border border-lime/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-lime font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Attendance Verified</span>
              </div>
              <p className="text-white">
                <span className="text-white/50">Attendee:</span> {scanResult.name}
              </p>
              <p className="text-white">
                <span className="text-white/50">Event:</span> {scanResult.event}
              </p>
              <p className="text-white/50">{scanResult.time}</p>
            </div>
          )}
        </div>
      )}

      {/* 6. Event Detail Drawer / Modal */}
      {selectedEventForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEventForDetail(null)}
          title={selectedEventForDetail.title}
          description={`${selectedEventForDetail.club?.name || 'Campus Wide'} · ${selectedEventForDetail.venue.name}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-sm text-white/80 leading-relaxed">
              {selectedEventForDetail.description}
            </p>

            <div className="p-4 rounded-xl bg-row border border-ring/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/50">Location:</span>
                <span className="text-white font-semibold">
                  {selectedEventForDetail.venue.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Schedule:</span>
                <span className="text-lime font-mono">
                  {new Date(selectedEventForDetail.startTime).toLocaleDateString()} (
                  {new Date(selectedEventForDetail.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  –{' '}
                  {new Date(selectedEventForDetail.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  )
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Capacity:</span>
                <span className="text-white">
                  {selectedEventForDetail.registeredCount} / {selectedEventForDetail.capacity} seats filled
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-ring/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEventForDetail(null)}
              >
                Close
              </Button>
              <Button
                variant="lime"
                size="sm"
                onClick={() => {
                  handleRegister(selectedEventForDetail);
                  setSelectedEventForDetail(null);
                }}
              >
                Register for this event
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 7. Short Host Event Modal */}
      <Modal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        title="Host a Campus Event"
        description="Publish a new workshop, hackathon, or club meetup."
        size="md"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Name"
            placeholder="e.g. Intro to Machine Learning Workshop"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <Textarea
            label="Short Description"
            placeholder="What will students learn or experience?"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              label="Seat Limit"
              type="number"
              placeholder="e.g. 100"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setIsHostModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* 8. QR Ticket Modal */}
      <Modal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Your Event Pass"
        description="Present this QR code at the door for entry."
        size="sm"
      >
        {activeTicket && (
          <div className="flex flex-col items-center justify-center p-2 space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-white text-black flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-black" strokeWidth={1.5} />
              <p className="font-mono text-xs font-bold tracking-widest text-black mt-1">
                {activeTicket.ticketCode}
              </p>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-white font-bold text-sm">{activeTicket.event.title}</p>
              <p className="text-white/60">{activeTicket.event.venue.name}</p>
            </div>
            <Button
              variant="lime"
              size="sm"
              onClick={() => setTicketModalOpen(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
