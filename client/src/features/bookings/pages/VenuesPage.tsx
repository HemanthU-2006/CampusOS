import React, { useState } from 'react';
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
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
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
import { DEFAULT_VENUES, VenueItem, BookingItem } from '../api';
import { bookingFormSchema, BookingFormData } from '../schemas';

export const VenuesPage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const [venues, setVenues] = useState<VenueItem[]>(DEFAULT_VENUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'venues' | 'bookings' | 'pending'>('venues');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedVenueForReserve, setSelectedVenueForReserve] = useState<VenueItem | null>(null);

  // Initial bookings state with realistic campus reservations
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      _id: 'b-1',
      venue: DEFAULT_VENUES[0],
      user: {
        _id: 'u-1',
        name: 'Rohan Sharma (Club Head)',
        email: 'clubhead@campus.edu',
        role: 'club_head',
        department: 'Information Technology',
      },
      title: 'HackCampus Setup & Audio Checks',
      description: 'Audio routing and lighting preset setup for hackathon opening.',
      startTime: '2026-11-20T14:00:00.000Z',
      endTime: '2026-11-20T18:00:00.000Z',
      status: 'pending',
      createdAt: '2026-11-13T10:00:00.000Z',
    },
    {
      _id: 'b-2',
      venue: DEFAULT_VENUES[1],
      user: {
        _id: 'u-2',
        name: 'Dr. Sarah Jenkins',
        email: 'faculty@campus.edu',
        role: 'faculty',
        department: 'Computer Science',
      },
      title: 'Distributed Systems Guest Colloquium',
      description: 'Lecture by visiting researcher on Byzantine fault tolerance.',
      startTime: '2026-11-21T10:00:00.000Z',
      endTime: '2026-11-21T12:00:00.000Z',
      status: 'approved',
      reviewedBy: {
        _id: 'u-admin',
        name: 'Arjun Mehta',
        role: 'admin',
      },
      reviewComment: 'Approved. AV technician notified.',
      createdAt: '2026-11-12T14:00:00.000Z',
    },
  ]);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBookingTarget, setReviewBookingTarget] = useState<BookingItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [reviewComment, setReviewComment] = useState('');

  // Reservation form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      venueId: DEFAULT_VENUES[0]._id,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '16:00',
    },
  });

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReserveFor = (venue: VenueItem) => {
    setSelectedVenueForReserve(venue);
    setIsReserveModalOpen(true);
  };

  const handleBookingSubmit = (data: BookingFormData) => {
    const venue = venues.find((v) => v._id === data.venueId) || selectedVenueForReserve;
    if (!venue) return;

    const start = new Date(`${data.date}T${data.startTime}:00.000Z`);
    const end = new Date(`${data.date}T${data.endTime}:00.000Z`);

    if (start >= end) {
      toast.error('Invalid Time Window', {
        description: 'End time must be strictly after start time.',
      });
      return;
    }

    // Client-side Conflict Query Check (409 Conflict logic):
    // Same venue, overlapping with any approved booking
    const conflict = bookings.find(
      (b) =>
        b.venue._id === venue._id &&
        b.status === 'approved' &&
        new Date(b.startTime) < end &&
        new Date(b.endTime) > start
    );

    if (conflict) {
      toast.error('409 Conflict: Venue Already Reserved', {
        description: `'${venue.name}' has an approved booking between ${new Date(conflict.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} and ${new Date(conflict.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      });
      return;
    }

    // Save as pending
    const newBooking: BookingItem = {
      _id: `b-${Date.now()}`,
      venue,
      user: {
        _id: user?._id || 'user-current',
        name: user?.name || 'Current User',
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
    setIsReserveModalOpen(false);
    reset();
    toast.success('Reservation Submitted!', {
      description: `Request for ${venue.name} is now pending faculty/admin review.`,
    });
    setActiveTab('bookings');
  };

  const openReviewModal = (booking: BookingItem, action: 'approved' | 'rejected') => {
    setReviewBookingTarget(booking);
    setReviewAction(action);
    setReviewComment('');
    setReviewModalOpen(true);
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
                name: user?.name || 'Administrator',
                role: user?.role || 'admin',
              },
              reviewComment: reviewComment || undefined,
            }
          : b
      )
    );

    setReviewModalOpen(false);
    toast.success(`Reservation ${reviewAction === 'approved' ? 'Approved' : 'Rejected'}!`, {
      description: `Notification dispatched to ${reviewBookingTarget.user.name}.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Venue Booking
            </h1>
            <Badge variant="lime">Conflict-Free Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Real-time overlap detection, faculty review workflow, and room management.
          </p>
        </div>

        <Button
          variant="lime"
          onClick={() => {
            setSelectedVenueForReserve(null);
            setIsReserveModalOpen(true);
          }}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Book a Venue
        </Button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-btn bg-card border border-ring/80">
          <button
            type="button"
            onClick={() => setActiveTab('venues')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'venues'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All Venues ({venues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Reservation Log ({bookings.length})
          </button>
          {isFacultyOrAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <span>Pending Review</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-bold">
                {bookings.filter((b) => b.status === 'pending').length}
              </span>
            </button>
          )}
        </div>

        {activeTab === 'venues' && (
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search rooms, buildings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
        )}
      </div>

      {/* View 1: Venues Grid */}
      {activeTab === 'venues' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVenues.map((venue) => (
            <div
              key={venue._id}
              className="p-6 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-all duration-200 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-lime transition-colors">
                      {venue.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-row border border-ring text-white/70 uppercase">
                      {venue.code}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {venue.building} · Floor {venue.floor}
                  </p>
                </div>
                <Badge variant={venue.isAvailable ? 'approved' : 'overdue'}>
                  {venue.isAvailable ? 'Available' : 'Under Maintenance'}
                </Badge>
              </div>

              {/* Amenities Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-white/50 flex items-center gap-1 mr-1">
                  <Users className="w-3.5 h-3.5" /> {venue.capacity} Seats:
                </span>
                {venue.amenities.map((am) => (
                  <span
                    key={am}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-row text-white/80 border border-ring/60"
                  >
                    {am}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
                <span className="text-xs text-lime font-mono">0 Conflict SLA</span>
                <Button
                  variant="lime"
                  size="sm"
                  onClick={() => openReserveFor(venue)}
                  disabled={!venue.isAvailable}
                >
                  Reserve Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Reservation Log */}
      {activeTab === 'bookings' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venue</TableHead>
              <TableHead>Event Title &amp; Purpose</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Time Window</TableHead>
              <TableHead>Status</TableHead>
              {isFacultyOrAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <div className="font-semibold text-white">{booking.venue.name}</div>
                  <div className="text-[11px] text-white/40">{booking.venue.building}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">{booking.title}</div>
                  {booking.description && (
                    <div className="text-xs text-white/60 max-w-xs truncate">
                      {booking.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-white font-medium">{booking.user.name}</div>
                  <div className="text-[10px] text-white/50">{booking.user.department || booking.user.role}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono text-lime">
                    {new Date(booking.startTime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-[11px] text-white/60 font-mono">
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(booking.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={booking.status} dot>
                    {booking.status}
                  </Badge>
                  {booking.reviewComment && (
                    <p className="text-[10px] text-white/50 mt-1 italic">
                      "{booking.reviewComment}"
                    </p>
                  )}
                </TableCell>
                {isFacultyOrAdmin && (
                  <TableCell className="text-right">
                    {booking.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => openReviewModal(booking, 'rejected')}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={() => openReviewModal(booking, 'approved')}
                        >
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-white/40">Reviewed</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* View 3: Pending Approvals for Faculty/Admin */}
      {activeTab === 'pending' && isFacultyOrAdmin && (
        <div className="space-y-4">
          {bookings.filter((b) => b.status === 'pending').length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Requested Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings
                  .filter((b) => b.status === 'pending')
                  .map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-semibold text-white">
                        {booking.venue.name}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{booking.user.name}</div>
                        <div className="text-[10px] text-white/50">{booking.user.email}</div>
                      </TableCell>
                      <TableCell className="text-lime font-mono text-xs">
                        {new Date(booking.startTime).toLocaleDateString()} (
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        )
                      </TableCell>
                      <TableCell className="text-white/80">{booking.title}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-500/10"
                            onClick={() => openReviewModal(booking, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="lime"
                            size="sm"
                            onClick={() => openReviewModal(booking, 'approved')}
                          >
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-lime mx-auto" />
              <h3 className="text-lg font-bold text-white">No Pending Venue Reviews</h3>
              <p className="text-xs text-white/60">
                All campus room reservation requests have been processed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reservation Form Modal */}
      <Modal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        title={
          selectedVenueForReserve
            ? `Reserve ${selectedVenueForReserve.name}`
            : 'Book a Campus Venue'
        }
        description="Run real-time conflict checking and submit reservation for faculty clearance."
        size="md"
      >
        <form onSubmit={handleSubmit(handleBookingSubmit)} className="space-y-4">
          {!selectedVenueForReserve && (
            <Select
              label="Select Venue"
              error={errors.venueId?.message}
              {...register('venueId')}
              options={venues.map((v) => ({
                value: v._id,
                label: `${v.name} (${v.code}) - ${v.capacity} seats`,
              }))}
            />
          )}

          <Input
            label="Event / Activity Title"
            placeholder="e.g. AI Robotics Workshop"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <Input
              label="Start Time"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime')}
            />
            <Input
              label="End Time"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime')}
            />
          </div>

          <Textarea
            label="Purpose & Technical Requirements"
            placeholder="Describe audience, audio/visual requirements, seating layout..."
            rows={2}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="p-3 rounded-xl bg-row border border-ring/70 text-xs text-white/60 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime shrink-0" />
            <span>Overlaps against approved bookings will return a 409 conflict automatically.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ring/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReserveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Submit Reservation Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Confirmation Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`${reviewAction === 'approved' ? 'Approve' : 'Reject'} Reservation`}
        description={`Confirm your decision for '${reviewBookingTarget?.title}' by ${reviewBookingTarget?.user.name}.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approved' ? 'lime' : 'danger'}
              onClick={confirmReview}
            >
              Confirm {reviewAction === 'approved' ? 'Approval' : 'Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-row border border-ring/60 text-xs space-y-1">
            <p>
              <span className="text-white/50">Venue:</span>{' '}
              <span className="text-white font-bold">{reviewBookingTarget?.venue.name}</span>
            </p>
            <p>
              <span className="text-white/50">Applicant:</span>{' '}
              <span className="text-white">{reviewBookingTarget?.user.name}</span>
            </p>
          </div>

          <Textarea
            label="Review Comment (Included in Notification)"
            placeholder="e.g. Approved. Audio engineer assigned."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={2}
          />
        </div>
      </Modal>
    </div>
  );
};
