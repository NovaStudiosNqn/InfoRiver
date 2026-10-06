import "./Equipo.css";

export default function Equipo({ equipo, goles }) {
  return (
    <div className="equipo">
      {equipo.escudo && <img src={equipo.escudo} alt={equipo.nombre} />}
      <span>{equipo.corto ?? equipo.nombre}</span>
      {goles !== null && goles !== undefined && <strong>{goles}</strong>}
    </div>
  );
}
