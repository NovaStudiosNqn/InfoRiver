import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  obtenerPartidosRiver,
  obtenerProximoPartido,
  obtenerUltimoResultado,
  obtenerPartidoEnVivo,
} from "../scripts/partidos";
import PartidoCard from "../componentes/PartidoCard";
import TituloSeccion from "../componentes/TituloSeccion";
import "./partidos.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loading from "../componentes/loading";

gsap.registerPlugin(ScrollTrigger);

export default function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
	obtenerPartidosRiver(2026)
	  .then(setPartidos)
	  .catch((e) => setError(e.message))
	  .finally(() => setCargando(false));
  }, []);

  useLayoutEffect(() => {
	if (cargando || error || partidos.length === 0) return;
	const ctx = gsap.context(() => {
	  gsap.from(".partido-card", {
		scrollTrigger: {
		  trigger: rootRef.current,
		  start: "top 85%",
		  toggleActions: "play none none none",
		},
		opacity: 0,
		y: 24,
		duration: 0.5,
		stagger: 0.08,
		ease: "power2.out",
	  });
	}, rootRef);
	return () => ctx.revert();
  }, [cargando, error, partidos]);

  if (cargando)
	return (
	  <section id="partidos" className="partidos">
		<Loading />
	  </section>
	);

  const enVivo = obtenerPartidoEnVivo(partidos);
  const proximo = obtenerProximoPartido(partidos);
  const ultimo = obtenerUltimoResultado(partidos);

  const margen = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const proximos = partidos
	.filter((p) => p.estado === "programado" && new Date(p.fecha) >= margen)
	.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
	.slice(0, 5);

  const resultados = partidos
	.filter((p) => p.estado === "finalizado")
	.slice(-5)
	.reverse();

  return (
	<section id="partidos" className="partidos" ref={rootRef}>
      <TituloSeccion>Partidos del millonario</TituloSeccion>

	  {enVivo && (
		<div className="en-vivo-box">
		  <h3>En vivo ahora</h3>
		  <PartidoCard partido={enVivo} destacado />
		</div>
	  )}

	  <div className="destacados">
		<div>
		  <h3>Próximo partido</h3>
		  {proximo ? (
			<PartidoCard partido={proximo} destacado />
		  ) : (
			<p>No hay próximos programados.</p>
		  )}
		</div>
		<div>
		  <h3>Último resultado</h3>
		  {ultimo ? <PartidoCard partido={ultimo} /> : <p>Sin resultados.</p>}
		</div>
	  </div>

	  <div className="listas">
		<div>
		  <h3>Agenda</h3>
		  {proximos.map((p) => (
			<PartidoCard key={p.id} partido={p} />
		  ))}
		</div>
		<div>
		  <h3>Resultados</h3>
		  {resultados.map((p) => (
			<PartidoCard key={p.id} partido={p} />
		  ))}
		</div>
	  </div>
	</section>
  );
}
