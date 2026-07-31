import React, { useState, useEffect, useRef } from "react";

/* ============================== DATOS ============================== */

const POSICIONES = {
  ofensiva: ["QB", "RB", "FB", "WR", "TE", "LT", "LG", "C", "RG", "RT"],
  defensiva: ["DE", "DT", "NT", "MLB", "OLB", "ILB", "CB", "FS", "SS"],
};

const OL_POS = ["LT", "LG", "C", "RG", "RT"];
const DL_POS = ["DE", "DT", "NT"];

const NOMBRES_POSICION = {
  QB: "Quarterback", RB: "Running Back", FB: "Fullback", WR: "Wide Receiver", TE: "Tight End",
  LT: "Tackle Izquierdo", LG: "Guardia Izquierdo", C: "Centro", RG: "Guardia Derecho", RT: "Tackle Derecho",
  DE: "Extremo Defensivo", DT: "Tackle Defensivo", NT: "Nose Tackle",
  MLB: "Linebacker Central", OLB: "Linebacker Externo", ILB: "Linebacker Interno",
  CB: "Cornerback", FS: "Safety Libre", SS: "Safety Fuerte",
};

const POSITION_COLORS = {
  QB: "#F2B84B", RB: "#E2894F", FB: "#C96A4E", WR: "#F4D35E", TE: "#D9A441",
  LT: "#B08B57", LG: "#9C7A4A", C: "#8F8259", RG: "#7C6A45", RT: "#6E5B3A",
  DE: "#4C8C7B", DT: "#3E7099", NT: "#5A7A9E", MLB: "#7A5CA6", OLB: "#9457A6",
  ILB: "#6C63A6", CB: "#4778B8", FS: "#3A6FA0", SS: "#5586C2",
};

const THEME = {
  bg: "#0A0D0C",
  surface: "#141917",
  surface2: "#1B211D",
  border: "rgba(237,239,234,0.08)",
  text: "#EDEFEA",
  textDim: "#8B978F",
  offense: "#E8AC3E",
  defense: "#4F7FB0",
  danger: "#C0564A",
  win: "#5C9E72",
  tie: "#8B978F",
  bloqueo: "#C9A227",
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const posASide = (pos) => (POSICIONES.ofensiva.includes(pos) ? "ofensiva" : "defensiva");

const FIELD_W = 300;
const FIELD_H = 460;
const LOS_Y = 380;

/* Formaciones por defecto (coordenadas dentro del campo 300x460) */
const OL_X = [90, 122, 150, 178, 210];
const OFFENSE_FORMATIONS = [
  {
    nombre: "Shotgun 3WR",
    tokens: [
      { pos: "LT", x: OL_X[0], y: 374 }, { pos: "LG", x: OL_X[1], y: 374 }, { pos: "C", x: OL_X[2], y: 374 },
      { pos: "RG", x: OL_X[3], y: 374 }, { pos: "RT", x: OL_X[4], y: 374 },
      { pos: "TE", x: 236, y: 376 }, { pos: "WR", x: 18, y: 378 }, { pos: "WR", x: 282, y: 378 },
      { pos: "WR", x: 256, y: 396 }, { pos: "QB", x: 150, y: 412 }, { pos: "RB", x: 120, y: 416 },
    ],
  },
  {
    nombre: "I-Formation",
    tokens: [
      { pos: "LT", x: OL_X[0], y: 374 }, { pos: "LG", x: OL_X[1], y: 374 }, { pos: "C", x: OL_X[2], y: 374 },
      { pos: "RG", x: OL_X[3], y: 374 }, { pos: "RT", x: OL_X[4], y: 374 },
      { pos: "TE", x: 236, y: 376 }, { pos: "WR", x: 18, y: 378 }, { pos: "WR", x: 282, y: 378 },
      { pos: "QB", x: 150, y: 390 }, { pos: "FB", x: 150, y: 412 }, { pos: "RB", x: 150, y: 436 },
    ],
  },
  {
    nombre: "Singleback",
    tokens: [
      { pos: "LT", x: OL_X[0], y: 374 }, { pos: "LG", x: OL_X[1], y: 374 }, { pos: "C", x: OL_X[2], y: 374 },
      { pos: "RG", x: OL_X[3], y: 374 }, { pos: "RT", x: OL_X[4], y: 374 },
      { pos: "TE", x: 236, y: 376 }, { pos: "WR", x: 18, y: 378 }, { pos: "WR", x: 282, y: 378 },
      { pos: "WR", x: 256, y: 398 }, { pos: "QB", x: 150, y: 390 }, { pos: "RB", x: 150, y: 422 },
    ],
  },
  {
    nombre: "Pistol 2TE",
    tokens: [
      { pos: "LT", x: OL_X[0], y: 374 }, { pos: "LG", x: OL_X[1], y: 374 }, { pos: "C", x: OL_X[2], y: 374 },
      { pos: "RG", x: OL_X[3], y: 374 }, { pos: "RT", x: OL_X[4], y: 374 },
      { pos: "TE", x: 236, y: 376 }, { pos: "TE", x: 64, y: 376 }, { pos: "WR", x: 18, y: 378 },
      { pos: "WR", x: 282, y: 378 }, { pos: "QB", x: 150, y: 400 }, { pos: "RB", x: 150, y: 424 },
    ],
  },
];

const DEFENSE_FORMATIONS = [
  {
    nombre: "4-3",
    tokens: [
      { pos: "DE", x: 92, y: 384 }, { pos: "DT", x: 132, y: 386 }, { pos: "DT", x: 168, y: 386 }, { pos: "DE", x: 208, y: 384 },
      { pos: "OLB", x: 68, y: 340 }, { pos: "MLB", x: 150, y: 334 }, { pos: "OLB", x: 232, y: 340 },
      { pos: "CB", x: 18, y: 300 }, { pos: "CB", x: 282, y: 300 },
      { pos: "FS", x: 150, y: 276 }, { pos: "SS", x: 192, y: 298 },
    ],
  },
  {
    nombre: "3-4",
    tokens: [
      { pos: "DE", x: 102, y: 384 }, { pos: "NT", x: 150, y: 388 }, { pos: "DE", x: 198, y: 384 },
      { pos: "OLB", x: 58, y: 344 }, { pos: "ILB", x: 120, y: 334 }, { pos: "ILB", x: 180, y: 334 }, { pos: "OLB", x: 242, y: 344 },
      { pos: "CB", x: 18, y: 300 }, { pos: "CB", x: 282, y: 300 },
      { pos: "FS", x: 150, y: 274 }, { pos: "SS", x: 192, y: 296 },
    ],
  },
  {
    nombre: "Nickel 4-2-5",
    tokens: [
      { pos: "DE", x: 92, y: 384 }, { pos: "DT", x: 132, y: 386 }, { pos: "DT", x: 168, y: 386 }, { pos: "DE", x: 208, y: 384 },
      { pos: "MLB", x: 122, y: 340 }, { pos: "OLB", x: 182, y: 340 },
      { pos: "CB", x: 18, y: 305 }, { pos: "CB", x: 282, y: 305 }, { pos: "CB", x: 150, y: 316 },
      { pos: "FS", x: 150, y: 270 }, { pos: "SS", x: 194, y: 292 },
    ],
  },
];

/* ============================== UTILIDADES ============================== */

const TIPOS_IMAGEN_VALIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];

