import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Star,
  MapPin,
  MessageSquare,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { toast } from 'sonner';
import { DEFAULT_TICKETS, MaintenanceTicketItem } from '../api';
import { createTicketFormSchema, CreateTicketFormData } from '../schemas';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const isMaintenanceStaff = user?.role === 'maintenance' || user?.role === 'admin';

  const [tickets, setTickets] = useState<MaintenanceTicketItem[]>(DEFAULT_TICKETS);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned_to_me' | 'resolved'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<MaintenanceTicketItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'in_progress' | 'resolved'>('in_progress');
  const [statusComment, setStatusComment] = useState('');

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<MaintenanceTicketItem | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'electrical',
      priority: 'medium',
      location: '',
    },
  });

  const getStatusBadgeVariant = (status: MaintenanceTicketItem['status']): BadgeVariant => {
    switch (status) {
      case 'open':
        return 'pending';
      case 'assigned':
        return 'info';
      case 'in_progress':
        return 'lime';
      case 'resolved':
        return 'approved';
      case 'closed':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handleCreateSubmit = (data: CreateTicketFormData) => {
    const newTicket: MaintenanceTicketItem = {
      _id: `tick-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      location: data.location,
      reportedBy: {
        _id: user?._id || 'user-curr',
        name: user?.name || 'Priya Patel (Student)',
        email: user?.email || 'student@campus.edu',
        role: user?.role || 'student',
      },
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setTickets([newTicket, ...tickets]);
    setCreateModalOpen(false);
    reset();
    toast.success('Ticket Logged Successfully!', {
      description: 'Facilities dispatch team has received your ticket.',
    });
  };

  const openStatusModal = (ticket: MaintenanceTicketItem, status: 'in_progress' | 'resolved') => {
    setActiveTicket(ticket);
    setTargetStatus(status);
    setStatusComment('');
    setStatusModalOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!activeTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t._id === activeTicket._id
          ? {
              ...t,
              status: targetStatus,
              resolutionNotes: targetStatus === 'resolved' ? statusComment : t.resolutionNotes,
              resolvedAt: targetStatus === 'resolved' ? new Date().toISOString() : t.resolvedAt,
              comments: statusComment
                ? [
                    ...t.comments,
                    {
                      author: { name: user?.name || 'Suresh Kumar', role: 'maintenance' },
                      content: statusComment,
                      createdAt: new Date().toISOString(),
                    },
                  ]
                : t.comments,
            }
          : t
      )
    );

    setStatusModalOpen(false);
    toast.success(`Ticket Updated to ${targetStatus.replace('_', ' ').toUpperCase()}!`, {
      description: `Notification dispatched to ${activeTicket.reportedBy.name}.`,
    });
  };

  const openRatingModal = (ticket: MaintenanceTicketItem) => {
    setRatingTarget(ticket);
    setSelectedRating(5);
    setRatingFeedback('');
    setRatingModalOpen(true);
  };

  const confirmRating = () => {
    if (!ratingTarget) return;

    setTickets((prev) =>
      prev.map((t) =>
        t._id === ratingTarget._id
          ? {
              ...t,
              status: 'closed',
              rating: selectedRating,
              feedback: ratingFeedback,
            }
          : t
      )
    );

    setRatingModalOpen(false);
    toast.success('Rating Submitted! (+15 pts awarded to technician)', {
      description: `Thank you for confirming resolution of '${ratingTarget.title}'.`,
    });
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'assigned_to_me') {
      return t.assignedTo?._id === user?._id || isMaintenanceStaff;
    }
    if (activeTab === 'resolved') {
      return t.status === 'resolved' || t.status === 'closed';
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Maintenance &amp; Facilities
            </h1>
            <Badge variant="lime">Live Dispatch SLA</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Rapid facility issue ticketing, staff dispatch, and student resolution sign-off.
          </p>
        </div>

        <Button
          variant="lime"
          onClick={() => setCreateModalOpen(true)}
          className="shadow-[0_0_20px_rgba(131,243,77,0.35)]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Report Campus Issue
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-btn bg-card border border-ring/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          All Tickets ({tickets.length})
        </button>
        {isMaintenanceStaff && (
          <button
            type="button"
            onClick={() => setActiveTab('assigned_to_me')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assigned_to_me'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Assigned Work Orders</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'resolved'
              ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Resolved &amp; Closed
        </button>
      </div>

      {/* Tickets Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue / Subject</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Staff</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>
                <div className="font-semibold text-white">{ticket.title}</div>
                <div className="text-xs text-white/60 line-clamp-1 max-w-sm">
                  {ticket.description}
                </div>
                <div className="text-[10px] text-white/40 mt-1 uppercase font-mono">
                  Category: {ticket.category} · By {ticket.reportedBy.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-lime shrink-0" />
                  <span>{ticket.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.priority === 'critical' || ticket.priority === 'high'
                      ? 'overdue'
                      : 'pending'
                  }
                  dot
                >
                  {ticket.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(ticket.status)} dot>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                {ticket.rating && (
                  <div className="flex items-center gap-0.5 mt-1 text-amber-300 text-xs">
                    {'★'.repeat(ticket.rating)}
                    <span className="text-[10px] text-white/50 ml-1">({ticket.rating}/5)</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {ticket.assignedTo ? (
                  <div className="text-xs text-white font-medium">
                    {ticket.assignedTo.name}
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 italic">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {/* Maintenance staff actions */}
                  {isMaintenanceStaff && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                    <>
                      {ticket.status === 'open' || ticket.status === 'assigned' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStatusModal(ticket, 'in_progress')}
                        >
                          Start Work
                        </Button>
                      ) : (
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={() => openStatusModal(ticket, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </>
                  )}

                  {/* Student rate action if resolved */}
                  {ticket.status === 'resolved' && !ticket.rating && (
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => openRatingModal(ticket)}
                      className="shadow-[0_0_12px_rgba(131,243,77,0.3)]"
                    >
                      <Star className="w-3.5 h-3.5 mr-1" /> Rate Work
                    </Button>
                  )}

                  {ticket.status === 'closed' && (
                    <span className="text-xs text-white/40">Closed</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Report Campus Facility Issue"
        description="Submit repair or safety issue for urgent facility inspection."
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4">
          <Input
            label="Issue Summary"
            placeholder="e.g. Water leak near projector rack in Turing Hall"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Facility Category"
              error={errors.category?.message}
              options={[
                { value: 'electrical', label: 'Electrical & Lighting' },
                { value: 'plumbing', label: 'Plumbing & Water' },
                { value: 'hvac', label: 'HVAC & Air Conditioning' },
                { value: 'it_hardware', label: 'Network & Lab Hardware' },
                { value: 'furniture', label: 'Furniture & Seating' },
                { value: 'cleaning', label: 'Cleaning & Sanitation' },
                { value: 'other', label: 'Other Facility Concern' },
              ]}
              {...register('category')}
            />

            <Select
              label="Urgency / Priority"
              error={errors.priority?.message}
              options={[
                { value: 'low', label: 'Low (Within 48 hours)' },
                { value: 'medium', label: 'Medium (Within 12 hours)' },
                { value: 'high', label: 'High (Within 4 hours)' },
                { value: 'critical', label: 'Critical / Safety Hazard (Immediate)' },
              ]}
              {...register('priority')}
            />
          </div>

          <Input
            label="Exact Campus Location"
            placeholder="e.g. CS Block 2nd Floor, Room 204 near back door"
            error={errors.location?.message}
            {...register('location')}
          />

          <Textarea
            label="Detailed Description"
            placeholder="Explain symptoms, severity, and any immediate precautions taken..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ring/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Log Maintenance Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Staff Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Ticket to ${targetStatus.replace('_', ' ').toUpperCase()}`}
        description={`Log technician progress for '${activeTicket?.title}'.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" onClick={confirmStatusUpdate}>
              Confirm Update
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label={targetStatus === 'resolved' ? 'Resolution Summary Notes' : 'Progress Comment'}
            placeholder={
              targetStatus === 'resolved'
                ? 'e.g. Replaced faulty 2-inch drainage valve. Lines pressurized and tested.'
                : 'e.g. Arrived on site with repair tools. Inspecting conduit.'
            }
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>

      {/* Student 5-Star Rating Modal */}
      <Modal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        title="Rate Maintenance Service"
        description={`Confirm work completed for '${ratingTarget?.title}'.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRatingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" onClick={confirmRating}>
              Submit Rating &amp; Close Ticket
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                  star <= selectedRating ? 'text-amber-300' : 'text-white/20'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-xs text-white/70 font-semibold">
            {selectedRating === 5
              ? 'Excellent (+15 activity points for staff)'
              : selectedRating === 4
              ? 'Good resolution'
              : 'Satisfactory'}
          </p>

          <Textarea
            label="Feedback (Optional)"
            placeholder="Help us improve campus facility turnaround times..."
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
            rows={2}
          />
        </div>
      </Modal>
    </div>
  );
};
