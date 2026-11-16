import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck, Menu, X } from "lucide-react";

const NAV = [
  { label: "About Us", href: "#about", menu: true },
  { label: "Branches", href: "#departments", menu: true },
  { label: "Admissions", href: "#admissions", menu: true },
  { label: "Placements", href: "#placements", menu: true },
  { label: "Campus", href: "#life", menu: true },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="topstrip">
        <span className="gold">Jai Sri Gurudev</span>
        <span className="topstrip-mid">Sri Adichunchanagiri Shikshana Trust</span>
        <nav className="topstrip-links" aria-label="Utility">
          <a href="https://turiya.co/360/SJBIT/" target="_blank" rel="noopener noreferrer">360° Tour</a>
          <a href="https://www.sjbit.edu.in/nirf.php" target="_blank" rel="noopener noreferrer">NIRF</a>
          <a href="https://www.sjbit.edu.in/alumni.php" target="_blank" rel="noopener noreferrer">Alumni</a>
          <span className="chip">NAAC A+</span>
          <span className="chip">CET E115</span>
          <span className="chip">COMED-K E107</span>
        </nav>
      </div>

      <div className="navbar glass">
        <a href="/" className="brand">
          <img src="/sjbit-emblem.png" alt="SJBIT" width="44" height="44" className="rounded-full" />
          <span>
            <b>SJBIT <em>CampusOS</em></b>
            <small>SJB Institute of Technology, Bengaluru</small>
          </span>
          <span className="pill">Autonomous</span>
        </a>

        <nav className={`links ${open ? "open" : ""}`} aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="link">
              {n.label}
              {n.menu && <ChevronDown size={12} />}
            </a>
          ))}
          <a href="/faculty/ise" className="link badge-link">ISE Faculty <span className="count">41</span></a>
        </nav>

        <div className="actions">
          <a href="/login?role=admin" className="btn btn-ghost hide-md"><ShieldCheck size={16} /> Admin Portal</a>
          <a href="/login" className="btn btn-ghost">Sign In</a>
          <a href="/register" className="btn btn-primary">Register</a>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
