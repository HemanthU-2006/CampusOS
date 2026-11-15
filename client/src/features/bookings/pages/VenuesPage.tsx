import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { DEFAULT_VENUES, VenueItem, BookingItem } from '../api';
import { bookingFormSchema, BookingFormData } from '../schemas';

export const VenuesPage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const [venues] = useState<VenueItem[]>(DEFAULT_VENUES);
  const [activeTab, setActiveTab] = useState<'browse' | 'my_bookings' | 'approvals'>('browse');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected date & time for live availability filter at top
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterStartTime, setFilterStartTime] = useState('14:00');
  const [filterEndTime, setFilterEndTime] = useState('16:00');

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null);

  // Detail Drawer / Modal for "Details on demand"
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<BookingItem | null>(null);

  // Review modal state for Faculty/Admin
  const [reviewBookingTarget, setReviewBookingTarget] = useState<BookingItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [reviewComment, setReviewComment] = useState('');

  // Campus bookings state
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      _id: 'b-1',
      venue: DEFAULT_VENUES[0],
      user: {
        _id: 'u-1',
        name: 'Rohan Sharma (Robotics Guild)',
        email: 'rohan@campus.edu',
        role: 'club_head',
        department: 'Information Technology',
      },
      title: 'HackSJBIT Audio & Stage Setup',
      description: 'Audio routing and lighting preset setup for hackathon opening in BGS Auditorium.',
      startTime: `${new Date().toISOString().split('T')[0]}T14:00:00.000Z`,
      endTime: `${new Date().toISOString().split('T')[0]}T18:00:00.000Z`,
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'b-2',
      venue: DEFAULT_VENUES[1],
      user: {
        _id: 'u-2',
        name: 'Priya Patel',
        email: 'priya@campus.edu',
        role: 'student',
        department: 'Computer Science',
      },
      title: 'AI Research Team Presentation',
      description: 'Final semester capstone presentation to faculty panel.',
      startTime: `${new Date(Date.now() + 86400000).toISOString().split('T')[0]}T10:00:00.000Z`,
      endTime: `${new Date(Date.now() + 86400000).toISOString().split('T')[0]}T12:00:00.000Z`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      venueId: DEFAULT_VENUES[0]._id,
      title: '',
      description: '',
      date: filterDate,
      startTime: filterStartTime,
      endTime: filterEndTime,
    },
  });

  // Calculate conflict for a venue given the active filter date and time
  const getVenueConflict = (venueId: string) => {
    try {
      const filterStart = new Date(`${filterDate}T${filterStartTime}:00.000Z`);
      const filterEnd = new Date(`${filterDate}T${filterEndTime}:00.000Z`);

      return bookings.find(
        (b) =>
          b.venue._id === venueId &&
          b.status === 'approved' &&
          new Date(b.startTime) < filterEnd &&
          new Date(b.endTime) > filterStart
      );
    } catch {
      return undefined;
    }
  };

  const openBookModal = (venue?: VenueItem) => {
    const targetVenue = venue || venues[0];
    setSelectedVenue(targetVenue);
    setValue('venueId', targetVenue._id);
    setValue('date', filterDate);
    setValue('startTime', filterStartTime);
    setValue('endTime', filterEndTime);
    setIsBookModalOpen(true);
  };

  const handleBookingSubmit = (data: BookingFormData) => {
    const venue = venues.find((v) => v._id === data.venueId) || selectedVenue || venues[0];
    const start = new Date(`${data.date}T${data.startTime}:00.000Z`);
    const end = new Date(`${data.date}T${data.endTime}:00.000Z`);

    if (start >= end) {
      toast.error('Please check your times', {
        description: 'End time must be after the start time.',
      });
      return;
    }

    // Check conflict
    const conflict = bookings.find(
      (b) =>
        b.venue._id === venue._id &&
        b.status === 'approved' &&
        new Date(b.startTime) < end &&
        new Date(b.endTime) > start
    );

    if (conflict) {
      toast.error('This room is already booked at that time', {
        description: `Reserved for ${conflict.title}. Please pick another time or room.`,
      });
      return;
    }

    const newBooking: BookingItem = {
      _id: `b-${Date.now()}`,
      venue,
      user: {
        _id: user?._id || 'user-current',
        name: user?.name || 'You',
        email: user?.email || 'user@campus.edu',
        role: user?.role || 'student',
        department: user?.department,
      },
      title: data.title,
      description: data.description,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings([newBooking, ...bookings]);
    setIsBookModalOpen(false);
    reset();
    toast.success('Room request sent!', {
      description: `Your booking for ${venue.name} is waiting for faculty approval.`,
    });
    setActiveTab('my_bookings');
  };

  const openReviewModal = (booking: BookingItem, action: 'approved' | 'rejected') => {
    setReviewBookingTarget(booking);
    setReviewAction(action);
    setReviewComment('');
  };

  const confirmReview = () => {
    if (!reviewBookingTarget) return;

    setBookings((prev) =>
      prev.map((b) =>
        b._id === reviewBookingTarget._id
          ? {
              ...b,
              status: reviewAction,
              reviewedBy: {
                _id: user?._id || 'admin-id',
                name: user?.name || 'Faculty Reviewer',
                role: user?.role || 'faculty',
              },
              reviewComment: reviewComment || undefined,
            }
          : b
      )
    );

    toast.success(`Booking ${reviewAction === 'approved' ? 'approved' : 'declined'}!`);
    setReviewBookingTarget(null);
  };

  const filteredVenues = useMemo(() => {
    if (!searchTerm.trim()) return venues;
    const q = searchTerm.toLowerCase();
    return venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.building.toLowerCase().includes(q) ||
        v.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }, [venues, searchTerm]);

  const pendingApprovalsCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rooms &amp; Venues
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Browse campus spaces, check availability in real time, and reserve a room.
          </p>
        </div>

        <Button
          variant="lime"
          size="lg"
          onClick={() => openBookModal()}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Book a room
        </Button>
      </div>

      {/* 2. Top Navigation Tabs */}
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
            Available Rooms ({venues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer ${
              activeTab === 'my_bookings'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          {isFacultyOrAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-btn text-xs font-semibold min-h-[40px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'approvals'
                  ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <span>Needs Approval</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-bold">
                  {pendingApprovalsCount}
                </span>
              )}
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
              placeholder="Search by name or hall..."
              className="w-full bg-white/[0.07] border border-white/15 text-white text-xs rounded-pill pl-9 pr-3 py-2 outline-none focus:border-lime"
            />
          </div>
        )}
      </div>

      {/* 3. Browse View: Date & Time Picker Bar + Room Cards */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Quick Date and Time selector bar */}
          <div className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime shrink-0" />
              <span className="text-xs font-bold text-white">Check time slot:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-xl">
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-white/[0.08] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-lime"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Start Time</label>
                <input
                  type="time"
                  value={filterStartTime}
                  onChange={(e) => setFilterStartTime(e.target.value)}
                  className="w-full bg-white/[0.08] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-lime"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">End Time</label>
                <input
                  type="time"
                  value={filterEndTime}
                  onChange={(e) => setFilterEndTime(e.target.value)}
                  className="w-full bg-white/[0.08] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-lime"
                />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVenues.map((venue) => {
              const conflict = getVenueConflict(venue._id);

              return (
                <div
                  key={venue._id}
                  className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{venue.name}</h3>
                        <p className="text-xs text-white/50 mt-0.5">
                          {venue.building} · Floor {venue.floor}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-white/80 bg-row px-2.5 py-1 rounded-full border border-ring/60 shrink-0 flex items-center gap-1">
                        <Users className="w-3 h-3 text-lime" /> {venue.capacity} seats
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5">
                      {venue.amenities.map((am) => (
                        <span
                          key={am}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white/70 border border-white/10"
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Conflict or Free Status Message */}
                    {conflict ? (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>This room is already booked at that time</span>
                        </div>
                        <p className="text-[11px] text-red-200/70">
                          Reserved for {conflict.title}. Suggested free slot: after{' '}
                          {new Date(conflict.endTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-lime/10 border border-lime/20 text-xs text-lime flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Free at selected time</span>
                      </div>
                    )}
                  </div>

                  {/* Single Action Button */}
                  <div className="pt-3 border-t border-ring/60 flex items-center justify-end">
                    <Button
                      variant={conflict ? 'outline' : 'lime'}
                      size="sm"
                      disabled={!!conflict || !venue.isAvailable}
                      onClick={() => openBookModal(venue)}
                      className="min-h-[40px] px-4"
                    >
                      {conflict ? 'Unavailable' : 'Book this room'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. My Bookings Tab (Simple List with Status Badges) */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <Building2 className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-sm font-semibold text-white">No bookings yet</p>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                You haven't requested any campus rooms. Book your first room now.
              </p>
              <Button variant="lime" size="sm" onClick={() => openBookModal()}>
                Book a room
              </Button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => setSelectedBookingForDetail(booking)}
                className="p-4 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{booking.venue.name}</h3>
                    <Badge
                      variant={
                        booking.status === 'approved'
                          ? 'approved'
                          : booking.status === 'rejected'
                          ? 'overdue'
                          : 'pending'
                      }
                    >
                      {booking.status === 'approved'
                        ? 'Approved'
                        : booking.status === 'rejected'
                        ? 'Declined'
                        : 'Waiting'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70 font-medium">{booking.title}</p>
                  <p className="text-xs text-white/50">
                    {new Date(booking.startTime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    ·{' '}
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    –{' '}
                    {new Date(booking.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-lime font-medium pt-0.5">
                    {booking.status === 'approved'
                      ? 'Room confirmed on campus calendar'
                      : booking.status === 'rejected'
                      ? 'Request declined by faculty'
                      : 'Next step: Waiting for faculty approval'}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookingForDetail(booking);
                  }}
                  className="shrink-0 self-start sm:self-center"
                >
                  View details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. Needs Approval Tab for Faculty/Admin */}
      {activeTab === 'approvals' && isFacultyOrAdmin && (
        <div className="space-y-3">
          {bookings.filter((b) => b.status === 'pending').length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-lime mx-auto" />
              <p className="text-sm font-bold text-white">All clear!</p>
              <p className="text-xs text-white/50">There are no pending requests to review.</p>
            </div>
          ) : (
            bookings
              .filter((b) => b.status === 'pending')
              .map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-card border border-ring/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{b.venue.name}</h3>
                      <Badge variant="pending">Waiting</Badge>
                    </div>
                    <p className="text-xs text-white/80 font-medium">{b.title}</p>
                    <p className="text-xs text-white/50">
                      Requested by {b.user.name} ({b.user.department || b.user.role})
                    </p>
                    <p className="text-xs text-lime font-mono">
                      {new Date(b.startTime).toLocaleDateString()} ·{' '}
                      {new Date(b.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      –{' '}
                      {new Date(b.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openReviewModal(b, 'rejected')}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[40px]"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Decline
                    </Button>
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => openReviewModal(b, 'approved')}
                      className="min-h-[40px]"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* 6. Short One-Column Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={selectedVenue ? `Book ${selectedVenue.name}` : 'Book a room'}
        description="Fill in a few details to submit your reservation request."
        size="md"
      >
        <form onSubmit={handleSubmit(handleBookingSubmit)} className="space-y-4">
          <Select
            label="Room"
            error={errors.venueId?.message}
            {...register('venueId')}
            options={venues.map((v) => ({
              value: v._id,
              label: `${v.name} (${v.capacity} seats)`,
            }))}
          />

          <Input
            label="What is this booking for?"
            placeholder="e.g. AI project presentation or club meeting"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
            <Input
              label="Start time"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime')}
            />
            <Input
              label="End time"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime')}
            />
          </div>

          <Textarea
            label="Special notes or setup (optional)"
            placeholder="e.g. Need podium mic or projector setup"
            rows={2}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Send booking request
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Details on Demand: Side Panel / Detail Modal with Status Timeline */}
      {selectedBookingForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForDetail(null)}
          title={selectedBookingForDetail.venue.name}
          description="Booking reservation details and approval history"
          size="md"
        >
          <div className="space-y-5">
            {/* 3-Step Status Timeline */}
            <div className="p-4 rounded-xl bg-row border border-ring/60">
              <p className="text-xs font-bold text-white mb-3">Status Timeline</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-lime text-lime-ink font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <span className="text-[11px] text-white font-medium mt-1">Submitted</span>
                </div>
                <div className="h-0.5 flex-1 bg-lime/60 mx-2" />
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-lime text-lime-ink font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <span className="text-[11px] text-white font-medium mt-1">Under Review</span>
                </div>
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    selectedBookingForDetail.status === 'approved' ? 'bg-lime' : 'bg-ring'
                  }`}
                />
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      selectedBookingForDetail.status === 'approved'
                        ? 'bg-lime text-lime-ink'
                        : selectedBookingForDetail.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-card border border-ring text-white/40'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-[11px] text-white/70 font-medium mt-1">
                    {selectedBookingForDetail.status === 'approved'
                      ? 'Confirmed'
                      : selectedBookingForDetail.status === 'rejected'
                      ? 'Declined'
                      : 'Decision'}
                  </span>
                </div>
              </div>
            </div>

            {/* Field Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Event Purpose:</span>
                <span className="text-white font-semibold">{selectedBookingForDetail.title}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Requested by:</span>
                <span className="text-white">{selectedBookingForDetail.user.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ring/40">
                <span className="text-white/50">Date &amp; Window:</span>
                <span className="text-lime font-mono">
                  {new Date(selectedBookingForDetail.startTime).toLocaleDateString()} (
                  {new Date(selectedBookingForDetail.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  –{' '}
                  {new Date(selectedBookingForDetail.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  )
                </span>
              </div>
              {selectedBookingForDetail.description && (
                <div className="py-1.5 border-b border-ring/40">
                  <span className="text-white/50 block mb-1">Notes:</span>
                  <p className="text-white/80">{selectedBookingForDetail.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBookingForDetail(null)}
              >
                Close details
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 8. Simple Confirmation for Faculty/Admin Review */}
      {reviewBookingTarget && (
        <Modal
          isOpen={true}
          onClose={() => setReviewBookingTarget(null)}
          title={`${reviewAction === 'approved' ? 'Approve' : 'Decline'} Booking`}
          description={`Confirm your decision for '${reviewBookingTarget.title}'`}
          size="sm"
        >
          <div className="space-y-3">
            <p className="text-xs text-white/70">
              {reviewAction === 'approved'
                ? `This will lock ${reviewBookingTarget.venue.name} on the campus schedule.`
                : `This will decline the reservation request for ${reviewBookingTarget.user.name}.`}
            </p>

            <Textarea
              label="Note to student (optional)"
              placeholder="e.g. Approved. Audio technician has been assigned."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={2}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-ring/60">
              <Button variant="ghost" onClick={() => setReviewBookingTarget(null)}>
                Cancel
              </Button>
              <Button
                variant={reviewAction === 'approved' ? 'lime' : 'danger'}
                onClick={confirmReview}
              >
                Confirm {reviewAction === 'approved' ? 'Approval' : 'Decline'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
