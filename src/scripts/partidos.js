const RIVER_ID = "16";

const COMPETENCIAS = {
  LIGA: "arg.1",
  COPA_ARGENTINA: "arg.copa",
  LIBERTADORES: "conmebol.libertadores",
  SUDAMERICANA: "conmebol.sudamericana",
};

const LIGAS_DEFAULT = [
  COMPETENCIAS.LIGA,
  COMPETENCIAS.COPA_ARGENTINA,
  COMPETENCIAS.LIBERTADORES,
  COMPETENCIAS.SUDAMERICANA,
];

const API = "https://site.api.espn.com/apis/site/v2/sports/soccer";

function obtenerEscudo(team) {
  if (!team) return "";
  if (team.logos?.[0]?.href) return team.logos[0].href;
  if (typeof team.logo === "string") return team.logo;
  if (team.id)
    return `https://a.espncdn.com/i/teamlogos/soccer/500/${team.id}.png`;
  return "";
}

function obtenerGoles(competitor) {
  const s = competitor?.score;
  if (s == null) return null;
  if (typeof s === "object") {
    const v = Number(s.value ?? s.displayValue);
    return Number.isNaN(v) ? null : v;
  }
  const v = Number(s);
  return Number.isNaN(v) ? null : v;
}

function normalizarPartido(event, ligaSlug = "") {
  const comp = event?.competitions?.[0];
  if (!comp) return null;

  const [c1, c2] = comp.competitors ?? [];
  const local = (c1?.homeAway === "home" ? c1 : c2) ?? c1;
  const visita = local === c1 ? c2 : c1;

  const state = comp.status?.type?.state;
  const estado =
    state === "in" ? "en_vivo" : state === "post" ? "finalizado" : "programado";

  const golesLocal = obtenerGoles(local);
  const golesVisita = obtenerGoles(visita);
  const esLocalRiver = local?.team?.id === RIVER_ID;

  const golesRiver = esLocalRiver ? golesLocal : golesVisita;
  const golesRival = esLocalRiver ? golesVisita : golesLocal;
  let resultadoRiver = "pendiente";
  if (estado === "finalizado" && golesRiver !== null && golesRival !== null) {
    if (golesRiver > golesRival) resultadoRiver = "ganado";
    else if (golesRiver === golesRival) resultadoRiver = "empatado";
    else resultadoRiver = "perdido";
  }

  return {
    id: event.id,
    fecha: event.date,
    torneo:
      event.seasonType?.name ??
      event.season?.displayName ??
      event.season?.slug ??
      ligaSlug,
    liga: ligaSlug,
    local: {
      id: local?.team?.id,
      nombre: local?.team?.displayName,
      corto: local?.team?.abbreviation,
      escudo: obtenerEscudo(local?.team),
    },
    visita: {
      id: visita?.team?.id,
      nombre: visita?.team?.displayName,
      corto: visita?.team?.abbreviation,
      escudo: obtenerEscudo(visita?.team),
    },
    golesLocal: estado === "programado" ? null : golesLocal,
    golesVisita: estado === "programado" ? null : golesVisita,
    estado,
    minuto: comp.status?.displayClock ?? null,
    detalle: comp.status?.type?.shortDetail ?? "",
    estadio: comp.venue?.fullName ?? "",
    esLocalRiver,
    resultadoRiver,
  };
}

async function obtenerPartidosPorLiga(liga = COMPETENCIAS.LIGA, season = 2026) {
  const url = `${API}/${liga}/teams/${RIVER_ID}/schedule?season=${season}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN ${res.status} en ${liga}`);
  const data = await res.json();

  return (data.events ?? [])
    .map((e) => normalizarPartido(e, liga))
    .filter(Boolean);
}

async function obtenerPartidosScoreboard(liga, fechaYYYYMMDD) {
  const url = `${API}/${liga}/scoreboard?dates=${fechaYYYYMMDD}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`ESPN ${res.status} scoreboard ${liga} ${fechaYYYYMMDD}`);
  const data = await res.json();

  return (data.events ?? [])
    .filter((e) =>
      e.competitions?.[0]?.competitors?.some((c) => c.team?.id === RIVER_ID),
    )
    .map((e) => normalizarPartido(e, liga))
    .filter(Boolean);
}

function aYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function obtenerAgendaRiver(liga = COMPETENCIAS.LIGA, diasFuturo = 35) {
  const hoy = new Date();
  const fechas = [];
  for (let i = 0; i <= diasFuturo; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    fechas.push(aYYYYMMDD(d));
  }
  const resultados = await Promise.allSettled(
    fechas.map((f) => obtenerPartidosScoreboard(liga, f)),
  );
  return resultados
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);
}

export async function obtenerPartidosRiver(
  season = 2026,
  ligas = LIGAS_DEFAULT,
) {
  const historial = await Promise.allSettled(
    ligas.map((liga) => obtenerPartidosPorLiga(liga, season)),
  );

  const agenda = await Promise.allSettled([
    obtenerAgendaRiver(COMPETENCIAS.LIGA, 40),
    obtenerAgendaRiver(COMPETENCIAS.COPA_ARGENTINA, 40),
  ]);

  const todos = [
    ...historial
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value),
    ...agenda.filter((r) => r.status === "fulfilled").flatMap((r) => r.value),
  ];

  const unicos = [...new Map(todos.map((p) => [p.id, p])).values()];

  return unicos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

const NOMBRES_LIGA = {
  "arg.1": "Liga Profesional",
  "arg.copa": "Copa Argentina",
  "conmebol.libertadores": "Copa Libertadores",
  "conmebol.sudamericana": "Copa Sudamericana",
};

export function etiquetaTorneo(partido) {
  const base = NOMBRES_LIGA[partido.liga] ?? partido.liga ?? "";
  const t = partido.torneo ?? "";
  const esApertura = /apertura/i.test(t);
  const esClausura = /clausura/i.test(t);
  const esPlayoff = /final|semifinal|quarter|round of 16|playoff/i.test(t);
  if (esApertura && !esClausura) {
    return esPlayoff ? `${base} · Playoffs` : `${base} · Apertura`;
  }
  if (esClausura) return `${base} · Clausura`;
  return base || t;
}

export function obtenerProximoPartido(partidos, desde = new Date()) {
  const margen = new Date(desde.getTime() - 3 * 60 * 60 * 1000);
  return (
    partidos
      .filter((p) => p.estado === "programado" && new Date(p.fecha) >= margen)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0] ?? null
  );
}

export function obtenerUltimoResultado(partidos) {
  const terminados = partidos.filter((p) => p.estado === "finalizado");
  return terminados[terminados.length - 1] ?? null;
}

export function obtenerPartidoEnVivo(partidos) {
  return partidos.find((p) => p.estado === "en_vivo") ?? null;
}
