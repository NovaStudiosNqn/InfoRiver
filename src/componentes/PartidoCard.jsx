import Equipo from "./Equipo";
import { formatearFecha } from "../scripts/fecha";
import { etiquetaTorneo } from "../scripts/partidos";
import "./PartidoCard.css";
import { FaHome, FaPlane } from "react-icons/fa";

export function IconEsLocal({ esLocal }) {
  return esLocal ? (
    <FaHome className="icono-local" title="Local en el Monumental" />
  ) : (
    <FaPlane className="icono-visitante" title="Visitante" />
  );
}

export default function PartidoCard({ partido, destacado = false }) {
  const textoEstado =
    partido.estado === "en_vivo"
      ? `EN VIVO ${partido.minuto ?? ""}`
      : partido.estado === "finalizado"
        ? partido.detalle || "Final"
        : "Programado";
  const resultadoClass =
    partido.estado !== "finalizado"
      ? ""
      : partido.resultadoRiver === "ganado"
        ? "gano-river"
        : partido.resultadoRiver === "empatado"
          ? "empato-river"
          : "perdio-river";

  return (
    <article
      className={`partido-card ${partido.estado} ${destacado ? "destacado" : ""} ${resultadoClass}`}
    >
      <header>
        <span className="torneo">{etiquetaTorneo(partido)}</span>
        <span className={`estado ${partido.estado}`}>
          <IconEsLocal esLocal={partido.esLocalRiver} />
          <span>{textoEstado}</span>
        </span>
      </header>

      <div className="marcador">
        <Equipo equipo={partido.local} goles={partido.golesLocal} />
        <span className="vs">vs</span>
        <Equipo equipo={partido.visita} goles={partido.golesVisita} />
      </div>

      <footer>
        <span>{formatearFecha(partido.fecha)}</span>
        {partido.estadio && <span> · {partido.estadio}</span>}
      </footer>
    </article>
  );
}
