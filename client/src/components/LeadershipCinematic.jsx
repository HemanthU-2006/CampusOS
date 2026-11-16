import { useState } from "react";
import { Reveal, MaskLines } from "./cinematic";

// Fill in `title` with the full designation from your site.
const DEFAULT_LEADERS = [
  {
    name: "Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji",
    role: "Founder President",
    title: "23rd Pontiff of Sri Adichunchanagiri Mahasamsthana Math · Founder, Sri Adichunchanagiri Shikshana Trust",
    img: "/people/founder.jpg",
  },
  {
    name: "Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji",
    role: "President",
    title: "Pontiff & President, Sri Adichunchanagiri Shikshana Trust",
    img: "/people/president.jpg",
  },
  {
    name: "Sri Sri Dr. Prakashanatha Swamiji",
    role: "Managing Director",
    title: "Managing Director, BGS & SJB Group of Institutions and Hospitals",
    img: "/people/md.jpg",
  },
  {
    name: "Dr. K. V. Mahendra Prashanth",
    role: "Principal",
    title: "Principal & Chief Academic Officer, SJB Institute of Technology",
    img: "/people/principal.jpg",
  },
];

export default function LeadershipCinematic({ leaders = DEFAULT_LEADERS }) {
  const [active, setActive] = useState(0);

  return (
    <section className="lead" id="about">
      <div className="lead-head">
        <Reveal><span className="eyebrow">Institutional heritage</span></Reveal>
        <MaskLines lines={["Exceptional Leadership", "& Vision"]} delay={0.1} />
        <Reveal delay={0.3}>
          <p>
            Established under the aegis of Sri Adichunchanagiri Shikshana Trust, SJBIT has grown into one of Karnataka's premier autonomous institutions.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="lead-stage">
          {leaders.map((p, i) => (
            <article
              key={p.name}
              tabIndex={0}
              aria-label={`${p.name}, ${p.role}`}
              className={`lead-panel ${active === i ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <img src={p.img} alt={p.name} loading="lazy" />
              <span className="lead-shade" />
              <span className="lead-vrole">{p.role}</span>
              <div className="lead-copy">
                <small><i /> {p.role}</small>
                <h3>{p.name}</h3>
                {p.title && <p>{p.title}</p>}
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
