import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Home,
  ShieldAlert,
  Search,
  Send,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

interface HODContact {
  slNo: number;
  name: string;
  department: string;
  phone: string;
  email: string;
}

const HOD_DIRECTORY: HODContact[] = [
  { slNo: 1, name: 'Dr. Chandrappa D N', department: 'ECE (Electronics & Communication)', phone: '+91-9739099707', email: 'ecehod@sjbit.edu.in' },
  { slNo: 2, name: 'Dr. Vitala H.R', department: 'Mechanical Engineering', phone: '+91-9916907193', email: 'mechhod@sjbit.edu.in' },
  { slNo: 3, name: 'Dr. Prasad C S M V', department: 'Civil Engineering', phone: '+91-9972835799', email: 'civhod@sjbit.edu.in' },
  { slNo: 4, name: 'Dr. Krishna A N', department: 'CSE (Computer Science & Engg)', phone: '+91-9739099708', email: 'csehod@sjbit.edu.in' },
  { slNo: 5, name: 'Dr. Gopalakrishna M T', department: 'ISE (Information Science & Engg)', phone: '+91-8660744196', email: 'isehod@sjbit.edu.in' },
  { slNo: 6, name: 'Dr. Chandrashekar M J', department: 'EEE (Electrical & Electronics)', phone: '+91-9886328100', email: 'eeehod@sjbit.edu.in' },
  { slNo: 7, name: 'Dr. Abhilash C N', department: 'AI & ML (Artificial Intelligence & ML)', phone: '+91-6363983527', email: 'aimlhod@sjbit.edu.in' },
  { slNo: 8, name: 'Dr. Chandrashekar D K', department: 'CSE (Data Science) I/C HoD', phone: '+91-9900329969', email: 'dshod@sjbit.edu.in' },
  { slNo: 9, name: 'Dr. Mamatha J', department: 'MBA (Department of Management Studies)', phone: '+91-9901176722', email: 'mbahod@sjbit.edu.in' },
  { slNo: 10, name: 'Dr. Nagamani S', department: 'MCA (Master of Computer Applications)', phone: '+91-9844081602', email: 'mcahod@sjbit.edu.in' },
  { slNo: 11, name: 'Dr. Poornima M', department: 'Mathematics Department HOD', phone: '+91-9620513818', email: 'mathshod@sjbit.edu.in' },
  { slNo: 12, name: 'Dr. Doreswamy B H', department: 'Physics Department HOD', phone: '+91-6366334799', email: 'phyhod@sjbit.edu.in' },
  { slNo: 13, name: 'Dr. Bhanu Prakash G', department: 'Chemistry Department HOD', phone: '+91-9742988988', email: 'chehod@sjbit.edu.in' },
  { slNo: 14, name: 'Dr. Ranganatha G H', department: 'Sports & Physical Education', phone: '+91-9449379213', email: 'sports@sjbit.edu.in' },
  { slNo: 15, name: 'Mr. Vinay', department: 'Central Library & Information Centre', phone: '+91-9886811828', email: 'librarian@sjbit.edu.in' },
];

