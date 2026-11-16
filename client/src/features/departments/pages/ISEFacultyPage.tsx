import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ISE_FACULTY, FacultyMember } from '../data/iseFaculty';
import {
  Search,
  Users,
  GraduationCap,
  X,
  Mail,
  Building2,
  Award,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const ISEFacultyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teaching' | 'non-teaching'>('teaching');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  const filteredMembers = ISE_FACULTY.filter((member) => {
    const matchesTab = member.category === activeTab;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const teachingCount = ISE_FACULTY.filter((m) => m.category === 'teaching').length;
  const staffCount = ISE_FACULTY.filter((m) => m.category === 'non-teaching').length;

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Breadcrumb & Return Link */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Link to="/" className="text-white/70 hover:text-lime transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Departments</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-400 font-semibold">Information Science &amp; Engineering</span>
        </div>

        <Link to="/">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* 2. Header with Department Academic Info */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
          Department Directory · 41 Members
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Department of <span className="text-amber-400">Information Science &amp; Engineering</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl mx-auto">
          Autonomous VTU curriculum, state-of-the-art computational labs, and dedicated professors
          and staff stationed at Aryabhata Block, 1st &amp; 2nd Floors.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-white/60">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /> Aryabhata Block
          </span>
          <span>·</span>
          <span>HOD: <strong className="text-white">Dr. Gopalakrishna M T</strong></span>
          <span>·</span>
          <span className="text-lime font-mono">isehod@sjbit.edu.in</span>
        </div>
      </div>

      {/* 3. Top Controls: Tabs & Instant Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-b border-white/10 pb-5">
        {/* Clean Pill Tabs */}
        <div className="flex items-center gap-2 bg-[#121316] p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('teaching')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'teaching'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teaching Faculty</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'teaching'
                  ? 'bg-black/15 text-black font-extrabold'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              {teachingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('non-teaching')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'non-teaching'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Technical &amp; Support Staff</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'non-teaching'
                  ? 'bg-black/15 text-black font-extrabold'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              {staffCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by faculty name or designation..."
            className="w-full bg-[#141519] border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. 3-Column Faculty Cards (Photos formatted & fitted perfectly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const isHOD = member.tier === 'hod';

          return (
            <div
              key={member.id}
              className={`rounded-xl p-4 bg-[#15161b] border transition-all duration-300 flex items-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 group ${
                isHOD
                  ? 'border-amber-400/60 bg-[#171820] shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                  : 'border-white/10 hover:border-amber-400/40'
              }`}
            >
              {/* Formal Passport-Style Headshot (Fitting perfectly with object-cover object-top) */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-white/15 bg-[#0e1014] relative shadow-sm">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to emblem if headshot fails
                    e.currentTarget.src = '/sjbit-emblem.png';
                  }}
                />
                {isHOD && (
                  <span className="absolute bottom-0 inset-x-0 bg-amber-400 text-black text-[9px] font-extrabold text-center py-0.5 tracking-wider uppercase">
                    HOD
                  </span>
                )}
              </div>

              {/* Faculty Info */}
              <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-0.5">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h3>

                  <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wide block mt-1">
                    {member.designation}
                  </span>

                  <span className="text-[11px] text-white/50 block mt-0.5 truncate">
                    {member.category === 'teaching'
                      ? 'Dept of Information Science'
                      : 'Technical Staff · ISE Labs'}
                  </span>
                </div>

                <div className="mt-2.5">
                  <button
                    onClick={() => setSelectedFaculty(member)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded border border-amber-400/60 text-amber-400 hover:bg-amber-400 hover:text-black text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <span className="text-[10px]">→</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#141519] border border-white/10 space-y-3">
          <p className="text-sm text-white/60">
            No members found matching "{searchQuery}" in this category.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* 5. Detailed Faculty Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#16171d] border border-amber-400/40 p-6 space-y-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFaculty(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Profile */}
            <div className="flex items-start gap-5">
              <div className="w-24 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-amber-400/50 bg-black shadow-md">
                <img
                  src={selectedFaculty.photo}
                  alt={selectedFaculty.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = '/sjbit-emblem.png';
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-[10px] uppercase">
                  {selectedFaculty.designation}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {selectedFaculty.name}
                </h3>
                <p className="text-xs text-white/70">
                  Department of Information Science &amp; Engineering
                </p>
                <p className="text-xs text-white/50">
                  SJB Institute of Technology, Bengaluru (VTU Autonomous)
                </p>
              </div>
            </div>

            {/* Detailed Department Credentials */}
            <div className="p-4 rounded-xl bg-[#121316] border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Location:</strong> Aryabhata Block, 1st &amp; 2nd Floor, SJBIT Campus
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Official Contact:</strong>{' '}
                  <span className="text-amber-300 font-mono">
                    {selectedFaculty.tier === 'hod'
                      ? 'isehod@sjbit.edu.in'
                      : `${selectedFaculty.name.toLowerCase().replace(/[^a-z]/g, '')}@sjbit.edu.in`}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Academic Track:</strong> Information Science, Edge AI, Distributed Systems
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Curriculum:</strong> VTU Autonomous 2022 Scheme &amp; NEP Guidelines
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFaculty(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