function resizeImagen(file, maxSize = 180, calidad = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      reject(new Error("El archivo elegido no es una imagen."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", calidad));
      };
      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-").map(Number);
  if (!y || !m || !d) return fechaStr;
  const dt = new Date(y, m - 1, d);
  const txt = dt.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function formatearHora(horaStr) {
  if (!horaStr) return "";
  const [h, min] = horaStr.split(":").map(Number);
  if (Number.isNaN(h)) return horaStr;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

/* Calcula la tabla de posiciones a partir del calendario. Los juegos BYE no cuentan. */
function calcularTablaLiga(partidosLiga, equipoPropio) {
  const stats = {};
  const asegurar = (nombre) => {
    if (!stats[nombre]) stats[nombre] = { id: nombre, nombre, g: 0, p: 0, e: 0, pf: 0, pc: 0 };
    return stats[nombre];
  };
  if (equipoPropio) asegurar(equipoPropio);
  partidosLiga.forEach((j) => {
    if (j.bye) return;
    asegurar(j.local);
    asegurar(j.visitante);
    if (j.marcadorLocal === null || j.marcadorLocal === undefined || j.marcadorVisitante === null || j.marcadorVisitante === undefined) return;
    const local = stats[j.local];
    const visit = stats[j.visitante];
    local.pf += j.marcadorLocal; local.pc += j.marcadorVisitante;
    visit.pf += j.marcadorVisitante; visit.pc += j.marcadorLocal;
    if (j.marcadorLocal > j.marcadorVisitante) { local.g += 1; visit.p += 1; }
    else if (j.marcadorLocal < j.marcadorVisitante) { local.p += 1; visit.g += 1; }
    else { local.e += 1; visit.e += 1; }
  });
  return Object.values(stats)
    .map((row) => ({ ...row, esPropio: row.nombre === equipoPropio }))
    .sort((a, b) => (b.g - a.g) || ((b.pf - b.pc) - (a.pf - a.pc)));
}

/* Determina qué tipo de asignación le corresponde a un jugador al iniciar un trazo */
function tipoAsignacionPara(token, lado, coberturaTipo) {
  if (lado === "ofensiva") {
    return OL_POS.includes(token.pos) ? "bloqueo" : "ruta";
  }
  return DL_POS.includes(token.pos) ? "trampa" : coberturaTipo;
}

const ZONA_RX = 44;
const ZONA_RY = 28;

/* Lee la geometría de una zona, soportando el formato viejo (rectángulo por esquinas) */
function geometriaZona(a) {
  if (a.zona) {
    const { x1, y1, x2, y2 } = a.zona;
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, rx: Math.max(Math.abs(x2 - x1) / 2, 20), ry: Math.max(Math.abs(y2 - y1) / 2, 14) };
  }
  return { cx: a.cx, cy: a.cy, rx: a.rx || ZONA_RX, ry: a.ry || ZONA_RY };
}

/* ============================== CAMPO SVG ============================== */

function Field({ tokens, asignaciones, side, mode = "ver", seleccion, rutaEnCurso, onFieldClick, onTokenClick, onRouteClick, onZonaArrastrar, mini = false, losY = LOS_Y }) {
  const svgRef = useRef(null);
  const accent = side === "ofensiva" ? THEME.offense : THEME.defense;
  const arrastreRef = useRef({ id: null, movio: false });
  const [zonaArrastrando, setZonaArrastrando] = useState(null);

  const toCoords = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * FIELD_W,
      y: ((e.clientY - rect.top) / rect.height) * FIELD_H,
    };
  };

  const yardLines = [];
  for (let y = 20; y < FIELD_H; y += 40) yardLines.push(y);

  const rutaEnCursoFrom = rutaEnCurso ? tokens.find((t) => t.id === rutaEnCurso.fromId) : null;

  const ESTILO_TIPO = {
    ruta: { stroke: "#EDEFEA", dash: null, marker: true, width: 2 },
    bloqueo: { stroke: THEME.bloqueo, dash: null, marker: true, width: 3.5 },
    trampa: { stroke: THEME.danger, dash: "3 3", marker: true, width: 2 },
    personal: { stroke: "#EDEFEA", dash: "2 3", marker: false, width: 2 },
  };

  const iniciarArrastreZona = (e, id) => {
    if (mode !== "rutas") return;
    e.stopPropagation();
    arrastreRef.current = { id, movio: false };
    setZonaArrastrando(id);
    try { e.target.setPointerCapture(e.pointerId); } catch (_) { /* no-op */ }
  };
  const manejarPointerMove = (e) => {
    if (!arrastreRef.current.id) return;
    arrastreRef.current.movio = true;
    const coords = toCoords(e);
    onZonaArrastrar && onZonaArrastrar(arrastreRef.current.id, coords.x, coords.y);
  };
  const finalizarArrastreZona = () => {
    arrastreRef.current = { id: null, movio: false };
    setZonaArrastrando(null);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
      className="w-full h-full select-none"
      style={{ background: "#0F2117", borderRadius: mini ? 8 : 12, touchAction: "manipulation" }}
      onClick={(e) => {
        if (mode === "ver") return;
        if (e.target.dataset.token || e.target.dataset.route) return;
        onFieldClick && onFieldClick(toCoords(e));
      }}
      onPointerMove={manejarPointerMove}
      onPointerUp={finalizarArrastreZona}
      onPointerLeave={finalizarArrastreZona}
      onPointerCancel={finalizarArrastreZona}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={0} y={(i * FIELD_H) / 12} width={FIELD_W} height={FIELD_H / 12}
          fill={i % 2 === 0 ? "#0F2117" : "#132A1D"} />
      ))}
      {yardLines.map((y) => (
        <line key={y} x1={0} y1={y} x2={FIELD_W} y2={y} stroke="#EDEFEA" strokeOpacity={0.16} strokeWidth={1} />
      ))}
      {!mini && yardLines.map((y) => (
        <g key={"h" + y}>
          <line x1={100} y1={y} x2={109} y2={y} stroke="#EDEFEA" strokeOpacity={0.3} strokeWidth={2} />
          <line x1={191} y1={y} x2={200} y2={y} stroke="#EDEFEA" strokeOpacity={0.3} strokeWidth={2} />
        </g>
      ))}
      <line x1={0} y1={losY} x2={FIELD_W} y2={losY} stroke={accent} strokeOpacity={0.9} strokeWidth={2.5} />

      <defs>
        <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#EDEFEA" />
        </marker>
      </defs>

      {asignaciones.map((a) => {
        if (a.tipo === "zona") {
          const { cx, cy, rx, ry } = geometriaZona(a);
          const from = tokens.find((t) => t.id === a.fromId);
          const colorZona = from && from.pos ? POSITION_COLORS[from.pos] : accent;
          const activa = zonaArrastrando === a.id;
          return (
            <g key={a.id}>
              {from && (
                <line x1={from.x} y1={from.y} x2={cx} y2={cy} stroke={colorZona} strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="3 2" />
              )}
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                fill={colorZona} fillOpacity={0.35} stroke={colorZona} strokeOpacity={activa ? 1 : 0.75}
                strokeWidth={activa ? 2.5 : 1.5} strokeDasharray={activa ? "4 3" : undefined}
                style={{ cursor: mode === "rutas" ? "grab" : "default" }}
                data-route="1"
                onPointerDown={(e) => iniciarArrastreZona(e, a.id)}
                onClick={(e) => { e.stopPropagation(); if (arrastreRef.current.movio) return; onRouteClick && onRouteClick(a.id); }} />
              {from && from.pos && !mini && (
                <text x={cx} y={cy + 3} fill="#0A0D0C" fontSize={9} fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace" style={{ pointerEvents: "none" }}>{from.pos}</text>
              )}
            </g>
          );
        }
        const from = tokens.find((t) => t.id === a.fromId);
        if (!from) return null;
        const pts = [{ x: from.x, y: from.y }, ...a.puntos];
        const d = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
        const est = ESTILO_TIPO[a.tipo] || ESTILO_TIPO.ruta;
        const last = pts[pts.length - 1];
        return (
          <g key={a.id}>
            <path d={d} fill="none" stroke="transparent" strokeWidth={16} data-route="1"
              onClick={(e) => { e.stopPropagation(); onRouteClick && onRouteClick(a.id); }} />
            <path d={d} fill="none" stroke={est.stroke} strokeWidth={est.width}
              strokeDasharray={est.dash || undefined} markerEnd={est.marker ? "url(#arrowhead)" : undefined} />
            {a.tipo === "personal" && !mini && (
              <>
                <circle cx={last.x} cy={last.y} r={7} fill={THEME.bg} stroke="#EDEFEA" strokeWidth={1} />
                <text x={last.x} y={last.y + 3} fill="#EDEFEA" fontSize={8} fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace">M</text>
              </>
            )}
          </g>
        );
      })}

      {rutaEnCursoFrom && rutaEnCurso.tipo !== "zona" && (() => {
        const pts = [{ x: rutaEnCursoFrom.x, y: rutaEnCursoFrom.y }, ...rutaEnCurso.puntos];
        const d = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
        return <path d={d} fill="none" stroke="#EDEFEA" strokeDasharray="4 3" strokeWidth={2} />;
      })()}

      {tokens.map((t) => {
        const color = t.pos ? POSITION_COLORS[t.pos] : accent;
        const seleccionado = seleccion === t.id || (rutaEnCurso && rutaEnCurso.fromId === t.id);
        return (
          <g key={t.id} data-token="1" style={{ cursor: mode === "ver" ? "default" : "pointer" }}
            onClick={(e) => { if (mode === "ver") return; e.stopPropagation(); onTokenClick && onTokenClick(t); }}>
            {seleccionado && <circle cx={t.x} cy={t.y} r={mini ? 8 : 15} fill="none" stroke="#EDEFEA" strokeWidth={1.5} strokeDasharray="2 2" />}
            <circle cx={t.x} cy={t.y} r={mini ? 6 : 11} fill={color} stroke="#0A0D0C" strokeWidth={1} />
            {!mini && (
              <text x={t.x} y={t.y + 3} fill="#0A0D0C" fontSize={t.pos ? 7 : 9.5} fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                {t.pos || t.numero}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [cargado, setCargado] = useState(false);
  const [sesion, setSesion] = useState(null); // null | {tipo:'creador', ligaId} | {tipo:'equipo', ligaId, equipoId} | {tipo:'visitante', ligaId}
  const [ligaId, setLigaId] = useState(null);
  const [ligaNombre, setLigaNombre] = useState("");
  const [pinCreador, setPinCreador] = useState("");
  const [equipos, setEquipos] = useState([]); // [{id, nombre, lugar, foto, pin}] — compartido, de la liga activa
  const [jugadores, setJugadores] = useState([]);
  const [jugadas, setJugadas] = useState([]);
  const [partidosLiga, setPartidosLiga] = useState([]); // calendario único de la liga activa (compartido)
  const [tab, setTab] = useState("plantilla");
  const [errorFoto, setErrorFoto] = useState("");

  // Login
  const [pantallaLogin, setPantallaLogin] = useState("menu"); // 'menu' | 'elegirLiga' | 'crearLiga' | 'pinOrganizador' | 'pinEquipo'
  const [contextoLogin, setContextoLogin] = useState(null); // 'organizador' | 'equipo' | 'visitante'
  const [ligasIndice, setLigasIndice] = useState(null); // null = sin cargar aún, [] = cargado y vacío
  const [ligaElegida, setLigaElegida] = useState(null); // {id, nombre} elegida en el picker
  const [nombreLigaInput, setNombreLigaInput] = useState("");
  const [pinCreadorInput, setPinCreadorInput] = useState("");
  const [pinEquipoInput, setPinEquipoInput] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const miEquipo = sesion && sesion.tipo === "equipo" ? equipos.find((e) => e.id === sesion.equipoId) : null;
  const equipo = miEquipo ? miEquipo.nombre : (sesion && sesion.tipo === "creador" ? (ligaNombre || "Organizador") : "Visitante");
  const equipoFoto = miEquipo ? miEquipo.foto : null;
  const equipoLugar = miEquipo ? miEquipo.lugar : "";

  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [posicion, setPosicion] = useState("QB");
  const [fotoNueva, setFotoNueva] = useState(null);
  const inputFotoNueva = useRef(null);
  const inputFotoEquipo = useRef(null);
  const inputFotoModalJugador = useRef(null);
  const inputFotoModalEquipo = useRef(null);

  const [eligiendoFormacion, setEligiendoFormacion] = useState(null); // 'ofensiva' | 'defensiva' | null
  const [editando, setEditando] = useState(null);
  const [modo, setModo] = useState("colocar");
  const [coberturaTipo, setCoberturaTipo] = useState("personal"); // 'personal' | 'zona' (para no-linieros en defensiva)
  const [seleccion, setSeleccion] = useState(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [rutaEnCurso, setRutaEnCurso] = useState(null);
  const [nombreJugada, setNombreJugada] = useState("");
  const [viendoJugadaId, setViendoJugadaId] = useState(null);

  // Modal de jugador: { id, nombre, numero, posicion, foto, modo: 'ver' | 'editar' }
  const [jugadorModal, setJugadorModal] = useState(null);
  const [modalJugadorAbierto, setModalJugadorAbierto] = useState(false);

  // Calendario (único, para toda la liga)
  const [localCalendario, setLocalCalendario] = useState("");
  const [visitanteCalendario, setVisitanteCalendario] = useState("");
  const [jornadaPartido, setJornadaPartido] = useState("");
  const [fechaPartido, setFechaPartido] = useState("");
  const [horaPartido, setHoraPartido] = useState("");
  const [lugarPartido, setLugarPartido] = useState("");
  const [esBye, setEsBye] = useState(false);
  const [errorPartido, setErrorPartido] = useState("");
  const [modalPartidoAbierto, setModalPartidoAbierto] = useState(false);
  const [modalEditarPartido, setModalEditarPartido] = useState(null);
  const [errorEditarPartido, setErrorEditarPartido] = useState("");
  const [menuPartidoAbierto, setMenuPartidoAbierto] = useState(null);
  const [jornadasAbiertas, setJornadasAbiertas] = useState({});
  const toggleJornada = (j) => setJornadasAbiertas((prev) => ({ ...prev, [j]: !prev[j] }));
  const pulsacionLargaRef = useRef(null);
  const iniciarPulsacionLarga = (id) => {
    if (!sesion || sesion.tipo !== "creador") return;
    pulsacionLargaRef.current = setTimeout(() => setMenuPartidoAbierto(id), 2000);
  };
  const cancelarPulsacionLarga = () => {
    if (pulsacionLargaRef.current) clearTimeout(pulsacionLargaRef.current);
    pulsacionLargaRef.current = null;
  };

  // Liga: alta / edición de equipos (nombre + de dónde son)
  const [modalEquipo, setModalEquipo] = useState(null); // { modo:'nuevo'|'editar', esPropio, id, nombreViejo, nombre, lugar, foto, pin }
  const [menuEquiposAbierto, setMenuEquiposAbierto] = useState(false);

  // Carga inicial: solo la sesión personal. Si había sesión activa, recupera esa liga.
  useEffect(() => {
    (async () => {
      try {
        const resSesion = await window.storage.get("sesion", false).catch(() => null);
        if (resSesion?.value) {
          const s = JSON.parse(resSesion.value);
          if (s && s.tipo && s.ligaId) {
            await cargarLiga(s.ligaId);
            if (s.tipo === "equipo") {
              const resMio = await window.storage.get(`mi-equipo-datos-${s.ligaId}-${s.equipoId}`, true).catch(() => null);
              if (resMio?.value) {
                const mio = JSON.parse(resMio.value);
                setJugadores(mio.jugadores ?? []);
                setJugadas((mio.jugadas ?? []).map((j) => ({ ...j, asignaciones: j.asignaciones || j.rutas || [] })));
              }
            }
            setSesion(s);
            setTab(s.tipo === "equipo" ? "plantilla" : "calendario");
          }
        }
      } catch (e) { /* sin datos previos */ }
      finally { setCargado(true); }
    })();
  }, []);

  // Guardar los datos compartidos de la liga activa cada vez que cambian
  useEffect(() => {
    if (!cargado || !ligaId) return;
    (async () => {
      try {
        await window.storage.set(`liga-datos-${ligaId}`, JSON.stringify({ nombre: ligaNombre, pinCreador, equipos, partidosLiga }), true);
      } catch (e) { console.error("Error guardando liga", e); }
    })();
  }, [ligaId, ligaNombre, pinCreador, equipos, partidosLiga, cargado]);

  // Guardar mi plantilla/jugadas personales (solo si tengo sesión de equipo).
  // Se guarda como dato COMPARTIDO de la liga (bajo una llave única por equipo) para que
  // cualquiera que entre con el PIN de ese equipo, desde cualquier dispositivo, vea lo mismo.
  useEffect(() => {
    if (!cargado || !sesion || sesion.tipo !== "equipo") return;
    (async () => {
      try {
        await window.storage.set(`mi-equipo-datos-${sesion.ligaId}-${sesion.equipoId}`, JSON.stringify({ jugadores, jugadas }), true);
      } catch (e) { console.error("Error guardando mi equipo", e); }
    })();
  }, [jugadores, jugadas, cargado, sesion]);

  // Carga el índice compartido de ligas dadas de alta (id + nombre, liviano)
  const cargarIndiceLigas = async () => {
    try {
      const res = await window.storage.get("ligas-indice", true);
      const lista = res?.value ? JSON.parse(res.value) : [];
      setLigasIndice(lista);
      return lista;
    } catch (e) {
      console.error("Error cargando el índice de ligas", e);
      setLigasIndice([]);
      return [];
    }
  };

  // Carga los datos completos de una liga específica y los pone como liga activa
  const cargarLiga = async (id) => {
    const res = await window.storage.get(`liga-datos-${id}`, true).catch(() => null);
    if (res?.value) {
      const liga = JSON.parse(res.value);
      setLigaId(id);
      setLigaNombre(liga.nombre ?? "");
      setPinCreador(liga.pinCreador ?? "");
      setEquipos(liga.equipos ?? []);
      setPartidosLiga(liga.partidosLiga ?? []);
      return liga;
    }
    return null;
  };

  const generarPin = () => {
    let intento;
    do { intento = String(Math.floor(1000 + Math.random() * 9000)); }
    while (intento === pinCreador || equipos.some((e) => e.pin === intento));
    return intento;
  };

  const actualizarMiEquipo = (cambios) => {
    if (!sesion || sesion.tipo !== "equipo") return;
    setEquipos((eqs) => eqs.map((e) => (e.id === sesion.equipoId ? { ...e, ...cambios } : e)));
  };

  // ---- pasos de login ----
  const abrirElegirLiga = async (contexto) => {
    setErrorLogin("");
    setContextoLogin(contexto);
    setPantallaLogin("elegirLiga");
    await cargarIndiceLigas();
  };

  const elegirLigaExistente = async (liga) => {
    setErrorLogin("");
    setLigaElegida(liga);
    await cargarLiga(liga.id);
    if (contextoLogin === "visitante") {
      const s = { tipo: "visitante", ligaId: liga.id };
      setSesion(s);
      setTab("calendario");
      window.storage.set("sesion", JSON.stringify(s), false).catch(() => {});
    } else if (contextoLogin === "organizador") {
      setPantallaLogin("pinOrganizador");
    } else if (contextoLogin === "equipo") {
      setPantallaLogin("pinEquipo");
    }
  };

  const irACrearLiga = () => {
    setErrorLogin("");
    setContextoLogin("organizador");
    setPantallaLogin("crearLiga");
  };

  const crearLiga = async () => {
    setErrorLogin("");
    if (!nombreLigaInput.trim() || !pinCreadorInput.trim()) { setErrorLogin("Ponle nombre a la liga y elige un PIN."); return; }
    const nuevoId = uid();
    try {
      const lista = ligasIndice || (await cargarIndiceLigas());
      const nuevaLista = [...lista, { id: nuevoId, nombre: nombreLigaInput.trim() }];
      await window.storage.set("ligas-indice", JSON.stringify(nuevaLista), true);
      setLigasIndice(nuevaLista);
      await window.storage.set(`liga-datos-${nuevoId}`, JSON.stringify({ nombre: nombreLigaInput.trim(), pinCreador: pinCreadorInput.trim(), equipos: [], partidosLiga: [] }), true);
      setLigaId(nuevoId);
      setLigaNombre(nombreLigaInput.trim());
      setPinCreador(pinCreadorInput.trim());
      setEquipos([]); setPartidosLiga([]);
      const s = { tipo: "creador", ligaId: nuevoId };
      setSesion(s);
      setTab("calendario");
      await window.storage.set("sesion", JSON.stringify(s), false);
    } catch (err) {
      console.error("Error creando la liga", err);
      const detalle = (err && (err.message || err.toString())) || "error desconocido";
      setErrorLogin(`No se pudo guardar: ${detalle}`);
    }
  };

  const confirmarPinOrganizador = () => {
    setErrorLogin("");
    if (pinCreadorInput.trim() !== pinCreador) { setErrorLogin("PIN de organizador incorrecto."); return; }
    const s = { tipo: "creador", ligaId };
    setSesion(s);
    setTab("calendario");
    window.storage.set("sesion", JSON.stringify(s), false).catch(() => {});
  };

  const confirmarPinEquipo = () => {
    setErrorLogin("");
    const encontrado = equipos.find((e) => e.pin === pinEquipoInput.trim());
    if (!encontrado) { setErrorLogin("Ese PIN no corresponde a ningún equipo de esta liga."); return; }
    const s = { tipo: "equipo", ligaId, equipoId: encontrado.id };
    setSesion(s);
    setTab("plantilla");
    window.storage.set("sesion", JSON.stringify(s), false).catch(() => {});
    window.storage.get(`mi-equipo-datos-${ligaId}-${encontrado.id}`, true).then((res) => {
      if (res?.value) {
        const mio = JSON.parse(res.value);
        setJugadores(mio.jugadores ?? []);
        setJugadas((mio.jugadas ?? []).map((j) => ({ ...j, asignaciones: j.asignaciones || j.rutas || [] })));
      }
    }).catch(() => {});
  };

  const volverLogin = () => {
    setPantallaLogin("menu"); setContextoLogin(null); setLigaElegida(null); setErrorLogin("");
    setNombreLigaInput(""); setPinCreadorInput(""); setPinEquipoInput("");
  };

  const cerrarSesion = () => {
    setSesion(null);
    setMenuEquiposAbierto(false);
    setJugadores([]); setJugadas([]);
    setLigaId(null); setLigaNombre(""); setPinCreador(""); setEquipos([]); setPartidosLiga([]);
    setLigasIndice(null); setLigaElegida(null);
    setPantallaLogin("menu"); setContextoLogin(null);
    setNombreLigaInput(""); setPinCreadorInput(""); setPinEquipoInput(""); setErrorLogin("");
    window.storage.set("sesion", "", false).catch(() => {});
  };

  /* ---------- plantilla ---------- */
  const agregarJugador = () => {
    if (!nombre.trim()) return;
    setJugadores((js) => [...js, {
      id: uid(), nombre: nombre.trim(), numero: numero.trim() || "--",
      posicion, lado: posASide(posicion), foto: fotoNueva,
    }]);
    setNombre(""); setNumero(""); setFotoNueva(null);
    setModalJugadorAbierto(false);
  };
  const eliminarJugador = (id) => setJugadores((js) => js.filter((j) => j.id !== id));

  const onFotoNuevaChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErrorFoto("");
    try {
      setFotoNueva(await resizeImagen(f));
    } catch (err) {
      setErrorFoto(err.message || "No se pudo cargar la imagen.");
    }
    e.target.value = "";
  };

  const onFotoEquipoChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErrorFoto("");
    try {
      const dataUrl = await resizeImagen(f, 240);
      actualizarMiEquipo({ foto: dataUrl });
    } catch (err) {
      setErrorFoto(err.message || "No se pudo cargar la imagen.");
    }
    e.target.value = "";
  };

  // ---- modal de jugador guardado (ver / editar) ----
  const abrirVistaJugador = (j) => setJugadorModal({ ...j, modo: "ver" });
  const cerrarModalJugador = () => setJugadorModal(null);
  const pasarAEditarJugador = () => setJugadorModal((m) => ({ ...m, modo: "editar" }));
  const actualizarCampoModal = (campo, valor) => setJugadorModal((m) => ({ ...m, [campo]: valor }));

  const onFotoModalChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErrorFoto("");
    try {
      const dataUrl = await resizeImagen(f);
      setJugadorModal((m) => ({ ...m, foto: dataUrl }));
    } catch (err) {
      setErrorFoto(err.message || "No se pudo cargar la imagen.");
    }
    e.target.value = "";
  };

  const guardarEdicionJugador = () => {
    if (!jugadorModal || !jugadorModal.nombre.trim()) return;
    setJugadores((js) => js.map((j) => (j.id === jugadorModal.id ? {
      ...j,
      nombre: jugadorModal.nombre.trim(),
      numero: (jugadorModal.numero || "").toString().trim() || "--",
      posicion: jugadorModal.posicion,
      lado: posASide(jugadorModal.posicion),
      foto: jugadorModal.foto,
    } : j)));
    setJugadorModal(null);
  };

  const ofensiva = jugadores.filter((j) => j.lado === "ofensiva");
  const defensiva = jugadores.filter((j) => j.lado === "defensiva");

  /* ---------- playbook ---------- */
  const iniciarNuevaJugada = (lado) => { setEligiendoFormacion(lado); };

  const elegirFormacion = (formacion) => {
    const lado = eligiendoFormacion;
    const tokens = (formacion ? formacion.tokens : []).map((t) => ({ ...t, id: uid() }));
    setEditando({ id: uid(), nombre: "", lado, formacion: formacion ? formacion.nombre : "Personalizada", tokens, asignaciones: [], losY: LOS_Y });
    setNombreJugada("");
    setModo("colocar");
    setCoberturaTipo("personal");
    setSeleccion(null);
    setZonaSeleccionada(null);
    setRutaEnCurso(null);
    setEligiendoFormacion(null);
  };

  const abrirJugada = (j) => {
    const clon = JSON.parse(JSON.stringify(j));
    clon.asignaciones = clon.asignaciones || clon.rutas || [];
    clon.losY = clon.losY ?? LOS_Y;
    setEditando(clon);
    setNombreJugada(j.nombre);
    setModo("colocar");
    setCoberturaTipo("personal");
    setSeleccion(null);
    setZonaSeleccionada(null);
    setRutaEnCurso(null);
  };

  const abrirVistaJugada = (j) => setViendoJugadaId(j.id);
  const cerrarVistaJugada = () => setViendoJugadaId(null);
  const jugadaEnVista = jugadas.find((j) => j.id === viendoJugadaId) || null;

  // Agrupar jugadas guardadas por formación, en un orden fijo y predecible
  const ORDEN_FORMACIONES = [
    ...OFFENSE_FORMATIONS.map((f) => f.nombre),
    ...DEFENSE_FORMATIONS.map((f) => f.nombre),
    "Personalizada",
  ];
  const jugadasAgrupadas = ORDEN_FORMACIONES
    .map((nombreF) => ({ nombreF, items: jugadas.filter((j) => (j.formacion || "Personalizada") === nombreF) }))
    .filter((g) => g.items.length > 0);

  const cerrarEditor = () => {
    setEditando(null); setSeleccion(null); setZonaSeleccionada(null); setRutaEnCurso(null); setEligiendoFormacion(null);
  };

  const guardarJugada = () => {
    if (!editando) return;
    const jugada = { ...editando, nombre: nombreJugada.trim() || "Jugada sin nombre" };
    setJugadas((prev) => {
      const existe = prev.some((p) => p.id === jugada.id);
      return existe ? prev.map((p) => (p.id === jugada.id ? jugada : p)) : [...prev, jugada];
    });
    cerrarEditor();
  };
  const eliminarJugada = (id) => setJugadas((js) => js.filter((j) => j.id !== id));

  const onFieldClick = ({ x, y }) => {
    if (!editando) return;
    if (modo === "linea") {
      setEditando((e) => ({ ...e, losY: y }));
    } else if (modo === "colocar") {
      if (seleccion) {
        setEditando((e) => ({ ...e, tokens: e.tokens.map((t) => (t.id === seleccion ? { ...t, x, y } : t)) }));
        setSeleccion(null);
      } else if (editando.tokens.length < 11) {
        setEditando((e) => ({ ...e, tokens: [...e.tokens, { id: uid(), x, y, numero: e.tokens.length + 1, pos: null }] }));
      }
    } else if (modo === "rutas" && rutaEnCurso) {
      if (rutaEnCurso.tipo === "zona") {
        const nuevaZona = { id: uid(), fromId: rutaEnCurso.fromId, tipo: "zona", cx: x, cy: y, rx: ZONA_RX, ry: ZONA_RY };
        setEditando((e) => ({ ...e, asignaciones: [...e.asignaciones, nuevaZona] }));
        setRutaEnCurso(null);
      } else {
        setRutaEnCurso((r) => ({ ...r, puntos: [...r.puntos, { x, y }] }));
      }
    }
  };

  const onTokenClick = (token) => {
    if (modo === "colocar") {
      setSeleccion((s) => (s === token.id ? null : token.id));
    } else if (modo === "rutas") {
      if (rutaEnCurso && rutaEnCurso.fromId === token.id) { setRutaEnCurso(null); return; }
      if (rutaEnCurso) return;
      const tipo = tipoAsignacionPara(token, editando.lado, coberturaTipo);
      setRutaEnCurso({ fromId: token.id, tipo, puntos: [] });
    } else if (modo === "eliminar") {
      setEditando((e) => ({
        ...e,
        tokens: e.tokens.filter((t) => t.id !== token.id),
        asignaciones: e.asignaciones.filter((a) => a.fromId !== token.id),
      }));
    }
  };

  const onRouteClick = (asignacionId) => {
    if (modo === "eliminar") {
      setEditando((e) => ({ ...e, asignaciones: e.asignaciones.filter((a) => a.id !== asignacionId) }));
    }
  };

  // Arrastre en vivo de una zona de cobertura (tocar y sostener, luego mover)
  const moverZona = (asignacionId, x, y) => {
    setEditando((e) => (e ? { ...e, asignaciones: e.asignaciones.map((a) => (a.id === asignacionId ? { ...a, cx: x, cy: y, zona: undefined } : a)) } : e));
  };

  const terminarRuta = () => {
    if (!rutaEnCurso || rutaEnCurso.tipo === "zona" || rutaEnCurso.puntos.length === 0) { setRutaEnCurso(null); return; }
    setEditando((e) => ({ ...e, asignaciones: [...e.asignaciones, { id: uid(), fromId: rutaEnCurso.fromId, tipo: rutaEnCurso.tipo, puntos: rutaEnCurso.puntos }] }));
    setRutaEnCurso(null);
  };

  /* ---------- calendario (único, agrupado por jornada) ---------- */
  const partidosPropios = partidosLiga.filter((p) => p.local === equipo || p.visitante === equipo);
  const juegosContables = partidosPropios.filter((p) => !p.bye).length;

  // Equipos disponibles para el calendario: todos los de la liga (compartidos)
  const listaEquipos = equipos.map((e) => ({ ...e, esPropio: sesion && sesion.tipo === "equipo" && e.id === sesion.equipoId }));

  const jornadasUnicas = Array.from(new Set(partidosLiga.map((p) => p.jornada || "Sin jornada")));
  const jornadasOrdenadas = jornadasUnicas.sort((a, b) => {
    if (a === "Sin jornada") return 1;
    if (b === "Sin jornada") return -1;
    return Number(a) - Number(b);
  });
  const partidosPorJornada = jornadasOrdenadas.map((j) => ({
    jornada: j,
    items: partidosLiga
      .filter((p) => (p.jornada || "Sin jornada") === j)
      .sort((a, b) => (a.fecha || "").localeCompare(b.fecha || "")),
  }));

  const numerosJornadaExistentes = partidosLiga.map((p) => Number(p.jornada)).filter((n) => !Number.isNaN(n));
  const maxJornada = numerosJornadaExistentes.length ? Math.max(...numerosJornadaExistentes) : 0;
  const opcionesJornada = Array.from({ length: maxJornada + 1 }, (_, i) => i + 1);

  const abrirModalPartido = () => {
    const sugerida = maxJornada ? maxJornada + 1 : 1;
    const localPorDefecto = sesion.tipo === "equipo" ? equipo : (equipos[0] ? equipos[0].nombre : "");
    setLocalCalendario(localPorDefecto);
    setVisitanteCalendario("");
    setJornadaPartido(String(sugerida));
    setFechaPartido(""); setHoraPartido("");
    setLugarPartido(sesion.tipo === "equipo" ? (equipoLugar || "") : (equipos[0] ? equipos[0].lugar || "" : ""));
    setEsBye(false);
    setErrorPartido("");
    setModalPartidoAbierto(true);
  };

  const onCambiarLocalCalendario = (nombreEquipo) => {
    setLocalCalendario(nombreEquipo);
    const encontrado = listaEquipos.find((t) => t.nombre === nombreEquipo);
    setLugarPartido(encontrado ? (encontrado.lugar || "") : "");
  };

  const agregarPartidoCalendario = () => {
    setErrorPartido("");
    if (!fechaPartido) { setErrorPartido("Elige una fecha."); return; }
    if (!esBye) {
      if (!visitanteCalendario.trim()) { setErrorPartido("Elige un equipo visitante."); return; }
      const localFinal = localCalendario.trim() || equipo;
      if (localFinal === visitanteCalendario.trim()) { setErrorPartido("El equipo local y el visitante no pueden ser el mismo."); return; }
    }
    setPartidosLiga((ps) => [...ps, {
      id: uid(),
      jornada: jornadaPartido.trim() || null,
      local: localCalendario.trim() || equipo,
      visitante: esBye ? "BYE" : visitanteCalendario.trim(),
      bye: esBye,
      fecha: fechaPartido,
      hora: esBye ? "" : horaPartido,
      lugar: esBye ? "" : lugarPartido.trim(),
      marcadorLocal: null,
      marcadorVisitante: null,
    }]);
    setLocalCalendario(""); setVisitanteCalendario(""); setJornadaPartido(""); setFechaPartido(""); setHoraPartido(""); setLugarPartido(""); setEsBye(false);
    setModalPartidoAbierto(false);
  };

  const eliminarPartido = (id) => setPartidosLiga((ps) => ps.filter((p) => p.id !== id));

  const resultadoPartido = (p) => {
    if (p.bye) return null;
    if (p.local !== equipo && p.visitante !== equipo) return null;
    if (p.marcadorLocal === null || p.marcadorLocal === undefined || p.marcadorVisitante === null || p.marcadorVisitante === undefined) return null;
    const propio = p.local === equipo ? p.marcadorLocal : p.marcadorVisitante;
    const rivalScore = p.local === equipo ? p.marcadorVisitante : p.marcadorLocal;
    if (propio > rivalScore) return "G";
    if (propio < rivalScore) return "P";
    return "E";
  };
  const colorResultado = (r) => (r === "G" ? THEME.win : r === "P" ? THEME.danger : THEME.tie);
  const textoResultado = (r) => (r === "G" ? "Ganado" : r === "P" ? "Perdido" : "Empate");

  const fotoDeEquipo = (nombreEquipo) => {
    const eq = listaEquipos.find((t) => t.nombre === nombreEquipo);
    return eq ? eq.foto : null;
  };
  const registroDeEquipo = (nombreEquipo) => {
    const fila = filasLiga.find((f) => f.nombre === nombreEquipo);
    return fila ? `${fila.g}-${fila.p}-${fila.e}` : "0-0-0";
  };

  const abrirEditarPartido = (p) => {
    setModalEditarPartido({
      id: p.id,
      jornada: p.jornada || "",
      local: p.local,
      visitante: p.visitante,
      bye: !!p.bye,
      fecha: p.fecha || "",
      hora: p.hora || "",
      lugar: p.lugar || "",
      marcadorLocal: p.marcadorLocal === null || p.marcadorLocal === undefined ? "" : String(p.marcadorLocal),
      marcadorVisitante: p.marcadorVisitante === null || p.marcadorVisitante === undefined ? "" : String(p.marcadorVisitante),
    });
    setErrorEditarPartido("");
  };
  const cerrarEditarPartido = () => { setModalEditarPartido(null); setErrorEditarPartido(""); };

  const onCambiarLocalEdicion = (nombreEquipo) => {
    const encontrado = listaEquipos.find((t) => t.nombre === nombreEquipo);
    setModalEditarPartido((m) => ({ ...m, local: nombreEquipo, lugar: encontrado ? (encontrado.lugar || "") : m.lugar }));
  };

  const guardarEdicionPartido = () => {
    if (!modalEditarPartido) return;
    const m = modalEditarPartido;
    setErrorEditarPartido("");
    if (!m.fecha) { setErrorEditarPartido("Elige una fecha."); return; }
    if (!m.bye) {
      if (!m.visitante.trim()) { setErrorEditarPartido("Elige un equipo visitante."); return; }
      const localFinal = (m.local || "").trim() || equipo;
      if (localFinal === m.visitante.trim()) { setErrorEditarPartido("El equipo local y el visitante no pueden ser el mismo."); return; }
    }
    setPartidosLiga((ps) => ps.map((p) => {
      if (p.id !== m.id) return p;
      const esAdmin = sesion.tipo === "creador";
      return {
        ...p,
        jornada: (m.jornada || "").trim() || null,
        local: (m.local || "").trim() || equipo,
        visitante: m.bye ? "BYE" : m.visitante.trim(),
        bye: m.bye,
        fecha: m.fecha,
        hora: m.bye ? "" : m.hora,
        lugar: m.bye ? "" : (m.lugar || "").trim(),
        marcadorLocal: m.bye ? null : (esAdmin ? (m.marcadorLocal === "" ? null : Number(m.marcadorLocal)) : p.marcadorLocal),
        marcadorVisitante: m.bye ? null : (esAdmin ? (m.marcadorVisitante === "" ? null : Number(m.marcadorVisitante)) : p.marcadorVisitante),
      };
    }));
    setModalEditarPartido(null);
  };

  const eliminarDesdeModal = () => {
    if (!modalEditarPartido) return;
    eliminarPartido(modalEditarPartido.id);
    setModalEditarPartido(null);
  };

  /* ---------- liga (tabla + equipos) ---------- */
  const filasLiga = calcularTablaLiga(partidosLiga, sesion && sesion.tipo === "equipo" ? equipo : null);

  const puedeEditarEquipo = (entry) => sesion && (sesion.tipo === "creador" || (sesion.tipo === "equipo" && entry.id === sesion.equipoId));

  const abrirNuevoEquipo = () => { setMenuEquiposAbierto(false); setModalEquipo({ modo: "nuevo", nombre: "", lugar: "", foto: null }); };
  const abrirEditarEquipo = (entry) => {
    if (!puedeEditarEquipo(entry)) return;
    setMenuEquiposAbierto(false);
    setModalEquipo({ modo: "editar", esPropio: entry.esPropio, id: entry.id, nombreViejo: entry.nombre, nombre: entry.nombre, lugar: entry.lugar || "", foto: entry.foto || null, pin: entry.pin });
  };
  const cerrarModalEquipo = () => setModalEquipo(null);
  const eliminarEquipoRegistro = (id) => { if (sesion && sesion.tipo === "creador") setEquipos((eqs) => eqs.filter((e) => e.id !== id)); };

  const onFotoModalEquipoChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErrorFoto("");
    try {
      const dataUrl = await resizeImagen(f, 200);
      setModalEquipo((m) => ({ ...m, foto: dataUrl }));
    } catch (err) {
      setErrorFoto(err.message || "No se pudo cargar la imagen.");
    }
    e.target.value = "";
  };

  const regenerarPinModal = () => setModalEquipo((m) => ({ ...m, pin: generarPin() }));

  const guardarModalEquipo = () => {
    if (!modalEquipo) return;
    const nombreNuevo = modalEquipo.nombre.trim();
    const lugarNuevo = modalEquipo.lugar.trim();
    const fotoNueva = modalEquipo.foto || null;
    if (!nombreNuevo) return;

    if (modalEquipo.modo === "nuevo") {
      setEquipos((eqs) => [...eqs, { id: uid(), nombre: nombreNuevo, lugar: lugarNuevo, foto: fotoNueva, pin: generarPin() }]);
    } else {
      setEquipos((eqs) => eqs.map((e) => (e.id === modalEquipo.id ? { ...e, nombre: nombreNuevo, lugar: lugarNuevo, foto: fotoNueva, pin: modalEquipo.pin || e.pin } : e)));
      if (modalEquipo.nombreViejo !== nombreNuevo) {
        setPartidosLiga((ps) => ps.map((p) => ({
          ...p,
          local: p.local === modalEquipo.nombreViejo ? nombreNuevo : p.local,
          visitante: p.visitante === modalEquipo.nombreViejo ? nombreNuevo : p.visitante,
        })));
      }
    }
    setModalEquipo(null);
  };

  const fuentes = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&display=swap');
      .f-display { font-family:'Barlow Condensed',sans-serif; letter-spacing:0.02em; }
      .f-mono { font-family:'JetBrains Mono',monospace; }
      body, input, select, button { font-family:'Inter',sans-serif; }
    `}</style>
  );

  const inputStyle = { background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` };

  if (!cargado) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: THEME.bg }}>
        {fuentes}
        <div className="text-sm f-mono" style={{ color: THEME.textDim }}>Cargando…</div>
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: THEME.bg }}>
        {fuentes}
        <div className="max-w-md w-full mx-auto px-4 py-10">
          <div className="f-display text-3xl font-bold text-center mb-1" style={{ color: THEME.text }}>
            {ligaElegida ? ligaElegida.nombre : "Roster & Playbook"}
          </div>
          <div className="text-sm text-center mb-8" style={{ color: THEME.textDim }}>
            {pantallaLogin === "menu" ? "Elige cómo quieres entrar" : "Selecciona tu liga"}
          </div>

          {pantallaLogin === "menu" && (
            <div className="flex flex-col gap-3">
              <button onClick={() => abrirElegirLiga("organizador")}
                className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: THEME.text, color: THEME.bg }}>
                Soy el organizador
              </button>
              <button onClick={() => abrirElegirLiga("equipo")}
                className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: THEME.surface, color: THEME.text, border: `1px solid ${THEME.border}` }}>
                Tengo un PIN de equipo
              </button>
              <button onClick={() => abrirElegirLiga("visitante")}
                className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: "transparent", color: THEME.textDim, border: `1px solid ${THEME.border}` }}>
                Entrar como visitante
              </button>
            </div>
          )}

          {pantallaLogin === "elegirLiga" && (
            <div className="flex flex-col gap-2">
              {ligasIndice === null && (
                <div className="text-xs text-center py-6" style={{ color: THEME.textDim }}>Cargando ligas…</div>
              )}
              {ligasIndice !== null && ligasIndice.length === 0 && (
                <div className="text-xs text-center py-6" style={{ color: THEME.textDim }}>
                  {contextoLogin === "organizador" ? "Todavía no hay ligas — crea la primera." : "Todavía no hay ninguna liga dada de alta."}
                </div>
              )}
              {(ligasIndice || []).map((l) => (
                <button key={l.id} onClick={() => elegirLigaExistente(l)}
                  className="w-full text-left py-3 px-4 rounded-lg text-sm font-semibold"
                  style={{ background: THEME.surface, color: THEME.text, border: `1px solid ${THEME.border}` }}>
                  {l.nombre}
                </button>
              ))}
              {contextoLogin === "organizador" && (
                <button onClick={irACrearLiga}
                  className="w-full py-3 rounded-lg text-sm font-semibold mt-1"
                  style={{ background: THEME.surface2, color: THEME.offense, border: `1px dashed ${THEME.border}` }}>
                  ＋ Crear una liga nueva
                </button>
              )}
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium mt-2" style={{ color: THEME.textDim }}>Volver</button>
            </div>
          )}

          {pantallaLogin === "crearLiga" && (
            <div className="flex flex-col gap-3">
              <input placeholder="Nombre de la liga" value={nombreLigaInput} onChange={(e) => setNombreLigaInput(e.target.value)}
                className="w-full rounded-md px-3 py-3 text-sm outline-none" style={inputStyle} />
              <input placeholder="Elige un PIN de organizador" value={pinCreadorInput}
                onChange={(e) => setPinCreadorInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: THEME.danger }}>{errorLogin}</div>}
              <button onClick={crearLiga} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: THEME.text, color: THEME.bg }}>Crear liga</button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: THEME.textDim }}>Volver</button>
            </div>
          )}

          {pantallaLogin === "pinOrganizador" && (
            <div className="flex flex-col gap-3">
              <input placeholder="PIN de organizador" value={pinCreadorInput}
                onChange={(e) => setPinCreadorInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: THEME.danger }}>{errorLogin}</div>}
              <button onClick={confirmarPinOrganizador} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: THEME.text, color: THEME.bg }}>Entrar</button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: THEME.textDim }}>Volver</button>
            </div>
          )}

          {pantallaLogin === "pinEquipo" && (
            <div className="flex flex-col gap-3">
              <input placeholder="PIN de tu equipo" value={pinEquipoInput}
                onChange={(e) => setPinEquipoInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: THEME.danger }}>{errorLogin}</div>}
              <button onClick={confirmarPinEquipo} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ background: THEME.text, color: THEME.bg }}>Entrar</button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: THEME.textDim }}>Volver</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: THEME.bg }}>
      {fuentes}
      <div className="max-w-md mx-auto px-4 pb-24 pt-6">

        {/* encabezado */}
        <div className="flex items-center gap-3 mb-1">
          {sesion.tipo === "equipo" && (
            <>
              <input type="file" accept="image/*" ref={inputFotoEquipo} className="hidden" onChange={onFotoEquipoChange} />
              <button onClick={() => inputFotoEquipo.current?.click()}
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: THEME.surface2, border: `1px dashed ${THEME.border}` }}>
                {equipoFoto ? <img src={equipoFoto} alt="" className="w-full h-full object-cover" />
                  : <span className="text-lg" style={{ color: THEME.textDim }}>+</span>}
              </button>
            </>
          )}
          {sesion.tipo === "equipo" ? (
            <input value={equipo} onChange={(e) => actualizarMiEquipo({ nombre: e.target.value })}
              className="f-display text-2xl bg-transparent outline-none w-full font-bold"
              style={{ color: THEME.text }} />
          ) : sesion.tipo === "creador" ? (
            <input value={ligaNombre} onChange={(e) => setLigaNombre(e.target.value)}
              className="f-display text-2xl bg-transparent outline-none w-full font-bold"
              style={{ color: THEME.text }} />
          ) : (
            <div className="f-display text-2xl font-bold w-full truncate" style={{ color: THEME.text }}>{ligaNombre || "Visitante"}</div>
          )}

          <div className="relative shrink-0">
            <button onClick={() => setMenuEquiposAbierto((v) => !v)}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[3px] shrink-0"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
              <span className="block w-4 h-[2px] rounded-full" style={{ background: THEME.text }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: THEME.text }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: THEME.text }} />
            </button>

            {menuEquiposAbierto && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuEquiposAbierto(false)} />
                <div className="absolute right-0 top-12 z-50 w-72 max-w-[85vw] rounded-xl p-4"
                  style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="f-display text-base font-bold uppercase" style={{ color: THEME.text }}>Equipos</div>
                    {sesion.tipo === "creador" && (
                      <button onClick={abrirNuevoEquipo}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                        style={{ background: THEME.text, color: THEME.bg }}>+</button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-h-80 overflow-y-auto mb-3">
                    {listaEquipos.length === 0 && (
                      <div className="text-xs" style={{ color: THEME.textDim }}>
                        {sesion.tipo === "creador" ? "Agrega tu primer equipo con el +." : "Todavía no hay equipos en la liga."}
                      </div>
                    )}
                    {listaEquipos.map((eq) => (
                      <div key={eq.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
                          {eq.foto ? <img src={eq.foto} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: eq.esPropio ? THEME.offense : THEME.text }}>{eq.nombre}</div>
                          <div className="text-xs truncate" style={{ color: THEME.textDim }}>
                            {eq.lugar || "Sin ubicación"}{sesion.tipo === "creador" ? ` · PIN ${eq.pin}` : ""}
                          </div>
                        </div>
                        {puedeEditarEquipo(eq) && (
                          <button onClick={() => abrirEditarEquipo(eq)} className="text-xs px-2 shrink-0" style={{ color: THEME.textDim }}>✎</button>
                        )}
                        {sesion.tipo === "creador" && (
                          <button onClick={() => eliminarEquipoRegistro(eq.id)} className="text-xs px-2 shrink-0" style={{ color: THEME.danger }}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={cerrarSesion} className="w-full py-2 rounded-md text-xs font-semibold"
                    style={{ background: THEME.surface2, color: THEME.danger, border: `1px solid ${THEME.border}` }}>Cerrar sesión</button>
                </div>
              </>
            )}
          </div>
        </div>
        {sesion.tipo === "equipo" && (
          <div className="flex gap-3 f-mono text-[11px] mb-5 uppercase tracking-wide flex-wrap" style={{ color: THEME.textDim }}>
            <span>{ofensiva.length} Ofensiva</span>
            <span>·</span>
            <span>{defensiva.length} Defensiva</span>
            <span>·</span>
            <span>{jugadas.length} Jugadas</span>
            <span>·</span>
            <span>{juegosContables} Juegos</span>
          </div>
        )}
        {sesion.tipo !== "equipo" && <div className="mb-5" />}

        {/* tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
          {(sesion.tipo === "equipo"
            ? [["plantilla", "Plantilla"], ["jugadas", "Playbook"], ["calendario", "Calendario"], ["liga", "Liga"]]
            : [["calendario", "Calendario"], ["liga", "Liga"]]
          ).map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); cerrarEditor(); cerrarVistaJugada(); }}
              className="flex-1 py-2 rounded-md text-[11px] font-semibold transition"
              style={{ background: tab === key ? THEME.text : "transparent", color: tab === key ? THEME.bg : THEME.textDim }}>
              {label}
            </button>
          ))}
        </div>

        {/* ============ TAB PLANTILLA ============ */}
        {tab === "plantilla" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: THEME.text }}>Plantilla</div>
              <button onClick={() => setModalJugadorAbierto(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: THEME.text, color: THEME.bg }}>+</button>
            </div>

            {[["Ofensiva", ofensiva], ["Defensiva", defensiva]].map(([titulo, lista]) => (
              <div key={titulo} className="mb-6">
                <div className="f-display text-base font-bold mb-2 uppercase" style={{ color: THEME.text }}>{titulo}</div>
                {lista.length === 0 && <div className="text-sm py-3" style={{ color: THEME.textDim }}>Todavía no hay jugadores aquí.</div>}
                <div className="flex flex-col gap-2">
                  {lista.map((j) => (
                    <div key={j.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                      style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
                      <button onClick={() => abrirVistaJugador(j)}
                        className="w-11 h-11 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: THEME.surface2, border: `2px solid ${POSITION_COLORS[j.posicion]}` }}>
                        {j.foto ? <img src={j.foto} alt="" className="w-full h-full object-cover" />
                          : <span className="text-xs f-mono font-bold" style={{ color: POSITION_COLORS[j.posicion] }}>{j.posicion}</span>}
                      </button>
                      <div className="flex-1 min-w-0" onClick={() => abrirVistaJugador(j)} style={{ cursor: "pointer" }}>
                        <div className="text-sm font-semibold truncate" style={{ color: THEME.text }}>{j.nombre}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold f-mono"
                            style={{ background: POSITION_COLORS[j.posicion], color: "#0A0D0C" }}>{j.posicion}</span>
                          <span className="text-xs" style={{ color: THEME.textDim }}>{NOMBRES_POSICION[j.posicion]}</span>
                        </div>
                      </div>
                      <div className="text-base f-mono font-bold shrink-0" style={{ color: THEME.textDim }}>{j.numero}</div>
                      <button onClick={() => eliminarJugador(j.id)} className="text-xs px-2 shrink-0" style={{ color: THEME.danger }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ MODAL: AGREGAR JUGADOR ============ */}
        {modalJugadorAbierto && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setModalJugadorAbierto(false)}>
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>Agregar jugador</div>
              <div className="flex gap-3 mb-3 items-center">
                <input type="file" accept="image/*" ref={inputFotoNueva} className="hidden" onChange={onFotoNuevaChange} />
                <button onClick={() => inputFotoNueva.current?.click()}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: THEME.surface2, border: `1px dashed ${THEME.border}` }}>
                  {fotoNueva ? <img src={fotoNueva} alt="" className="w-full h-full object-cover" />
                    : <span className="text-lg" style={{ color: THEME.textDim }}>+</span>}
                </button>
                <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                <input placeholder="#" value={numero} onChange={(e) => setNumero(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-14 rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
              </div>
              {errorFoto && <div className="text-xs mb-3" style={{ color: THEME.danger }}>{errorFoto}</div>}
              <select value={posicion} onChange={(e) => setPosicion(e.target.value)}
                className="w-full rounded-md px-3 py-2 text-sm outline-none mb-4" style={inputStyle}>
                <optgroup label="Ofensiva">
                  {POSICIONES.ofensiva.map((p) => <option key={p} value={p}>{p} — {NOMBRES_POSICION[p]}</option>)}
                </optgroup>
                <optgroup label="Defensiva">
                  {POSICIONES.defensiva.map((p) => <option key={p} value={p}>{p} — {NOMBRES_POSICION[p]}</option>)}
                </optgroup>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setModalJugadorAbierto(false)} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
                <button onClick={agregarJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.text, color: THEME.bg }}>Añadir</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL JUGADOR (ver / editar) ============ */}
        {jugadorModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalJugador}>
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <input type="file" accept="image/*" ref={inputFotoModalJugador} className="hidden" onChange={onFotoModalChange} />

              {jugadorModal.modo === "ver" ? (
                <div>
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden mb-3 flex items-center justify-center"
                      style={{ background: THEME.surface2, border: `3px solid ${POSITION_COLORS[jugadorModal.posicion]}` }}>
                      {jugadorModal.foto ? <img src={jugadorModal.foto} alt="" className="w-full h-full object-cover" />
                        : <span className="text-2xl f-mono font-bold" style={{ color: POSITION_COLORS[jugadorModal.posicion] }}>{jugadorModal.posicion}</span>}
                    </div>
                    <div className="f-display text-2xl font-bold" style={{ color: THEME.text }}>{jugadorModal.nombre}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold f-mono"
                        style={{ background: POSITION_COLORS[jugadorModal.posicion], color: "#0A0D0C" }}>{jugadorModal.posicion}</span>
                      <span className="text-xs" style={{ color: THEME.textDim }}>{NOMBRES_POSICION[jugadorModal.posicion]}</span>
                      <span className="text-sm f-mono font-bold" style={{ color: THEME.textDim }}>#{jugadorModal.numero}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={cerrarModalJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cerrar</button>
                    <button onClick={pasarAEditarJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: THEME.text, color: THEME.bg }}>Editar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>Editar jugador</div>
                  <div className="flex justify-center mb-4">
                    <button onClick={() => inputFotoModalJugador.current?.click()}
                      className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: THEME.surface2, border: `1px dashed ${THEME.border}` }}>
                      {jugadorModal.foto ? <img src={jugadorModal.foto} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xs" style={{ color: THEME.textDim }}>Cambiar foto</span>}
                    </button>
                  </div>
                  {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: THEME.danger }}>{errorFoto}</div>}
                  <div className="flex flex-col gap-2 mb-3">
                    <input placeholder="Nombre" value={jugadorModal.nombre}
                      onChange={(e) => actualizarCampoModal("nombre", e.target.value)}
                      className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                    <div className="flex gap-2">
                      <input placeholder="#" value={jugadorModal.numero}
                        onChange={(e) => actualizarCampoModal("numero", e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-20 rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
                      <select value={jugadorModal.posicion} onChange={(e) => actualizarCampoModal("posicion", e.target.value)}
                        className="flex-1 rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                        <optgroup label="Ofensiva">
                          {POSICIONES.ofensiva.map((p) => <option key={p} value={p}>{p} — {NOMBRES_POSICION[p]}</option>)}
                        </optgroup>
                        <optgroup label="Defensiva">
                          {POSICIONES.defensiva.map((p) => <option key={p} value={p}>{p} — {NOMBRES_POSICION[p]}</option>)}
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setJugadorModal((m) => ({ ...m, modo: "ver" }))} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
                    <button onClick={guardarEdicionJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: THEME.text, color: THEME.bg }}>Guardar cambios</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ TAB JUGADAS (lista agrupada por formación) ============ */}
        {tab === "jugadas" && !eligiendoFormacion && !editando && !viendoJugadaId && (
          <div>
            <div className="flex gap-2 mb-6">
              <button onClick={() => iniciarNuevaJugada("ofensiva")} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: THEME.offense, color: "#1A1200" }}>+ Jugada ofensiva</button>
              <button onClick={() => iniciarNuevaJugada("defensiva")} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: THEME.defense, color: "#0A1522" }}>+ Jugada defensiva</button>
            </div>

            {jugadas.length === 0 && <div className="text-sm text-center py-10" style={{ color: THEME.textDim }}>
              Aún no has creado ninguna jugada. Empieza con un botón de arriba.
            </div>}

            {jugadasAgrupadas.map((grupo) => (
              <div key={grupo.nombreF} className="mb-2">
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: THEME.border }} />
                  <span className="text-[11px] f-mono uppercase tracking-wide shrink-0" style={{ color: THEME.textDim }}>{grupo.nombreF}</span>
                  <div className="flex-1 h-px" style={{ background: THEME.border }} />
                </div>
                <div className="flex flex-col gap-3">
                  {grupo.items.map((j) => (
                    <div key={j.id} className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
                      <button onClick={() => abrirVistaJugada(j)} className="w-16 h-24 rounded-md overflow-hidden shrink-0">
                        <Field tokens={j.tokens} asignaciones={j.asignaciones} side={j.lado} mode="ver" losY={j.losY} mini />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: THEME.text }}>{j.nombre}</div>
                        <div className="text-[11px] f-mono uppercase" style={{ color: j.lado === "ofensiva" ? THEME.offense : THEME.defense }}>{j.lado}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <button onClick={() => abrirVistaJugada(j)} className="text-xs px-3 py-1 rounded font-medium"
                            style={{ background: THEME.surface2, color: THEME.text }}>Ver</button>
                          <button onClick={() => abrirJugada(j)} className="text-xs px-3 py-1 rounded font-medium"
                            style={{ background: THEME.surface2, color: THEME.text }}>Editar</button>
                          <button onClick={() => eliminarJugada(j.id)} className="text-xs px-3 py-1 rounded font-medium" style={{ color: THEME.danger }}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ VISTA DE SOLO LECTURA DE UNA JUGADA ============ */}
        {tab === "jugadas" && jugadaEnVista && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="f-display text-lg font-bold" style={{ color: THEME.text }}>{jugadaEnVista.nombre}</div>
                <div className="text-[11px] f-mono uppercase" style={{ color: jugadaEnVista.lado === "ofensiva" ? THEME.offense : THEME.defense }}>
                  {jugadaEnVista.lado} · {jugadaEnVista.formacion || "Personalizada"} · Solo lectura
                </div>
              </div>
              <button onClick={cerrarVistaJugada} className="text-xs px-3 py-1.5 rounded font-medium"
                style={{ background: THEME.surface2, color: THEME.text }}>Cerrar</button>
            </div>
            <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: `${FIELD_W}/${FIELD_H}` }}>
              <Field tokens={jugadaEnVista.tokens} asignaciones={jugadaEnVista.asignaciones} side={jugadaEnVista.lado} mode="ver" losY={jugadaEnVista.losY} />
            </div>
            <button onClick={() => { abrirJugada(jugadaEnVista); setViendoJugadaId(null); }}
              className="w-full py-3 rounded-lg font-semibold text-sm"
              style={{ background: THEME.text, color: THEME.bg }}>Editar esta jugada</button>
          </div>
        )}

        {/* ============ SELECTOR DE FORMACIÓN ============ */}
        {tab === "jugadas" && eligiendoFormacion && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: THEME.text }}>Elegir formación</div>
              <button onClick={() => setEligiendoFormacion(null)} className="text-xs" style={{ color: THEME.textDim }}>Cancelar</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(eligiendoFormacion === "ofensiva" ? OFFENSE_FORMATIONS : DEFENSE_FORMATIONS).map((f) => (
                <button key={f.nombre} onClick={() => elegirFormacion(f)}
                  className="rounded-xl p-2 text-left" style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
                  <div className="w-full rounded-md overflow-hidden mb-2" style={{ aspectRatio: `${FIELD_W}/${FIELD_H}` }}>
                    <Field tokens={f.tokens.map((t) => ({ ...t, id: t.pos }))} asignaciones={[]} side={eligiendoFormacion} mode="ver" mini />
                  </div>
                  <div className="text-xs font-semibold" style={{ color: THEME.text }}>{f.nombre}</div>
                </button>
              ))}
              <button onClick={() => elegirFormacion(null)}
                className="rounded-xl p-2 flex flex-col items-center justify-center gap-2"
                style={{ background: THEME.surface, border: `1px dashed ${THEME.border}`, aspectRatio: "0.65" }}>
                <span className="text-2xl" style={{ color: THEME.textDim }}>＋</span>
                <span className="text-xs font-semibold" style={{ color: THEME.textDim }}>Empezar en blanco</span>
              </button>
            </div>
          </div>
        )}

        {/* ============ EDITOR DE JUGADA ============ */}
        {tab === "jugadas" && editando && (
          <div>
            <input value={nombreJugada} onChange={(e) => setNombreJugada(e.target.value)}
              placeholder="Nombre de la jugada (ej. Slant derecho)"
              className="w-full rounded-md px-3 py-2 mb-3 text-sm outline-none font-semibold"
              style={{ background: THEME.surface, color: THEME.text, border: `1px solid ${THEME.border}` }} />

            <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
              {[["colocar", "Colocar"], ["rutas", editando.lado === "ofensiva" ? "Rutas/Bloqueos" : "Coberturas"], ["linea", "Línea"], ["eliminar", "Quitar"]].map(([key, label]) => (
                <button key={key} onClick={() => { setModo(key); setSeleccion(null); setRutaEnCurso(null); setZonaSeleccionada(null); }}
                  className="flex-1 py-2 rounded-md text-xs font-semibold"
                  style={{ background: modo === key ? THEME.text : "transparent", color: modo === key ? THEME.bg : THEME.textDim }}>
                  {label}
                </button>
              ))}
            </div>

            {modo === "rutas" && editando.lado === "defensiva" && (
              <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
                {[["personal", "Personal"], ["zona", "Zona"]].map(([key, label]) => (
                  <button key={key} onClick={() => setCoberturaTipo(key)}
                    className="flex-1 py-1.5 rounded-md text-xs font-semibold"
                    style={{ background: coberturaTipo === key ? THEME.text : "transparent", color: coberturaTipo === key ? THEME.bg : THEME.textDim }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-xl overflow-hidden mb-2" style={{ aspectRatio: `${FIELD_W}/${FIELD_H}` }}>
              <Field tokens={editando.tokens} asignaciones={editando.asignaciones} side={editando.lado} mode={modo}
                seleccion={seleccion} rutaEnCurso={rutaEnCurso} losY={editando.losY}
                onFieldClick={onFieldClick} onTokenClick={onTokenClick} onRouteClick={onRouteClick} onZonaArrastrar={moverZona} />
            </div>

            <div className="text-xs mb-3 min-h-[2.2em]" style={{ color: THEME.textDim }}>
              {modo === "colocar" && !seleccion && "Toca el campo para agregar un jugador. Toca un jugador para moverlo."}
              {modo === "colocar" && seleccion && "Ahora toca el punto del campo al que quieres moverlo."}
              {modo === "rutas" && !rutaEnCurso && editando.lado === "ofensiva" && "Toca un jugador: si es liniero se marca su bloqueo, si no, su ruta."}
              {modo === "rutas" && !rutaEnCurso && editando.lado === "defensiva" && "Toca un jugador: si es liniero defensivo se marca su trampa; si no, su cobertura (según Personal/Zona de arriba). Mantén presionada una zona y arrástrala para moverla."}
              {modo === "rutas" && rutaEnCurso && rutaEnCurso.tipo === "zona" && "Toca el campo donde quieres colocar la zona."}
              {modo === "rutas" && rutaEnCurso && rutaEnCurso.tipo !== "zona" && "Toca el campo para trazar el camino, punto por punto."}
              {modo === "linea" && "Toca la altura del campo donde quieres colocar la línea de golpeo."}
              {modo === "eliminar" && "Toca un jugador o una asignación para eliminarlos."}
            </div>

            {modo === "rutas" && rutaEnCurso && (
              <div className="flex gap-2 mb-3">
                <button onClick={() => setRutaEnCurso(null)} className="flex-1 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: THEME.surface2, color: THEME.text }}>Cancelar</button>
                {rutaEnCurso.tipo !== "zona" && (
                  <button onClick={terminarRuta} disabled={rutaEnCurso.puntos.length === 0}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: THEME.text, color: THEME.bg, opacity: rutaEnCurso.puntos.length === 0 ? 0.5 : 1 }}>
                    Terminar
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-1">
              <button onClick={cerrarEditor} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: THEME.surface, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
              <button onClick={guardarJugada} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: THEME.text, color: THEME.bg }}>Guardar jugada</button>
            </div>
          </div>
        )}

        {/* ============ TAB CALENDARIO (único, agrupado por jornada, colapsable) ============ */}
        {tab === "calendario" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: THEME.text }}>Calendario</div>
              {sesion.tipo === "creador" && (
                <button onClick={abrirModalPartido}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: THEME.text, color: THEME.bg }}>+</button>
              )}
            </div>

            {partidosLiga.length === 0 && (
              <div className="text-sm text-center py-10" style={{ color: THEME.textDim }}>
                No hay juegos programados todavía.
              </div>
            )}

            {partidosPorJornada.map((grupo) => {
              const abierta = !!jornadasAbiertas[grupo.jornada];
              return (
                <div key={grupo.jornada} className="mb-2">
                  <button onClick={() => toggleJornada(grupo.jornada)}
                    className="w-full flex items-center gap-3 my-4 select-none">
                    <div className="flex-1 h-px" style={{ background: THEME.border }} />
                    <span className="flex items-center gap-1.5 text-[11px] f-mono uppercase tracking-wide shrink-0" style={{ color: THEME.textDim }}>
                      <span style={{ display: "inline-block", transform: abierta ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▸</span>
                      {grupo.jornada === "Sin jornada" ? "Sin jornada" : `Jornada ${grupo.jornada}`} · {grupo.items.length} juego{grupo.items.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-px" style={{ background: THEME.border }} />
                  </button>

                  {abierta && (
                    <div className="flex flex-col gap-3">
                      {grupo.items.map((p) => {
                        const r = resultadoPartido(p);
                        const tieneMarcador = p.marcadorLocal !== null && p.marcadorLocal !== undefined && p.marcadorVisitante !== null && p.marcadorVisitante !== undefined;

                        const renderLogo = (nombreEquipo) => {
                          const foto = fotoDeEquipo(nombreEquipo);
                          return (
                            <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                                style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                                {foto ? <img src={foto} alt="" className="w-full h-full object-cover" />
                                  : <span className="text-[10px] f-mono font-bold text-center px-1" style={{ color: THEME.textDim }}>{nombreEquipo}</span>}
                              </div>
                              <div className="text-xs font-semibold text-center truncate w-full" style={{ color: nombreEquipo === equipo ? THEME.offense : THEME.text }}>{nombreEquipo}</div>
                              <div className="text-[11px] f-mono" style={{ color: THEME.textDim }}>{registroDeEquipo(nombreEquipo)}</div>
                            </div>
                          );
                        };

                        if (p.bye) {
                          return (
                            <div key={p.id} className="rounded-xl p-5 select-none"
                              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
                              onMouseDown={() => iniciarPulsacionLarga(p.id)} onMouseUp={cancelarPulsacionLarga} onMouseLeave={cancelarPulsacionLarga}
                              onTouchStart={() => iniciarPulsacionLarga(p.id)} onTouchEnd={cancelarPulsacionLarga} onTouchCancel={cancelarPulsacionLarga}>
                              <div className="flex items-center justify-between gap-1">
                                {renderLogo(p.local)}

                                <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-2">
                                  <div className="text-xs f-mono text-center" style={{ color: THEME.textDim }}>{formatearFecha(p.fecha)}</div>
                                  <div className="f-mono text-2xl font-bold text-center mt-1" style={{ color: THEME.textDim }}>BYE</div>
                                  <span className="text-[11px] px-2 py-1 rounded font-bold f-mono uppercase mt-0.5"
                                    style={{ background: THEME.surface2, color: THEME.textDim, border: `1px solid ${THEME.border}` }}>Descanso</span>
                                </div>

                                <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
                                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ background: THEME.surface2, border: `1px dashed ${THEME.border}` }}>
                                    <span className="text-sm f-mono font-bold" style={{ color: THEME.textDim }}>BYE</span>
                                  </div>
                                  <div className="text-xs font-semibold text-center" style={{ color: THEME.textDim }}>Sin rival</div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={p.id} className="rounded-xl p-5 select-none"
                            style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
                            onMouseDown={() => iniciarPulsacionLarga(p.id)} onMouseUp={cancelarPulsacionLarga} onMouseLeave={cancelarPulsacionLarga}
                            onTouchStart={() => iniciarPulsacionLarga(p.id)} onTouchEnd={cancelarPulsacionLarga} onTouchCancel={cancelarPulsacionLarga}>
                            <div className="flex items-center justify-between gap-1">
                              {renderLogo(p.local)}
                              <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: tieneMarcador ? THEME.text : THEME.textDim }}>
                                {tieneMarcador ? p.marcadorLocal : "–"}
                              </div>

                              <div className="flex flex-col items-center gap-1.5 min-w-0 px-2">
                                <div className="text-xs f-mono text-center" style={{ color: THEME.textDim }}>{formatearFecha(p.fecha)}</div>
                                {p.hora && <div className="text-xs f-mono text-center" style={{ color: THEME.textDim }}>{formatearHora(p.hora)}</div>}
                                {r && (
                                  <span className="text-[11px] px-2 py-1 rounded font-bold f-mono uppercase mt-0.5"
                                    style={{ background: colorResultado(r), color: "#0A0D0C" }}>{textoResultado(r)}</span>
                                )}
                              </div>

                              <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: tieneMarcador ? THEME.text : THEME.textDim }}>
                                {tieneMarcador ? p.marcadorVisitante : "–"}
                              </div>
                              {renderLogo(p.visitante)}
                            </div>

                            {p.lugar && <div className="text-xs text-center mt-4" style={{ color: THEME.textDim }}>📍 {p.lugar}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============ TAB LIGA (tabla + equipos) ============ */}
        {tab === "liga" && (
          <div>
            <div className="f-display text-lg font-bold uppercase mb-4" style={{ color: THEME.text }}>Tabla de posiciones</div>

            <div className="rounded-xl overflow-hidden mb-6" style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
                    <th className="text-center py-2 px-2 f-mono uppercase" style={{ color: THEME.textDim }}>#</th>
                    <th className="text-left py-2 px-2 f-mono uppercase" style={{ color: THEME.textDim }}>Equipo</th>
                    <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: THEME.textDim }}>PJ</th>
                    <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: THEME.textDim }}>G</th>
                    <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: THEME.textDim }}>P</th>
                    <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: THEME.textDim }}>E</th>
                    <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: THEME.textDim }}>DIF</th>
                  </tr>
                </thead>
                <tbody>
                  {filasLiga.map((eq, idx) => (
                    <tr key={eq.id} style={{ borderBottom: `1px solid ${THEME.border}`, background: eq.esPropio ? THEME.surface2 : "transparent" }}>
                      <td className="text-center py-2 px-2 f-mono font-bold" style={{ color: THEME.textDim }}>{idx + 1}</td>
                      <td className="py-2 px-2 font-semibold truncate max-w-[110px]" style={{ color: eq.esPropio ? THEME.offense : THEME.text }}>{eq.nombre}</td>
                      <td className="text-center py-2 px-1 f-mono" style={{ color: THEME.text }}>{eq.g + eq.p + eq.e}</td>
                      <td className="text-center py-2 px-1 f-mono" style={{ color: THEME.win }}>{eq.g}</td>
                      <td className="text-center py-2 px-1 f-mono" style={{ color: THEME.danger }}>{eq.p}</td>
                      <td className="text-center py-2 px-1 f-mono" style={{ color: THEME.textDim }}>{eq.e}</td>
                      <td className="text-center py-2 px-1 f-mono" style={{ color: THEME.text }}>{eq.pf - eq.pc > 0 ? "+" : ""}{eq.pf - eq.pc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[11px]" style={{ color: THEME.textDim }}>
              La tabla se calcula automáticamente a partir de los marcadores guardados en el Calendario. Los juegos BYE no se contabilizan.
            </div>
          </div>
        )}

        {/* ============ MODAL: ACCIONES DEL ENCUENTRO (engranaje) ============ */}
        {menuPartidoAbierto && (() => {
          const p = partidosLiga.find((x) => x.id === menuPartidoAbierto);
          if (!p) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setMenuPartidoAbierto(null)}>
              <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
                style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
                onClick={(e) => e.stopPropagation()}>
                <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>
                  {p.bye ? "Descanso (BYE)" : `${p.local} vs. ${p.visitante}`}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setMenuPartidoAbierto(null); abrirEditarPartido(p); }}
                    className="w-full py-3 rounded-lg font-semibold text-sm"
                    style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Editar encuentro</button>
                  <button onClick={() => { setMenuPartidoAbierto(null); eliminarPartido(p.id); }}
                    className="w-full py-3 rounded-lg font-semibold text-sm"
                    style={{ background: THEME.surface2, color: THEME.danger }}>Eliminar encuentro</button>
                  <button onClick={() => setMenuPartidoAbierto(null)}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm" style={{ color: THEME.textDim }}>Cancelar</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============ MODAL: AGREGAR JUEGO ============ */}
        {modalPartidoAbierto && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setModalPartidoAbierto(false)}>
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>Agregar juego</div>

              <button onClick={() => setEsBye((v) => !v)}
                className="w-full flex items-center justify-between mb-3 rounded-md px-3 py-2.5"
                style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                <span className="text-sm font-medium" style={{ color: THEME.text }}>Descanso (BYE)</span>
                <span className="w-11 h-6 rounded-full relative shrink-0" style={{ background: esBye ? THEME.offense : THEME.border }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ background: THEME.text, left: esBye ? "22px" : "2px", transition: "left 0.15s" }} />
                </span>
              </button>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-24">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Jornada</div>
                    <select value={jornadaPartido} onChange={(e) => setJornadaPartido(e.target.value)}
                      className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle}>
                      {opcionesJornada.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Fecha</div>
                    <input type="date" value={fechaPartido} onChange={(e) => setFechaPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Equipo local</div>
                  <select value={localCalendario} onChange={(e) => onCambiarLocalCalendario(e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                    {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                  </select>
                </div>

                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Equipo visitante</div>
                    <select value={visitanteCalendario} onChange={(e) => setVisitanteCalendario(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                      <option value="">Selecciona rival</option>
                      {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                  </div>
                )}

                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Hora</div>
                    <input type="time" value={horaPartido} onChange={(e) => setHoraPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Lugar (se llena solo con el del equipo local)</div>
                    <input value={lugarPartido} onChange={(e) => setLugarPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
              </div>

              {equipos.length === 0 && (
                <div className="text-[11px] mb-3" style={{ color: THEME.textDim }}>
                  Aún no has agregado equipos rivales — hazlo desde la pestaña Liga para poder elegirlos aquí.
                </div>
              )}
              {errorPartido && <div className="text-xs mb-3" style={{ color: THEME.danger }}>{errorPartido}</div>}

              <div className="flex gap-2">
                <button onClick={() => setModalPartidoAbierto(false)} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
                <button onClick={agregarPartidoCalendario} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.text, color: THEME.bg }}>Agregar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: EDITAR ENCUENTRO (equipos, hora, marcador, eliminar) ============ */}
        {modalEditarPartido && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarEditarPartido}>
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>Editar encuentro</div>

              <button onClick={() => setModalEditarPartido((m) => ({ ...m, bye: !m.bye }))}
                className="w-full flex items-center justify-between mb-3 rounded-md px-3 py-2.5"
                style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                <span className="text-sm font-medium" style={{ color: THEME.text }}>Descanso (BYE)</span>
                <span className="w-11 h-6 rounded-full relative shrink-0" style={{ background: modalEditarPartido.bye ? THEME.offense : THEME.border }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ background: THEME.text, left: modalEditarPartido.bye ? "22px" : "2px", transition: "left 0.15s" }} />
                </span>
              </button>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-24">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Jornada</div>
                    <select value={modalEditarPartido.jornada}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, jornada: e.target.value }))}
                      className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle}>
                      <option value="">–</option>
                      {opcionesJornada.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Fecha</div>
                    <input type="date" value={modalEditarPartido.fecha}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, fecha: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Equipo local</div>
                  <select value={modalEditarPartido.local} onChange={(e) => onCambiarLocalEdicion(e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                    {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                  </select>
                </div>

                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Equipo visitante</div>
                    <select value={modalEditarPartido.visitante} onChange={(e) => setModalEditarPartido((m) => ({ ...m, visitante: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                      <option value="">Selecciona rival</option>
                      {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                  </div>
                )}

                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Hora</div>
                    <input type="time" value={modalEditarPartido.hora}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, hora: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim, opacity: 0.65 }}>Lugar</div>
                    <input value={modalEditarPartido.lugar}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, lugar: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}

                {!modalEditarPartido.bye && sesion.tipo === "creador" && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1">
                      <div className="text-[10px] f-mono uppercase mb-1 truncate" style={{ color: THEME.textDim }}>{modalEditarPartido.local || "Local"}</div>
                      <input value={modalEditarPartido.marcadorLocal}
                        onChange={(e) => setModalEditarPartido((m) => ({ ...m, marcadorLocal: e.target.value.replace(/[^0-9]/g, "") }))}
                        className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
                    </div>
                    <span className="f-mono text-sm mt-4" style={{ color: THEME.textDim }}>–</span>
                    <div className="flex-1">
                      <div className="text-[10px] f-mono uppercase mb-1 truncate" style={{ color: THEME.textDim }}>{modalEditarPartido.visitante || "Visitante"}</div>
                      <input value={modalEditarPartido.marcadorVisitante}
                        onChange={(e) => setModalEditarPartido((m) => ({ ...m, marcadorVisitante: e.target.value.replace(/[^0-9]/g, "") }))}
                        className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
                    </div>
                  </div>
                )}
                {!modalEditarPartido.bye && sesion.tipo !== "creador" && (
                  <div className="rounded-md px-3 py-2.5" style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: THEME.textDim }}>Marcador</div>
                    <div className="text-sm" style={{ color: THEME.text }}>
                      {modalEditarPartido.marcadorLocal !== "" && modalEditarPartido.marcadorVisitante !== ""
                        ? `${modalEditarPartido.marcadorLocal} – ${modalEditarPartido.marcadorVisitante}`
                        : "Sin capturar"}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: THEME.textDim }}>Solo el organizador puede capturar o cambiar el marcador.</div>
                  </div>
                )}
              </div>

              {errorEditarPartido && <div className="text-xs mb-3" style={{ color: THEME.danger }}>{errorEditarPartido}</div>}

              <div className="flex gap-2 mb-2">
                <button onClick={cerrarEditarPartido} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
                <button onClick={guardarEdicionPartido} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.text, color: THEME.bg }}>Guardar</button>
              </div>
              <button onClick={eliminarDesdeModal} className="w-full py-2.5 rounded-lg font-semibold text-sm"
                style={{ color: THEME.danger }}>Eliminar encuentro</button>
            </div>
          </div>
        )}

        {/* ============ MODAL: AGREGAR/EDITAR EQUIPO ============ */}
        {modalEquipo && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalEquipo}>
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5"
              style={{ background: THEME.surface, border: `1px solid ${THEME.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: THEME.textDim }}>
                {modalEquipo.modo === "nuevo" ? "Agregar equipo" : "Editar equipo"}
              </div>
              <input type="file" accept="image/*" ref={inputFotoModalEquipo} className="hidden" onChange={onFotoModalEquipoChange} />
              <div className="flex justify-center mb-4">
                <button onClick={() => inputFotoModalEquipo.current?.click()}
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: THEME.surface2, border: `1px dashed ${THEME.border}` }}>
                  {modalEquipo.foto ? <img src={modalEquipo.foto} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xs" style={{ color: THEME.textDim }}>Logo del equipo</span>}
                </button>
              </div>
              {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: THEME.danger }}>{errorFoto}</div>}
              <div className="flex flex-col gap-2 mb-4">
                <input placeholder="Nombre del equipo" value={modalEquipo.nombre}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, nombre: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                <input placeholder="De dónde son (ciudad, estadio...)" value={modalEquipo.lugar}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, lugar: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
              </div>
              {modalEquipo.modo === "editar" && (
                <div className="text-[11px] mb-4" style={{ color: THEME.textDim }}>
                  Si cambias el nombre, se actualiza en todos los juegos del calendario donde aparece.
                </div>
              )}
              {modalEquipo.modo === "editar" && modalEquipo.pin && (
                <div className="flex items-center justify-between mb-4 rounded-md px-3 py-2.5" style={{ background: THEME.surface2, border: `1px solid ${THEME.border}` }}>
                  <div>
                    <div className="text-[10px] f-mono uppercase" style={{ color: THEME.textDim }}>PIN del equipo</div>
                    <div className="f-mono text-lg font-bold tracking-widest" style={{ color: THEME.text }}>{modalEquipo.pin}</div>
                  </div>
                  {sesion.tipo === "creador" && (
                    <button onClick={regenerarPinModal} className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: THEME.surface, color: THEME.text }}>Regenerar</button>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={cerrarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.surface2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Cancelar</button>
                <button onClick={guardarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: THEME.text, color: THEME.bg }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== FORMULARIO DE MARCADOR ============================== */

/* ============================== FIN ============================== */