import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { EASE, Marquee, CountUp, Magnetic } from "./cinematic";

const LOGOS = [
  "/recognitions/naac.png",
  "/recognitions/nba.png",
  "/recognitions/vtu.png",
  "/recognitions/aicte.png",
  "/recognitions/nirf.png",
  "/recognitions/iic.png",
  "/recognitions/qs-iguage.png",
];
const RANKS = [["CET", "E", 115], ["COMED-K", "E", 107], ["MBA", "B", 288], ["M.Tech", "T", 871], ["MCA", "C", 547]];

const up = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export default function Hero({ background = null }) {
  const reduce = useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const bgX = useTransform(mx, (v) => v * 12);
  const bgY = useTransform(my, (v) => v * 12);
  const ref = useRef(null);

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero" ref={ref} onMouseMove={onMove}>
      <motion.div className="hero-bg" style={{ x: bgX, y: bgY }}>
        {background}
      </motion.div>
      <div className="hero-overlay" />
      <div className="hero-bloom" />

      <div className="hero-inner">
        <motion.div className="trust glass" {...up(0.1)}>
          <img src="/sjbit-emblem.png" alt="SJBIT" width="52" height="52" className="rounded-full" />
          <div>
            <small>Sri Adichunchanagiri Shikshana Trust</small>
            <strong>SJB Institute of Technology</strong>
            <span>Autonomous under VTU · NAAC A+ · NBA Accredited</span>
          </div>
        </motion.div>

        <h1>
          <span className="mask-line">
            <motion.span style={{ display: "inline-block" }} initial={{ y: "110%" }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>Run SJBIT Campus</motion.span>
          </span>
          <span className="mask-line">
            <motion.span className="sweep" style={{ display: "inline-block" }} initial={{ y: "110%" }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}>Smarter, Faster.</motion.span>
          </span>
        </h1>

        <motion.p className="lede" {...up(0.9)}>
          Campus tech fests, student clubs, branch academic tracking, and fast repair
          resolution across all 9 SJBIT engineering and management branches.
        </motion.p>

        <motion.div className="cta-row" {...up(1.1)}>
          <Magnetic>
            <a href="/login" className="btn btn-primary btn-lg">Sign In to Portal <ArrowRight size={18} className="nudge" /></a>
          </Magnetic>
          <a href="/login?role=admin" className="btn btn-ghost btn-lg"><ShieldCheck size={18} /> Administrator Portal</a>
          <a href="/register" className="btn btn-ghost btn-lg">Student Registration</a>
        </motion.div>

        <motion.div className="accred glass" {...up(1.3)}>
          <Marquee speed={36}>
            {LOGOS.map((src) => <img key={src} src={src} alt="" className="accred-logo" height="34" />)}
          </Marquee>
          <ul className="ranks">
            {RANKS.map(([k, pre, v]) => (
              <li key={k}>{k} <b><CountUp to={v} prefix={pre} /></b></li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="scroll-hint" aria-hidden="true"><i /></div>
    </section>
  );
}
