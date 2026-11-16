// npm i framer-motion lenis lucide-react
import { useEffect, useRef, useState } from "react";
import {
  motion, useInView, useMotionValue, useSpring, useScroll, useReducedMotion, animate,
} from "framer-motion";
import Lenis from "lenis";

export const EASE = [0.22, 1, 0.36, 1];

/* Smooth inertial scrolling */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  return null;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

export const FilmGrain = () => <div className="grain" aria-hidden="true" />;

/* Fade + rise on scroll. Pass delay={i * 0.08} for stagger. */
export function Reveal({ children, delay = 0, y = 40, as = "div", className = "" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/* Line-by-line mask reveal for headings: <MaskLines lines={["Run SJBIT Campus"]} /> */
export function MaskLines({ lines, className = "", delay = 0, as = "h2" }) {
  const reduce = useReducedMotion();
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduce ? false : { y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Cursor spotlight + gentle 3D tilt */
export function SpotlightCard({ children, className = "", tilt = 6, as = "div", ...rest }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const Tag = motion[as];

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ref.current.style.setProperty("--mx", `${x}px`);
    ref.current.style.setProperty("--my", `${y}px`);
    if (tilt) {
      ry.set((x / r.width - 0.5) * tilt * 2);
      rx.set(-(y / r.height - 0.5) * tilt * 2);
    }
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <Tag
      ref={ref}
      className={`spot-card ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Infinite marquee with edge-fade mask */
export function Marquee({ children, speed = 40 }) {
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {children}
        <span aria-hidden="true" style={{ display: "contents" }}>{children}</span>
      </div>
    </div>
  );
}

/* Count-up when scrolled into view */
export function CountUp({ to, prefix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  return <span ref={ref}>{prefix}{val}</span>;
}

/* Magnetic button */
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x, y, display: "inline-block" }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.div>
  );
}
