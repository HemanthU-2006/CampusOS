import React, { useState } from 'react';
import { Search, MapPin, Tag, Plus, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PillCard } from '@/components/ui/PillCard';
import { toast } from 'sonner';

interface LostFoundCard {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'lost' | 'found';
  location: string;
  date: string;
  reportedBy: string;
  status: 'open' | 'claimed' | 'resolved';
  tags: string[];
}

export const LostFoundPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundCard[]>([
    {
      id: 'lf-1',
      title: 'Matte Blue Hydro Flask (32oz)',
      description: 'Found under row 3 desk in Alan Turing Seminar Hall after 4:00 PM algorithms lecture.',
      category: 'Bottles & Containers',
      type: 'found',
      location: 'Turing Seminar Hall',
      date: 'Today, 4:15 PM',
      reportedBy: 'Suresh Kumar',
      status: 'open',
      tags: ['bottle', 'blue', 'turing', 'flask'],
    },
    {
      id: 'lf-2',
      title: 'Casio fx-991EX ClassWiz Calculator',
      description: 'Lost during Engineering Mathematics practical. Has a small cat sticker on back case.',
      category: 'Electronics',
      type: 'lost',
      location: 'Academic Block 1 Room 102',
      date: 'Yesterday',
      reportedBy: 'Priya Patel (Student)',
      status: 'open',
      tags: ['calculator', 'casio', 'math'],
    },
    {
      id: 'lf-3',
      title: 'Apple AirPods Pro 2 Case',
      description: 'Found on grass near Open Air Amphitheatre benches.',
      category: 'Audio Gear',
      type: 'found',
      location: 'Amphitheatre',
      date: 'Nov 12',
      reportedBy: 'Rohan Sharma',
      status: 'claimed',
      tags: ['apple', 'airpods', 'case'],
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Post modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newType, setNewType] = useState<'lost' | 'found'>('lost');
  const [newLocation, setNewLocation] = useState('');

  // Claim modal
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<LostFoundCard | null>(null);
  const [proofDetails, setProofDetails] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: LostFoundCard = {
      id: `lf-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      type: newType,
      location: newLocation,
      date: 'Just now',
      reportedBy: user?.name || 'Student',
      status: 'open',
      tags: [newCategory.toLowerCase()],
    };

    setItems([newItem, ...items]);
    setPostModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewLocation('');

    // Check for match suggestions
    const opposite = newType === 'lost' ? 'found' : 'lost';
    const match = items.find((i) => i.type === opposite && i.category === newCategory);

    if (match) {
      toast.success(`Item Posted! Potential Match Detected: '${match.title}'`, {
        description: `Check the board to claim or coordinate pickup.`,
      });
    } else {
      toast.success('Notice Posted to Campus Lost & Found!');
    }
  };

  const openClaimModal = (item: LostFoundCard) => {
    setClaimTarget(item);
    setProofDetails('');
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = () => {
    if (!claimTarget || !proofDetails.trim()) return;

    setItems((prev) =>
      prev.map((i) => (i.id === claimTarget.id ? { ...i, status: 'claimed' } : i))
    );

    setClaimModalOpen(false);
    toast.success('Claim Request Submitted!', {
      description: `Notification sent to finder (${claimTarget.reportedBy}) for verification.`,
    });
  };

  const handleApproveResolution = (item: LostFoundCard) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'resolved' } : i))
    );
    toast.success('Item Claim Approved!', {
      description: `Marked as resolved. Notification sent to claimant.`,
    });
  };

  const filteredItems = items.filter((i) => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
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
              Lost &amp; Found Directory
            </h1>
            <Badge variant="lime">Smart Match Suggestions</Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            Post misplaced belongings, verify ownership with proof verification, and track returns.
          </p>
        </div>

        <Button variant="lime" onClick={() => setPostModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Post Item Notice
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-btn bg-card border border-ring/80 w-fit">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('found')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'found'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-emerald-300 hover:text-emerald-200'
            }`}
          >
            Found by Someone
          </button>
          <button
            type="button"
            onClick={() => setFilterType('lost')}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'lost'
                ? 'bg-lime text-lime-ink shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            Reported Lost
          </button>
        </div>

        <div className="w-full sm:w-72">
          <SearchBar
            placeholder="Search item, bottle, keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={item.type === 'found' ? 'approved' : 'pending'}>
                  {item.type.toUpperCase()}
                </Badge>
                <Badge variant={item.status === 'resolved' ? 'resolved' : 'neutral'}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-white/65 leading-relaxed">{item.description}</p>

              <div className="space-y-1 text-xs text-white/50 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-lime" />
                  <span>{item.location}</span>
                </div>
                <div className="text-[11px] text-white/40">
                  {item.date} · Logged by {item.reportedBy}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-white/40">
                {item.category}
              </span>
              {item.status === 'open' && (
                <Button
                  variant="lime"
                  size="sm"
                  onClick={() => openClaimModal(item)}
                >
                  Claim Item
                </Button>
              )}
              {item.status === 'claimed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApproveResolution(item)}
                >
                  Verify &amp; Resolve
                </Button>
              )}
              {item.status === 'resolved' && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post Lost & Found Notice"
        description="Share details to locate owner or recover misplaced item."
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Notice Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              options={[
                { value: 'lost', label: 'I Lost an Item' },
                { value: 'found', label: 'I Found an Item' },
              ]}
            />
            <Select
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              options={[
                { value: 'Electronics', label: 'Electronics & Gadgets' },
                { value: 'Bottles & Containers', label: 'Bottles & Containers' },
                { value: 'Audio Gear', label: 'Audio Gear & Headphones' },
                { value: 'Books & Notes', label: 'Books & Stationeries' },
                { value: 'Identity & Keys', label: 'ID Cards, Wallets & Keys' },
                { value: 'Clothing', label: 'Clothing & Jackets' },
              ]}
            />
          </div>

          <Input
            label="Item Name / Headline"
            placeholder="e.g. Blue Hydro Flask 32oz"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Input
            label="Campus Location"
            placeholder="e.g. Turing Hall row 3, or Amphitheatre steps"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            required
          />

          <Textarea
            label="Distinctive Features & Details"
            placeholder="Mention scratches, stickers, color shades, or serial hints without revealing lock codes..."
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-ring/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPostModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Claim Verification Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Submit Claim Request"
        description={`Provide proof of ownership for '${claimTarget?.title}'.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" onClick={handleClaimSubmit}>
              Submit Proof
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Proof Details (e.g. Serial, Wallpaper, Stickers)"
            placeholder="Describe unique marks or contents that only the rightful owner would know..."
            rows={3}
            value={proofDetails}
            onChange={(e) => setProofDetails(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
