import React, { useState } from 'react';
import { Package, Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
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

interface ResourceItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
}

interface RequestItem {
  id: string;
  resourceId: string;
  resourceName: string;
  applicantName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'requested' | 'approved' | 'issued' | 'returned' | 'overdue';
  purpose: string;
}

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'faculty' || user?.role === 'admin' || user?.role === 'maintenance';

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res-1',
      name: 'Sony Alpha 7 IV 4K Camera Kit',
      category: 'Media Gear',
      totalQuantity: 3,
      availableQuantity: 2,
      location: 'Media Center Room 104',
    },
    {
      id: 'res-2',
      name: 'Meta Quest 3 VR Headset (512GB)',
      category: 'VR / Hardware',
      totalQuantity: 6,
      availableQuantity: 5,
      location: 'CS Advanced Labs',
    },
    {
      id: 'res-3',
      name: 'Arduino Mega & Sensor Pro Kit',
      category: 'Electronics',
      totalQuantity: 20,
      availableQuantity: 18,
      location: 'Electronics Lab Storage B',
    },
    {
      id: 'res-4',
      name: 'JBL EON Portable PA Sound System',
      category: 'Audio',
      totalQuantity: 4,
      availableQuantity: 4,
      location: 'Facilities Equipment Cage',
    },
  ]);

  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 'req-1',
      resourceId: 'res-1',
      resourceName: 'Sony Alpha 7 IV 4K Camera Kit',
      applicantName: 'Priya Patel (Student)',
      quantity: 1,
      startDate: '2026-11-20',
      endDate: '2026-11-22',
      status: 'issued',
      purpose: 'HackCampus official photography and recap trailer.',
    },
    {
      id: 'req-2',
      resourceId: 'res-2',
      resourceName: 'Meta Quest 3 VR Headset (512GB)',
      applicantName: 'Rohan Sharma',
      quantity: 1,
      startDate: '2026-11-21',
      endDate: '2026-11-23',
      status: 'requested',
      purpose: 'Spatial UI demonstration workshop for guild members.',
    },
  ]);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState('res-1');
  const [reqQuantity, setReqQuantity] = useState(1);
  const [reqStartDate, setReqStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqEndDate, setReqEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqPurpose, setReqPurpose] = useState('');

  const getStatusBadge = (status: RequestItem['status']): BadgeVariant => {
    switch (status) {
      case 'requested':
        return 'pending';
      case 'approved':
        return 'info';
      case 'issued':
        return 'lime';
      case 'returned':
        return 'approved';
      case 'overdue':
        return 'overdue';
      default:
        return 'neutral';
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const resource = resources.find((r) => r.id === selectedResId);
    if (!resource) return;

    if (reqQuantity > resource.availableQuantity) {
      toast.error('Insufficient Available Units', {
        description: `Only ${resource.availableQuantity} unit(s) are currently on campus.`,
      });
      return;
    }

    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      resourceId: resource.id,
      resourceName: resource.name,
      applicantName: user?.name || 'Student',
      quantity: reqQuantity,
      startDate: reqStartDate,
      endDate: reqEndDate,
      status: 'requested',
      purpose: reqPurpose,
    };

    setRequests([newReq, ...requests]);
    setCheckoutModalOpen(false);
    setReqPurpose('');
    toast.success('Resource Checkout Requested!', {
      description: `Request for ${resource.name} (x${reqQuantity}) submitted for lab approval.`,
    });
  };

  const handleStatusTransition = (
    reqId: string,
    newStatus: 'approved' | 'issued' | 'returned' | 'overdue'
  ) => {
    const target = requests.find((r) => r.id === reqId);
    if (!target) return;

    // Available quantity updates at each step:
    // When issued: availableQuantity decreases
    // When returned: availableQuantity increases
    if (newStatus === 'issued' && target.status !== 'issued') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === target.resourceId
            ? { ...r, availableQuantity: Math.max(0, r.availableQuantity - target.quantity) }
            : r
        )
      );
    } else if (newStatus === 'returned' && (target.status === 'issued' || target.status === 'overdue')) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === target.resourceId
            ? { ...r, availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + target.quantity) }
            : r
        )
      );
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
    );

    toast.success(`Request marked: ${newStatus.toUpperCase()}`, {
      description: `Available inventory dynamically adjusted.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hardware &amp; Lab Resources
            </h1>
            <Badge variant="lime">Dynamic Inventory</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Request lab gear, cameras, and VR headsets with live checkout lifecycle tracking.
          </p>
        </div>

        <Button variant="lime" onClick={() => setCheckoutModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Request Equipment
        </Button>
      </div>

      {/* Equipment Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-card border border-ring/80 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row border border-ring text-white/60">
                {res.category}
              </span>
              <Badge variant={res.availableQuantity > 0 ? 'approved' : 'overdue'}>
                {res.availableQuantity > 0 ? `${res.availableQuantity} Left` : 'All Out'}
              </Badge>
            </div>

            <h3 className="text-base font-bold text-white line-clamp-1">{res.name}</h3>

            <div className="space-y-1 text-xs text-white/60">
              <div className="flex justify-between">
                <span>Total Pool:</span>
                <span className="font-mono text-white font-semibold">{res.totalQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white truncate max-w-[130px]">{res.location}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setSelectedResId(res.id);
                setCheckoutModalOpen(true);
              }}
              disabled={res.availableQuantity === 0}
            >
              Checkout
            </Button>
          </div>
        ))}
      </div>

      {/* Requests Lifecycle Table */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Checkout Requests &amp; Lifecycle
          </h2>
          <span className="text-xs font-mono text-white/40">
            Lifecycle: Requested → Approved → Issued → Returned
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Quantity &amp; Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Manage Step</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-semibold text-white">{req.resourceName}</div>
                  <div className="text-xs text-white/60 line-clamp-1 max-w-xs">{req.purpose}</div>
                </TableCell>
                <TableCell className="text-white text-xs">{req.applicantName}</TableCell>
                <TableCell>
                  <div className="text-lime font-mono text-xs font-bold">x{req.quantity} Unit(s)</div>
                  <div className="text-[11px] text-white/50 font-mono">
                    {req.startDate} to {req.endDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(req.status)} dot>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {req.status === 'requested' && canManage && (
                      <Button
                        variant="lime"
                        size="sm"
                        onClick={() => handleStatusTransition(req.id, 'approved')}
                      >
                        Approve
                      </Button>
                    )}
                    {req.status === 'approved' && canManage && (
                      <Button
                        variant="lime"
                        size="sm"
                        onClick={() => handleStatusTransition(req.id, 'issued')}
                      >
                        Issue Gear
                      </Button>
                    )}
                    {req.status === 'issued' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusTransition(req.id, 'returned')}
                      >
                        Mark Returned
                      </Button>
                    )}
                    {req.status === 'returned' && (
                      <span className="text-xs text-white/40">Returned</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Equipment Checkout Request"
        description="Verify time window and required unit count."
        size="md"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <Select
            label="Equipment"
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            options={resources.map((r) => ({
              value: r.id,
              label: `${r.name} (${r.availableQuantity} available)`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={reqQuantity}
              onChange={(e) => setReqQuantity(parseInt(e.target.value, 10))}
              required
            />
            <Input
              label="Checkout Date"
              type="date"
              value={reqStartDate}
              onChange={(e) => setReqStartDate(e.target.value)}
              required
            />
            <Input
              label="Return Date"
              type="date"
              value={reqEndDate}
              onChange={(e) => setReqEndDate(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Purpose of Checkout"
            placeholder="e.g. Lab experiment, project filming, hackathon hardware deployment..."
            rows={2}
            value={reqPurpose}
            onChange={(e) => setReqPurpose(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-ring/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCheckoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Submit Checkout Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
