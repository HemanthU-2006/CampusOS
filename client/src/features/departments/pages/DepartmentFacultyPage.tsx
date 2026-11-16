import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SJBIT_BRANCHES } from '../data/branchesData';
import { getFacultyByBranch, FacultyMember } from '../data/allFacultyData';
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
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Aesthetic monogram avatar generator when headshot image is missing
const FacultyAvatar: React.FC<{ member: FacultyMember; isHOD: boolean }> = ({ member, isHOD }) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Compute initials e.g. "Dr. Krishna A N" -> "KA"
  const initials = member.name
    .replace(/^Dr\.\s*|^Prof\.\s*|^Mr\.\s*|^Mrs\.\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'SJ';

  return (
    <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-white/15 bg-gradient-to-br from-[#12141a] to-[#0a0c10] relative shadow-sm flex items-center justify-center">
      {!imgFailed ? (
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[radial-gradient(ellipse_at_top,rgba(131,243,77,0.15),transparent_70%)]">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-black text-amber-400">
            {initials}
          </div>
          <span className="text-[9px] text-white/50 font-mono mt-1 leading-tight line-clamp-1">
            {member.department.split('&')[0].trim()}
          </span>
        </div>
      )}

      {isHOD && (
        <span className="absolute bottom-0 inset-x-0 bg-amber-400 text-black text-[9px] font-extrabold text-center py-0.5 tracking-wider uppercase">
          HOD
        </span>
      )}
    </div>
  );
};

export const DepartmentFacultyPage: React.FC<{ defaultDept?: string }> = ({ defaultDept }) => {
  const { deptCode } = useParams<{ deptCode?: string }>();
  const navigate = useNavigate();

  // Resolve current active department (default to param, prop, or 'ISE')
  const currentBranchCode = (deptCode || defaultDept || 'ISE').toUpperCase();

  const currentBranch = useMemo(() => {
    return (
      SJBIT_BRANCHES.find(
        (b) => b.code.toUpperCase() === currentBranchCode || b.code.replace(/[^A-Z]/g, '') === currentBranchCode.replace(/[^A-Z]/g, '')
      ) || SJBIT_BRANCHES.find((b) => b.code === 'ISE') || SJBIT_BRANCHES[0]
    );
  }, [currentBranchCode]);

  const [activeTab, setActiveTab] = useState<'teaching' | 'non-teaching'>('teaching');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentBranch.code]);

  // Fetch full faculty roster for the selected department
  const branchFaculty = useMemo(() => {
    return getFacultyByBranch(currentBranch.code);
  }, [currentBranch.code]);

  const filteredMembers = useMemo(() => {
    return branchFaculty.filter((member) => {
      const matchesTab = member.category === activeTab;
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [branchFaculty, activeTab, searchQuery]);

  const teachingCount = branchFaculty.filter((m) => m.category === 'teaching').length;
  const staffCount = branchFaculty.filter((m) => m.category === 'non-teaching').length;

  const handleBranchSelect = (code: string) => {
    setSearchQuery('');
    setSelectedFaculty(null);
    const target = code.toLowerCase().replace('&', '');
    navigate(`/faculty/${target}`);
  };

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Breadcrumbs & Return Link */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Link to="/" className="text-white/70 hover:text-lime transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Departments</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-400 font-semibold">{currentBranch.name}</span>
        </div>

        <Link to="/">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* 2. Department Selector Bar (All 9 Branches with live counts) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Select Department Faculty Roster:
          </span>
          <span className="text-[11px] text-lime font-mono">
            {SJBIT_BRANCHES.length} Autonomous Branches
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SJBIT_BRANCHES.map((b) => {
            const isSelected = b.code === currentBranch.code;
            return (
              <button
                key={b.code}
                onClick={() => handleBranchSelect(b.code)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : 'bg-[#121316] text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{b.code}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {b.facultyCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Header with Department Academic Info */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="lime" className="mx-auto uppercase tracking-wider text-[11px]">
          Department Directory · {branchFaculty.length} Verified Members
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Department of <span className="text-amber-400">{currentBranch.name}</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl mx-auto">
          {currentBranch.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-white/60">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /> {currentBranch.block}
          </span>
          <span>·</span>
          <span>
            HOD: <strong className="text-white">{currentBranch.hod}</strong> ({currentBranch.qualification})
          </span>
          {currentBranch.hodEmail && (
            <>
              <span>·</span>
              <span className="text-lime font-mono">{currentBranch.hodEmail}</span>
            </>
          )}
        </div>
      </div>

      {/* 4. Controls: Tabs & Instant Search */}
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
            placeholder={`Search ${currentBranch.code} faculty or designation...`}
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

      {/* 5. 3-Column Faculty Cards */}
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
              {/* Headshot / Monogram Avatar */}
              <FacultyAvatar member={member} isHOD={isHOD} />

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
                      ? `Dept of ${currentBranch.name}`
                      : `${currentBranch.code} Labs & Technical Staff`}
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
            No faculty members found matching "{searchQuery}" in this category.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* 6. Detailed Faculty Modal */}
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
              <FacultyAvatar member={selectedFaculty} isHOD={selectedFaculty.tier === 'hod'} />

              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-[10px] uppercase">
                  {selectedFaculty.designation}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {selectedFaculty.name}
                </h3>
                <p className="text-xs text-white/70">
                  Department of {currentBranch.name}
                </p>
                <p className="text-xs text-white/50">
                  SJB Institute of Technology, Bengaluru ({currentBranch.scheme})
                </p>
              </div>
            </div>

            {/* Detailed Department Credentials */}
            <div className="p-4 rounded-xl bg-[#121316] border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Location:</strong> {currentBranch.block}, SJBIT Campus
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Official Contact:</strong>{' '}
                  <span className="text-amber-300 font-mono">
                    {selectedFaculty.tier === 'hod' && currentBranch.hodEmail
                      ? currentBranch.hodEmail
                      : `${selectedFaculty.name.toLowerCase().replace(/[^a-z]/g, '')}@sjbit.edu.in`}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Accreditation:</strong> {currentBranch.accreditation}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Curriculum Scheme:</strong> {currentBranch.scheme}
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
