import "./hero.css";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".bandaroja",
          {
            xPercent: -120,
            opacity: 0,
            scaleX: 0.6,
            transformOrigin: "left center",
          },
          { xPercent: 0, opacity: 1, scaleX: 1, duration: 1.2 },
        )
        .fromTo(
          ".bandaroja",
          { filter: "brightness(1.8)" },
          { filter: "brightness(1)", duration: 0.6, ease: "power2.out" },
          "<+=0.3",
        );

      gsap.to(".bandaroja", {
        y: 5,
        rotation: "+=1",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      gsap.fromTo(
        ".bandaroja-brillo",
        { xPercent: -250 },
        {
          xPercent: 250,
          duration: 3.8,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 0.9,
          delay: 2.3,
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="portada" ref={rootRef}>
      <div className="bandaroja" aria-hidden="true">
        <span className="bandaroja-brillo" aria-hidden="true" />
      </div>
    </section>
  );
}
