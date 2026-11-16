import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal, MaskLines, SpotlightCard, EASE } from "./cinematic";

/* ---------- Section heading ---------- */
function Heading({ eyebrow, lines, sub }) {
  return (
    <div className="section-head">
      <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
      <MaskLines lines={lines} delay={0.1} />
      <Reveal delay={0.3}><p>{sub}</p></Reveal>
    </div>
  );
}

/* ---------- Leadership ---------- */
const LEADERS = [
  {
    name: "Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji",
    role: "Founder President",
    img: "/leadership/balagangadharanatha-swamiji.png",
    featured: true,
  },
  {
    name: "Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji",
    role: "President",
    img: "/leadership/nirmalanandanatha-swamiji.png",
  },
  {
    name: "Sri Sri Dr. Prakashanatha Swamiji",
    role: "Managing Director",
    img: "/leadership/prakashanatha-swamiji.png",
  },
  {
    name: "Dr. K. V. Mahendra Prashanth",
    role: "Principal",
    img: "/leadership/mahendra-prashanth.png",
  },
];

export function Leadership() {
  return (
    <section className="section" id="about">
      <Heading
        eyebrow="Institutional heritage"
        lines={["Exceptional Leadership", "& Vision"]}
        sub="Established under the aegis of Sri Adichunchanagiri Shikshana Trust, SJBIT has grown into one of Karnataka's premier autonomous institutions."
      />
      <div className="leaders">
        {LEADERS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className={p.featured ? "leader-wrap featured" : "leader-wrap"}>
            <SpotlightCard className="leader">
              <div className="portrait">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <span className="role"><i /> {p.role}</span>
              <h3>{p.name}</h3>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Departments ---------- */
export function Departments({ departments, onSelectBranch }) {
  // departments: [{ code, name, hod, location, faculty? }]
  return (
    <section className="section" id="departments">
      <Heading
        eyebrow="Branches"
        lines={["All 9 SJBIT", "Departments"]}
        sub="VTU autonomous engineering and management branches with specialised labs and dedicated faculty."
      />
      <div className="dept-grid">
        {departments.map((d, i) => (
          <Reveal key={d.code} delay={(i % 3) * 0.08}>
            <SpotlightCard className="dept" tilt={0}>
              <span className="ghost-code" aria-hidden="true">{d.code}</span>
              <div className="dept-top"><span className="pill">{d.code}</span><small>2022 Scheme (VTU)</small></div>
              <h3>{d.name}</h3>
              <p>HOD: <b>{d.hod}</b></p>
              <p className="muted">{d.location}</p>
              <div className="dept-foot">
                {onSelectBranch ? (
                  <button
                    type="button"
                    onClick={() => onSelectBranch(d)}
                    className="arrow-link bg-transparent border-0 p-0 cursor-pointer text-left"
                  >
                    Branch Details <ArrowRight size={16} />
                  </button>
                ) : (
                  <a href={`#branches`} className="arrow-link">Branch Details <ArrowRight size={16} /></a>
                )}
                {d.faculty && (
                  <a href="/faculty/ise" className="arrow-link">
                    View Faculty ({d.faculty}) <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Infrastructure bento ---------- */
const INFRA = [
  {
    title: "Central Library & Info Centre",
    text: "45,000+ volumes, IEEE Xplore, ScienceDirect, automated barcode checkout.",
    img: "/infra/library.jpg",
    span: "wide",
  },
  {
    title: "Industry Collaboration CoEs",
    text: "Labs co-sponsored by IBM, Cisco, Texas Instruments, Bentley and Google Cloud.",
    img: "/infra/labs.jpg",
  },
  {
    title: "BGS Cultural Auditorium",
    text: "2,500-seat auditorium for symposiums, HackSJBIT and annual fests.",
    img: "/infra/auditorium.jpg",
    span: "tall",
  },
  {
    title: "Sports Arena & Gymnasiums",
    text: "Cricket pavilion, football grounds, indoor badminton and basketball courts.",
    img: "/infra/sports.jpg",
  },
  {
    title: "Hostels & Green Campus",
    text: "Hostels for 1,200+ students, solar lighting, rainwater harvesting.",
    img: "/infra/hostel.jpg",
  },
  {
    title: "Student Guilds & NSS",
    text: "Coding guilds, robotics clubs, Red Cross units and extension programs.",
    img: "/infra/clubs.jpg",
    span: "wide",
  },
];

function InfraCard({ item }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <article ref={ref} className={`infra ${item.span || ""}`}>
      <motion.img src={item.img} alt="" loading="lazy" style={{ y }} />
      <div className="infra-shade" />
      <div className="infra-copy"><h3>{item.title}</h3><p>{item.text}</p></div>
    </article>
  );
}

export function Infrastructure() {
  return (
    <section className="section" id="life">
      <Heading
        eyebrow="Life @ SJBIT"
        lines={["World-Class Campus", "Infrastructure"]}
        sub="Centres of excellence, a deep library, modern hostels, and industry collaborations."
      />
      <div className="bento">
        {INFRA.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.07} className={`bento-cell ${it.span || ""}`}><InfraCard item={it} /></Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function FinalCTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta-bg" />
      <div className="cta-glow" />
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 7) * -2.3}s`,
            animationDuration: `${14 + (i % 5) * 3}s`,
          }}
        />
      ))}
      <div className="cta-inner">
        <img className="halo rounded-full" src="/sjbit-emblem.png" alt="SJBIT" width="72" height="72" />
        <MaskLines as="h2" lines={["Ready to access", "SJBIT CampusOS?"]} />
        <Reveal delay={0.3}><p>Sign in to your student or faculty portal, or open the campus-wide administrator control board.</p></Reveal>
        <Reveal delay={0.45} className="cta-row">
          <a href="/login" className="btn btn-primary btn-lg">Sign In to Portal <ArrowRight size={18} className="nudge" /></a>
          <a href="/login?role=admin" className="btn btn-ghost btn-lg"><ShieldCheck size={18} /> Administrator Section</a>
          <a href="/register" className="btn btn-ghost btn-lg">Student Registration</a>
        </Reveal>
      </div>
    </section>
  );
}
