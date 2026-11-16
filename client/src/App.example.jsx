import "./cinematic.css";
import { SmoothScroll, ScrollProgress, FilmGrain } from "./components/cinematic";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { Leadership, Departments, Infrastructure, FinalCTA } from "./components/Sections";
import { SJBIT_BRANCHES } from "./features/departments/data/branchesData";

const DEPARTMENTS = SJBIT_BRANCHES.map((b) => ({
  code: b.code,
  name: b.name,
  hod: b.hod,
  location: b.block,
  faculty: b.facultyCount,
}));

export default function App() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <FilmGrain />
      <Header />
      <main>
        {/* Pass YOUR existing background video/element here, unchanged */}
        <Hero
          background={
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/frames/desk/f_0001.webp"
              className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105"
            >
              <source src="/media/clip.mp4" type="video/mp4" />
            </video>
          }
        />
        <Leadership />
        <Departments departments={DEPARTMENTS} />
        <Infrastructure />
        <FinalCTA />
      </main>
    </>
  );
}
