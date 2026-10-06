import "./navbar.css";
import logo from "../static/inforiver.png";
import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";

const LINKS = [
  { id: "portada", label: "Portada" },
  { id: "noticias", label: "Noticias" },
  { id: "partidos", label: "Partidos" },
  { id: "plantel", label: "Plantel" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("portada");
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".navbar",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      );
      gsap.utils.toArray(".navbar-links a").forEach((link, i) => {
        gsap.fromTo(
          link,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            delay: 0.2 + i * 0.1,
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    if (sections.length === 0) return;

    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) setActiveLink(hash);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e, id) => {
    if (!document.getElementById(id)) e.preventDefault();
    else setActiveLink(id);
  };

  return (
    <header className="navbar">
      <img src={logo} alt="InfoRiver logo" className="navbar-logo" />
      <div className="navbar-brand">
        <span className="navbar-title">InfoRiver96</span>
        <span className="navbar-subtitle">Diario del hincha millonario</span>
      </div>
      <nav className="navbar-links">
        {LINKS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeLink === id ? "active" : ""}
            onClick={(e) => handleClick(e, id)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
