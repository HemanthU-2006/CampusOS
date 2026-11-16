import React, { useState } from 'react';
import { Users, Plus, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

interface ClubItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
}

interface PostItem {
  id: string;
  clubName: string;
  authorName: string;
  title: string;
  content: string;
  date: string;
}

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const isClubHeadOrAdmin = user?.role === 'club_head' || user?.role === 'admin';

  // Clubs start empty; real student societies will be registered or loaded
  const [clubs, setClubs] = useState<ClubItem[]>([]);

  // Announcements start empty
  const [posts, setPosts] = useState<PostItem[]>([]);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('c-1');

  const toggleJoin = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const nextState = !c.isJoined;
          if (nextState) {
            toast.success(`Joined ${c.name}!`, {
              description: 'You will receive announcements and event updates.',
            });
          } else {
            toast.info(`Left ${c.name}`);
          }
          return {
            ...c,
            isJoined: nextState,
            memberCount: nextState ? c.memberCount + 1 : Math.max(0, c.memberCount - 1),
          };
        }
        return c;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const club = clubs.find((c) => c.id === selectedClubId);

    const newPost: PostItem = {
      id: `p-${Date.now()}`,
      clubName: club?.name || 'SJBIT Club',
      authorName: user?.name || 'Club Head',
      title: postTitle,
      content: postContent,
      date: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    toast.success('Announcement published!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with One Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Clubs &amp; Communities
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Explore student clubs at SJBIT, join teams, and stay informed on announcements.
          </p>
        </div>

        {isClubHeadOrAdmin && (
          <Button
            variant="lime"
            size="lg"
            onClick={() => setIsPostModalOpen(true)}
            className="shadow-[0_0_20px_rgba(131,243,77,0.35)] shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Post announcement
          </Button>
        )}
      </div>

      {/* 2. Clubs Card Grid */}
      {clubs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-ring/60 text-center space-y-3">
          <Users className="w-8 h-8 text-white/30 mx-auto" />
          <p className="text-sm font-semibold text-white">No clubs registered yet</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Student societies and department clubs will appear here once registered.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="p-5 rounded-2xl bg-card border border-ring/80 hover:border-lime/40 transition-colors flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row border border-ring text-white/60">
                    {club.code}
                  </span>
                  <Badge variant={club.isJoined ? 'lime' : 'neutral'}>
                    {club.isJoined ? 'Member' : club.category}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white">{club.name}</h3>
                <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="pt-3 border-t border-ring/60 flex items-center justify-between">
                <span className="text-xs text-white/50">{club.memberCount} members</span>
                <Button
                  variant={club.isJoined ? 'outline' : 'lime'}
                  size="sm"
                  onClick={() => toggleJoin(club.id)}
                  className="min-h-[38px]"
                >
                  {club.isJoined ? 'Leave' : 'Join'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Simple Announcement Feed */}
      <section className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-lime" />
          <span>Announcements &amp; Updates</span>
        </h2>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card border border-ring/60 text-center space-y-2">
              <MessageSquare className="w-6 h-6 text-white/30 mx-auto" />
              <p className="text-xs font-semibold text-white">No announcements posted yet</p>
              <p className="text-[11px] text-white/50">
                Club updates and broadcasts will appear here.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-card border border-ring/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-lime">{post.clubName}</span>
                  <span className="text-white/40">{post.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{post.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{post.content}</p>
                <p className="text-[11px] text-white/40 pt-1">Posted by {post.authorName}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. Post Announcement Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Post Club Announcement"
        description="Share an update, workshop invitation, or schedule change with club members."
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="Announcement Title"
            placeholder="e.g. Next project sync in CSE Seminar Hall"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />

          <Textarea
            label="Message Details"
            placeholder="Write your announcement message here..."
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-ring/60">
            <Button type="button" variant="ghost" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Publish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
