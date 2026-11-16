import api from '@/lib/axios';
import { SJBIT_BRANCHES } from '@/features/departments/data/branchesData';

export interface AIChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface MaintenanceTriageResult {
  category: 'electrical' | 'plumbing' | 'furniture' | 'hvac' | 'it_hardware' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  suggestedAction: string;
  safetyCaution?: string;
  estimatedHours: number;
}

/**
 * Intelligent Client-Side Knowledge Engine
 * Provides instant grounded responses about SJBIT campus even when the backend
 * server is unreachable (e.g. static hosting on Vercel or cold start).
 */
function getClientSideCampusAnswer(query: string): string {
  const q = query.toLowerCase();

  // 1. Specific HOD & Branch Lookups
  if (q.includes('hod') || q.includes('head') || q.includes('chairperson') || q.includes('department')) {
    if (q.includes('ise') || q.includes('information science')) {
      const ise = SJBIT_BRANCHES.find((b) => b.code === 'ISE');
      return (
        `The Head of the Department (HOD) of **Information Science & Engineering (ISE)** is **${ise?.hod || 'Dr. Rekha B'}** (${ise?.qualification || 'M.Tech., Ph.D., Professor & HOD'}).\n\n` +
        `• **Office Location**: ${ise?.block || 'Aryabhata Block, 1st Floor'}\n` +
        `• **Official Email**: ${ise?.hodEmail || 'hodise@sjbit.edu.in'}\n` +
        `• **Faculty Strength**: ${ise?.facultyCount || 41} dedicated teaching & technical staff\n` +
        `• **Annual Intake**: ${ise?.intake || 180} seats (VTU Autonomous 2022 Scheme)\n\n` +
        `You can explore the full roster on our dedicated [ISE Faculty Page](/faculty/ise).`
      );
    }

    if (q.includes('cse') || q.includes('computer science')) {
      const cse = SJBIT_BRANCHES.find((b) => b.code === 'CSE');
      return `The HOD of **Computer Science & Engineering (CSE)** is **${cse?.hod}** (${cse?.qualification}).\n• Office: ${cse?.block}\n• Email: ${cse?.hodEmail}\n• Intake: ${cse?.intake} seats`;
    }

    if (q.includes('ai') || q.includes('aiml') || q.includes('machine learning')) {
      const aiml = SJBIT_BRANCHES.find((b) => b.code === 'AI&ML');
      return `The HOD of **Artificial Intelligence & Machine Learning (AI&ML)** is **${aiml?.hod}** (${aiml?.qualification}).\n• Office: ${aiml?.block}\n• Email: ${aiml?.hodEmail}\n• Intake: ${aiml?.intake} seats`;
    }

    if (q.includes('data science') || q.includes('cs-ds') || q.includes('ds')) {
      const csds = SJBIT_BRANCHES.find((b) => b.code === 'CS-DS');
      return `The Program Head of **CSE (Data Science)** is **${csds?.hod}** (${csds?.qualification}).\n• Office: ${csds?.block}\n• Email: ${csds?.hodEmail}\n• Intake: ${csds?.intake} seats`;
    }

    if (q.includes('ece') || q.includes('electronics')) {
      const ece = SJBIT_BRANCHES.find((b) => b.code === 'ECE');
      return `The HOD of **Electronics & Communication Engineering (ECE)** is **${ece?.hod}** (${ece?.qualification}).\n• Office: ${ece?.block}\n• Email: ${ece?.hodEmail}\n• Intake: ${ece?.intake} seats`;
    }

    if (q.includes('eee') || q.includes('electrical')) {
      const eee = SJBIT_BRANCHES.find((b) => b.code === 'EEE');
      return `The HOD of **Electrical & Electronics Engineering (EEE)** is **${eee?.hod}** (${eee?.qualification}).\n• Office: ${eee?.block}\n• Email: ${eee?.hodEmail}\n• Intake: ${eee?.intake} seats`;
    }

    if (q.includes('mech') || q.includes('mechanical')) {
      const mech = SJBIT_BRANCHES.find((b) => b.code === 'MECH');
      return `The HOD of **Mechanical Engineering (MECH)** is **${mech?.hod}** (${mech?.qualification}).\n• Office: ${mech?.block}\n• Email: ${mech?.hodEmail}\n• Intake: ${mech?.intake} seats`;
    }

    if (q.includes('civil')) {
      const civil = SJBIT_BRANCHES.find((b) => b.code === 'CIVIL');
      return `The HOD of **Civil Engineering (CIVIL)** is **${civil?.hod}** (${civil?.qualification}).\n• Office: ${civil?.block}\n• Email: ${civil?.hodEmail}\n• Intake: ${civil?.intake} seats`;
    }

    if (q.includes('mba') || q.includes('management')) {
      const mba = SJBIT_BRANCHES.find((b) => b.code === 'MBA');
      return `The HOD of **Department of Management Studies (MBA)** is **${mba?.hod}** (${mba?.qualification}).\n• Office: ${mba?.block}\n• Email: ${mba?.hodEmail}\n• Intake: ${mba?.intake} seats`;
    }
  }

  // 2. Leadership & Institutional Governance
  if (q.includes('principal') || q.includes('president') || q.includes('leadership') || q.includes('swamiji') || q.includes('trust')) {
    return (
      `**SJBIT Leadership & Governance**:\n\n` +
      `1. **Founder President**: Jagadguru Padmabhushana Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji\n` +
      `2. **President**: Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji (Head of Sri Adichunchanagiri Math)\n` +
      `3. **Managing Director**: Sri Sri Dr. Prakashanatha Swamiji\n` +
      `4. **Principal**: Dr. K. V. Mahendra Prashanth (Ph.D.)\n\n` +
      `SJBIT is managed under the divine patronage of **Sri Adichunchanagiri Shikshana Trust ®**.`
    );
  }

  // 3. Counseling Codes & Admissions
  if (q.includes('code') || q.includes('cet') || q.includes('comed') || q.includes('admission') || q.includes('seat')) {
    return (
      `**Official SJBIT Counseling & Institution Codes**:\n\n` +
      `• **KCET Code**: \`E115\`\n` +
      `• **COMED-K Code**: \`E107\`\n` +
      `• **MBA Code**: \`B288\`\n` +
      `• **MCA Code**: \`C547MC\`\n\n` +
      `SJBIT is an Autonomous Institution under VTU, Belagavi, accredited by **NAAC with 'A+' Grade** and NBA accredited.`
    );
  }

  // 4. Venues & Booking
  if (q.includes('venue') || q.includes('book') || q.includes('hall') || q.includes('auditorium') || q.includes('kuvempu') || q.includes('aryabhata')) {
    return (
      `**Campus Venues in CampusOS**:\n\n` +
      `• **Kuvempu Auditorium** (Capacity: 800) – Main Cultural & Event Center\n` +
      `• **Aryabhata Seminar Hall** (Capacity: 250) – Aryabhata Block 1st Floor\n` +
      `• **Alan Turing Hall** (Capacity: 120) – CS & IT Academic Complex\n` +
      `• **Sir M Visvesvaraya Hall** (Capacity: 200) – Mechanical & Core Block\n\n` +
      `To book a venue, sign in to the portal and navigate to the **Venues** tab to check real-time availability and submit reservations.`
    );
  }

  // 5. Events & Waitlists
  if (q.includes('event') || q.includes('fest') || q.includes('waitlist') || q.includes('varchasva') || q.includes('arnaav')) {
    return (
      `**Events & Auto-Waitlist in CampusOS**:\n\n` +
      `CampusOS features automated waitlist promotion. When a registered participant cancels, the next waitlisted student is automatically promoted and issued a QR check-in pass.\n\n` +
      `• **Upcoming Flagship Fest**: *VARCHASVA & ARNAAV 2026* (Technical & Cultural Showcase)\n` +
      `• **Project Exhibition 2026**: Intra-department capstone project showcase in May.`
    );
  }

  // 6. Maintenance & Ticketing
  if (q.includes('maintenance') || q.includes('repair') || q.includes('ticket') || q.includes('broken') || q.includes('plumbing') || q.includes('electrical')) {
    return (
      `**Campus Maintenance Ticketing**:\n\n` +
      `You can submit facility repair requests (electrical, plumbing, lab hardware, furniture, HVAC) directly through the **Maintenance** portal. Upload a photo, and the maintenance team will be automatically assigned with an SLA turnaround of 4 to 24 hours.`
    );
  }

  // 7. Faculty Information
  if (q.includes('faculty') || q.includes('teacher') || q.includes('professor') || q.includes('staff')) {
    return (
      `SJBIT features over 200+ distinguished faculty members across 9 academic branches:\n\n` +
      `• **Information Science & Engineering (ISE)**: 41 teaching and support staff, headed by **Dr. Rekha B**.\n` +
      `• You can browse full qualifications, designations, and room numbers on our [ISE Faculty Directory](/faculty/ise).`
    );
  }

  // 8. General Campus Assistance
  return (
    `Hello! I'm **Sage**, your SJBIT CampusOS Assistant.\n\n` +
    `I can assist you with:\n` +
    `• **Academic Branches**: Details, intake, and HODs for all 9 departments (CSE, ISE, AI&ML, etc.)\n` +
    `• **Faculty Information**: Full ISE faculty directory (41 members)\n` +
    `• **Admissions & Codes**: CET (\`E115\`), COMED-K (\`E107\`), MBA (\`B288\`)\n` +
    `• **Venues & Events**: Kuvempu Auditorium, Aryabhata Hall, and reservation guidelines\n` +
    `• **Campus Facilities**: Innovation labs, proctoring, and maintenance ticketing\n\n` +
    `Feel free to ask a specific question like *"Who is the HOD of ISE department?"* or *"What is the CET code?"*`
  );
}

export const aiApi = {
  chat: async (message: string, history: AIChatMessage[] = []): Promise<string> => {
    try {
      const res = await api.post('/ai/chat', { message, history });
      const reply = res.data?.data?.reply;
      if (reply && typeof reply === 'string' && reply.trim() !== '') {
        return reply;
      }
      return getClientSideCampusAnswer(message);
    } catch {
      // Fallback seamlessly to the grounded client-side campus knowledge engine
      return getClientSideCampusAnswer(message);
    }
  },

  triage: async (
    title: string,
    description: string,
    location: string
  ): Promise<MaintenanceTriageResult> => {
    try {
      const res = await api.post('/ai/triage', { title, description, location });
      return res.data?.data;
    } catch {
      // Offline fallback
      return {
        category: 'other',
        priority: 'medium',
        summary: title,
        suggestedAction: `Inspect ${location}`,
        estimatedHours: 4,
      };
    }
  },
};
