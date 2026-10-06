import "./navbar.css";
import logo from "../static/inforiver.png";
import { useLayoutEffect, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("portada");
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".navbar",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }
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
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="navbar">
      <img src={logo} alt="InfoRiver logo" className="navbar-logo" />
      <div className="navbar-brand">
        <span className="navbar-title">InfoRiver96</span>
        <span className="navbar-subtitle">Diario del hincha millonario</span>
      </div>
      <nav className="navbar-links">
        <a
          href="#portada"
          className={activeLink === "portada" ? "active" : ""}
          onClick={() => setActiveLink("portada")}
        >
          Portada
        </a>
        <a
          href="#noticias"
          className={activeLink === "noticias" ? "active" : ""}
          onClick={() => setActiveLink("noticias")}
        >
          Noticias
        </a>
        <a
          href="#partidos"
          className={activeLink === "partidos" ? "active" : ""}
          onClick={() => setActiveLink("partidos")}
        >
          Partidos
        </a>
        <a
          href="#plantel"
          className={activeLink === "plantel" ? "active" : ""}
          onClick={() => setActiveLink("plantel")}
        >
          Plantel
        </a>
        <a
          href="#contacto"
          className={activeLink === "contacto" ? "active" : ""}
          onClick={() => setActiveLink("contacto")}
        >
          Contacto
        </a>
      </nav>
    </header>
  );
}