export const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hods' | 'admin' | 'placement' | 'hostel' | 'helplines'>('hods');
  const [hodSearch, setHodSearch] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredHODs = HOD_DIRECTORY.filter(
    (h) =>
      h.name.toLowerCase().includes(hodSearch.toLowerCase()) ||
      h.department.toLowerCase().includes(hodSearch.toLowerCase()) ||
      h.email.toLowerCase().includes(hodSearch.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormName('');
      setFormMobile('');
      setFormEmail('');
      setFormAddress('');
      setFormMessage('');
      toast.success('Inquiry Submitted Successfully', {
        description: 'Thank you for contacting SJBIT. The administrative office will reach out shortly.',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* 1. Header Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-md">
          <img src="/sjbit-emblem.png" alt="SJBIT" className="w-4 h-4 rounded-full bg-white p-0.5" />
          <span>SJB Institute of Technology · Official Campus Directory</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Get in Touch <span className="text-lime">with SJBIT</span>
        </h1>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed">
          Official administrative office contacts, department HODs, admission counseling numbers, hostel wardens, and campus emergency helplines.
        </p>
      </div>

      {/* 2. Top Contact Information & Interactive Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (From Screenshot) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-card border border-ring/80 shadow-2xl space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Send an Inquiry</h2>
            <p className="text-xs text-white/60">
              Fill out your details below and our administrative reception will respond promptly.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-row/80 border border-ring/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  placeholder="+91 Mobile number"
                  className="w-full bg-row/80 border border-ring/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">E-mail ID</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-row/80 border border-ring/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Address / Location</label>
              <textarea
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="Enter your address or city"
                rows={2}
                className="w-full bg-row/80 border border-ring/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Message / Inquiry Details</label>
              <textarea
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Enter your query regarding admissions, syllabus, exams, or placements..."
                rows={4}
                className="w-full bg-row/80 border border-ring/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
                required
              />
            </div>

            <Button
              type="submit"
              variant="lime"
              size="md"
              className="w-full font-bold shadow-[0_0_20px_rgba(131,243,77,0.35)]"
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4 mr-1.5" /> Submit Inquiry
            </Button>
          </form>
        </div>

        {/* Right: Official Address & Key Contact Info (From Screenshot) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Campus Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-card border border-ring/80 space-y-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">SJB Institute of Technology</h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  No. 67, BGS Health &amp; Education City, Dr. Vishnuvardhan Road, Kengeri, Bengaluru, Karnataka – 560060, INDIA.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-ring/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lime shrink-0" />
                <div>
                  <span className="text-[10px] text-white/50 block">Official Principal Email</span>
                  <a href="mailto:principal@sjbit.edu.in" className="font-semibold text-white hover:text-lime">
                    principal@sjbit.edu.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime shrink-0" />
                <div>
                  <span className="text-[10px] text-white/50 block">Landline Board</span>
                  <span className="font-semibold text-white">+91-80-28612445 / 46</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Enquiries Card */}
          <div className="p-6 rounded-2xl bg-card border border-amber-400/30 space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">For Admissions Enquiries</h3>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <div className="p-2.5 rounded-lg bg-row border border-ring/60">
                <span className="font-semibold text-amber-300 block mb-0.5">Management Quota Admissions:</span>
                <span className="text-white">+91 9591936004 / +91 9606485138</span>
              </div>

              <div className="p-2.5 rounded-lg bg-row border border-ring/60">
                <span className="font-semibold text-amber-300 block mb-0.5">CET &amp; COMED-K Admissions:</span>
                <span className="text-white">Contact for Admission: +91 9739078206</span>
                <span className="block text-[11px] text-white/60">Principal Contact: +91 9008719999</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-white/60">Admissions Email:</span>
                <a href="mailto:admission@bgsgroup.org" className="text-lime font-medium hover:underline">
                  admission@bgsgroup.org
                </a>
              </div>
            </div>
          </div>

          {/* Emergency & Welfare Helplines */}
          <div className="p-5 rounded-2xl bg-card border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Campus Helpline Numbers</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[11px] text-white/60 block">Women Safety Cell</span>
                <span className="font-bold text-white text-sm">+91-7204081185</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[11px] text-white/60 block">Student Welfare &amp; Grievances</span>
                <span className="font-bold text-white text-sm">+91-9902310181</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Official SJBIT Directory Tabs */}
      <section className="space-y-6 pt-4 border-t border-ring/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Official Department &amp; Administrative Directory
            </h2>
            <p className="text-xs text-white/60">
              Verified phone numbers and email contacts published by SJB Institute of Technology.
            </p>
          </div>

          {/* Directory Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-card border border-ring/60">
            <button
              type="button"
              onClick={() => setActiveTab('hods')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hods'
                  ? 'bg-lime text-lime-ink shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              HOD Contacts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-lime text-lime-ink shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Admin &amp; Exam
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('placement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'placement'
                  ? 'bg-lime text-lime-ink shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Placement Office
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hostel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hostel'
                  ? 'bg-lime text-lime-ink shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Hostel Wardens
            </button>
          </div>
        </div>

        {/* Tab 1: HODs Table */}
        {activeTab === 'hods' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={hodSearch}
                onChange={(e) => setHodSearch(e.target.value)}
                placeholder="Filter HOD name or department..."
                className="w-full bg-card border border-ring rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lime"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-ring/80 bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-row/80 border-b border-ring/80 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Sl. No</th>
                    <th className="py-3 px-4">HOD Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Direct Phone</th>
                    <th className="py-3 px-4">Official Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ring/50 text-white/80">
                  {filteredHODs.map((h) => (
                    <tr key={h.slNo} className="hover:bg-row/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-white/50">{h.slNo}</td>
                      <td className="py-3 px-4 font-bold text-white">{h.name}</td>
                      <td className="py-3 px-4">{h.department}</td>
                      <td className="py-3 px-4 font-mono text-lime font-semibold">
                        <a href={`tel:${h.phone}`} className="hover:underline">{h.phone}</a>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-300">
                        <a href={`mailto:${h.email}`} className="hover:underline">{h.email}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Admin & Exam Sections */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-lime" />
                <h3 className="font-bold text-white text-sm">Principal Office / Reception</h3>
              </div>
              <p className="text-xs text-white/60">Front desk reception and official correspondence.</p>
              <div className="p-3 rounded-lg bg-row border border-ring/60 font-mono text-xs text-lime">
                +91-6366041109<br />+91-80-28612445 / 46
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Account Section</h3>
              </div>
              <p className="text-xs text-white/60">Fee payments, scholarships, and financial verification.</p>
              <div className="p-3 rounded-lg bg-row border border-ring/60 font-mono text-xs text-amber-300">
                +91-9449213292<br />+91-9986502012
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Exam Section (Autonomous)</h3>
              </div>
              <p className="text-xs text-white/60">CIE tests, VTU semester exams, and grade cards.</p>
              <div className="p-3 rounded-lg bg-row border border-ring/60 text-xs space-y-1 font-mono text-white/90">
                <p>Dr. Vitala H.R: <span className="text-lime">9591987329</span></p>
                <p>Dr. Supreeth HSG: <span className="text-lime">9986207339</span></p>
                <p>Mr. Srinivas S.R: <span className="text-lime">9880762882</span></p>
                <p>Land Line: <span className="text-white/60">6366041109</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Placement Office */}
        {activeTab === 'placement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-lime" />
                <div>
                  <h3 className="font-bold text-white text-base">Mr. Prashanth B.R</h3>
                  <p className="text-xs text-white/60">Senior Training &amp; Placement Officer</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-row border border-ring/60 font-mono text-sm text-lime font-bold">
                +91-9902808424
              </div>
              <p className="text-xs text-white/60">
                Campus recruitment drives, corporate internships, and industry MOUs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-ring/80 space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Mr. Kumara M</h3>
                  <p className="text-xs text-white/60">Manager HRD</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-row border border-ring/60 font-mono text-sm text-amber-300 font-bold">
                +91-9900638899
              </div>
              <p className="text-xs text-white/60">
                Student skill readiness, pre-placement training, and recruiter relations.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Hostel Wardens */}
        {activeTab === 'hostel' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-2">
              <Home className="w-5 h-5 text-lime" />
              <h4 className="font-bold text-white text-sm">Dr. Shantha Kumar H. C.</h4>
              <p className="text-[11px] text-white/60">Associate Professor &amp; Chief Warden Boys</p>
              <p className="font-mono text-xs text-lime font-semibold pt-1">+91-9448571119</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-2">
              <Home className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-sm">Dr. Poornima M</h4>
              <p className="text-[11px] text-white/60">Asst. Professor &amp; Chief Warden Girls</p>
              <p className="font-mono text-xs text-emerald-400 font-semibold pt-1">+91-9620513818</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-2">
              <Home className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-white text-sm">Mr. Babu Rajendra Prasad M</h4>
              <p className="text-[11px] text-white/60">Residential Warden</p>
              <p className="font-mono text-xs text-blue-300 font-semibold pt-1">+91-9663601524</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-ring/80 space-y-2">
              <Home className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white text-sm">Mrs. Rosalin Tabitha Kumari</h4>
              <p className="text-[11px] text-white/60">Residential Warden</p>
              <p className="font-mono text-xs text-purple-300 font-semibold pt-1">+91-9844097561</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
