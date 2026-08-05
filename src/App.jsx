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
  shadow: "0 3px 10px rgba(0,0,0,0.35)",
};

const LIGHT_THEME = {
  bg: "#F5F3EE",
  surface: "#FFFFFF",
  surface2: "#ECE8DF",
  border: "rgba(10,13,12,0.12)",
  text: "#14171A",
  textDim: "#5B6560",
  offense: "#B9822A",
  defense: "#2E5F8A",
  danger: "#A83E33",
  win: "#2F7A4B",
  tie: "#5B6560",
  bloqueo: "#9C7A18",
  shadow: "0 3px 10px rgba(10,13,12,0.10)",
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* Construye un link de Google Maps a partir del texto de ubicación (ciudad, estadio, dirección, etc.) */
const urlMapsDeLugar = (lugar) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar)}`;

/* Íconos de línea fina para el toggle de modo claro/oscuro (heredan color del texto) */
function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="4.2" y1="4.2" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.8" y2="19.8" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="4.2" y1="19.8" x2="6" y2="18" />
      <line x1="18" y1="6" x2="19.8" y2="4.2" />
    </svg>
  );
}
function MoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 14.7A8.4 8.4 0 0 1 9.3 3.5a8.6 8.6 0 1 0 11.2 11.2Z" />
    </svg>
  );
}
function PinIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}
function ChevronIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
function CalendarIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}
function RosterIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}
function TrophyIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a2 2 0 0 0 0 4 4 4 0 0 0 3.3 1.9" />
      <path d="M16 5h3a2 2 0 0 1 0 4 4 4 0 0 1-3.3 1.9" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="17" x2="12" y2="20" />
    </svg>
  );
}
function PlaybookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <path d="M8 13l3 3 5-6" />
    </svg>
  );
}
function GearIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "-2px" }}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 8.54 4.3l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
function WhistleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M13 10.5H8.2a4.2 4.2 0 1 0 0 6.5H13a3.4 3.4 0 0 0 3.4-3.4v-.1a3 3 0 0 0-3-3Z" />
      <circle cx="7" cy="13.7" r="1.1" fill="currentColor" stroke="none" />
      <path d="M16.4 11.3 20 8" />
      <path d="M18.2 6.2 20 8l1.8-1.2" />
    </svg>
  );
}
function BallIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <ellipse cx="12" cy="12" rx="7.2" ry="9.6" />
      <path d="M6.4 12h11.2" />
      <path d="M8.7 8.6l1.3 1.2M8.7 15.4l1.3-1.2M15.3 8.6l-1.3 1.2M15.3 15.4l-1.3-1.2" />
      <line x1="12" y1="9.4" x2="12" y2="14.6" />
    </svg>
  );
}
function EyeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}
/* Diagrama de jugada — el elemento de firma de la pantalla de inicio de sesión */
function PlayDiagram({ offense, defense, linea, width = 300, height = 168 }) {
  // Jugada real: "Four Verticals" (4 Verts) en shotgun 2x2, contra una defensa Cover 2
  return (
    <svg width={width} height={height} viewBox="0 0 300 168" fill="none">
      {/* Línea de golpeo */}
      <line x1="10" y1="104" x2="290" y2="104" stroke={linea} strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />

      {/* Defensa Cover 2: dos safeties profundos, dos corners, dos apoyadores */}
      <circle cx="112" cy="24" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="188" cy="24" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="22" cy="62" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="278" cy="62" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="76" cy="70" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="224" cy="70" r="6.5" stroke={defense} strokeWidth="2" />
      <circle cx="150" cy="80" r="6.5" stroke={defense} strokeWidth="2" />

      {/* Línea ofensiva */}
      <rect x="107" y="100" width="8.5" height="8.5" fill={offense} />
      <rect x="126" y="100" width="8.5" height="8.5" fill={offense} />
      <rect x="145.5" y="100" width="8.5" height="8.5" fill={offense} />
      <rect x="165" y="100" width="8.5" height="8.5" fill={offense} />
      <rect x="184" y="100" width="8.5" height="8.5" fill={offense} />

      {/* Receptores abiertos en la línea (2x2) */}
      <circle cx="22" cy="104" r="4" fill={offense} />
      <circle cx="76" cy="104" r="4" fill={offense} />
      <circle cx="224" cy="104" r="4" fill={offense} />
      <circle cx="278" cy="104" r="4" fill={offense} />
      {/* Mariscal en shotgun y corredor */}
      <circle cx="150" cy="124" r="4.5" fill={offense} />
      <circle cx="172" cy="129" r="4.5" fill={offense} />

      {/* Cuatro rutas verticales */}
      {[22, 76, 224, 278].map((x) => (
        <React.Fragment key={x}>
          <line x1={x} y1="100" x2={x} y2="16" stroke={offense} strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M${x - 5} 24 L ${x} 16 L ${x + 5} 24`} stroke={offense} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </React.Fragment>
      ))}
      {/* Ruta de escape corta del corredor */}
      <path d="M172 129 C 172 118, 168 112, 160 106" stroke={offense} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeDasharray="1 6" />
    </svg>
  );
}
/* Anillos concéntricos decorativos (como un radar de pases) — fondo de la pantalla de inicio */
function AnillosConcentricos({ color, width = 460, height = 460, cx = 230, cy = 230 }) {
  const radios = [26, 50, 74, 98, 122, 146, 170, 194, 218];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: "block" }}>
      {radios.map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke={color} strokeWidth="1" opacity="0.16" />
      ))}
    </svg>
  );
}

/* Etiqueta chica de posición dentro de un círculo hueco, estilo pizarra táctica */
function EtiquetaPosicion({ x, y, r = 9, label, color, fontSize = 7.5 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} stroke={color} strokeWidth="1.3" opacity="0.85" />
      <text x={x} y={y + fontSize * 0.34} textAnchor="middle" fontSize={fontSize} fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">{label}</text>
    </g>
  );
}

/* Diagrama de jugada grande y etiquetado — variante "superior" (Double Post / Y-Post / X Dig) */
function PlayDiagramTop({ color, dim, width = 440, height = 260 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 440 260" fill="none" style={{ display: "block" }}>
      <line x1="8" y1="196" x2="432" y2="196" stroke={dim} strokeWidth="1.3" strokeDasharray="1 8" strokeLinecap="round" opacity="0.7" />

      {/* Línea ofensiva */}
      {[176, 196, 216, 236, 256].map((x) => (
        <rect key={x} x={x} y={191.5} width="9" height="9" fill={color} opacity="0.9" />
      ))}

      {/* Posiciones etiquetadas sobre y detrás de la línea */}
      <EtiquetaPosicion x={130} y={188} label="WR" color={color} />
      <EtiquetaPosicion x={216} y={172} label="QB" color={color} />
      <EtiquetaPosicion x={196} y={196} r={7} label="C" color={color} fontSize={6.5} />
      <EtiquetaPosicion x={216} y={196} r={7} label="G" color={color} fontSize={6.5} />
      <EtiquetaPosicion x={256} y={196} r={7} label="T" color={color} fontSize={6.5} />
      <EtiquetaPosicion x={326} y={188} label="TE" color={color} />
      <EtiquetaPosicion x={216} y={228} label="RB" color={color} />

      {/* Rutas verticales cortas */}
      <line x1="80" y1="192" x2="80" y2="128" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      <line x1="368" y1="192" x2="368" y2="120" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />

      {/* Y-Post: ruta del slot que corta al poste */}
      <path d="M130 179 C 128 140, 150 108, 190 84" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M183 90 L 190 84 L 189 93" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text x="196" y="82" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Y-Post</text>

      {/* X Dig: ruta que cruza desde el extremo hacia el medio */}
      <path d="M368 184 C 340 150, 300 128, 250 118" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M259 122 L 250 118 L 257 111" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text x="366" y="106" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">X Dig</text>

      {/* Double Post: dos rutas convergiendo profundo */}
      <path d="M326 179 C 322 130, 330 96, 356 64" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M349 71 L 356 64 L 358 74" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M256 187 C 280 130, 310 88, 356 64" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <text x="284" y="52" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Double Post</text>

      {/* Check-and-Release del corredor */}
      <path d="M216 219 C 210 210, 210 202, 216 196" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="1 6" opacity="0.8" />
      <text x="170" y="248" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Check-and-Release</text>
    </svg>
  );
}

/* Diagrama de jugada grande y etiquetado — variante "inferior" (Blitz / Z-Post / Y-Post), en miniatura */
function PlayDiagramBottom({ color, dim, width = 360, height = 220 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 360 220" fill="none" style={{ display: "block" }}>
      <line x1="6" y1="140" x2="354" y2="140" stroke={dim} strokeWidth="1.2" strokeDasharray="1 8" strokeLinecap="round" opacity="0.7" />

      {[142, 160, 178, 196, 214].map((x) => (
        <rect key={x} x={x} y={135.5} width="8" height="8" fill={color} opacity="0.9" />
      ))}

      <EtiquetaPosicion x={90} y={132} r={8} label="WR" color={color} fontSize={7} />
      <EtiquetaPosicion x={178} y={116} r={8} label="QB" color={color} fontSize={7} />
      <EtiquetaPosicion x={160} y={140} r={6} label="C" color={color} fontSize={5.5} />
      <EtiquetaPosicion x={178} y={140} r={6} label="G" color={color} fontSize={5.5} />
      <EtiquetaPosicion x={214} y={140} r={6} label="T" color={color} fontSize={5.5} />
      <EtiquetaPosicion x={274} y={132} r={8} label="WR" color={color} fontSize={7} />
      <EtiquetaPosicion x={178} y={168} r={8} label="RB" color={color} fontSize={7} />

      <path d="M90 124 C 88 92, 104 66, 134 44" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M127 50 L 134 44 L 133 53" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text x="140" y="42" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Z-Post</text>

      <line x1="274" y1="124" x2="274" y2="70" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      <path d="M267 78 L 274 70 L 281 78" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text x="238" y="60" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Y-Post</text>

      <path d="M20 40 L 46 16" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      <path d="M39 16 L 46 16 L 46 23" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text x="16" y="30" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Blitz</text>

      <path d="M178 160 C 172 152, 172 146, 178 140" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeDasharray="1 6" opacity="0.8" />
      <text x="132" y="196" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill={color} opacity="0.85">Check-and-Release</text>
    </svg>
  );
}

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

/* Versión compacta, sin día de la semana — para subtítulos donde el espacio es limitado */
function formatearFechaCorta(fechaStr) {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-").map(Number);
  if (!y || !m || !d) return fechaStr;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/* Rango de fechas de una lista de partidos (para el subtítulo de cada jornada) */
function rangoFechas(items) {
  const fechas = items.map((i) => i.fecha).filter(Boolean).sort();
  if (fechas.length === 0) return "";
  const primera = fechas[0];
  const ultima = fechas[fechas.length - 1];
  return primera === ultima ? formatearFechaCorta(primera) : `${formatearFechaCorta(primera)} – ${formatearFechaCorta(ultima)}`;
}

function formatearHora(horaStr) {
  if (!horaStr) return "";
  const [h, min] = horaStr.split(":").map(Number);
  if (Number.isNaN(h)) return horaStr;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

/* Registro de criterios de desempate disponibles para la tabla de posiciones.
   Cada cmp(a, b) sigue la convención de Array.sort: valor positivo = "a" queda después de "b". */
const CRITERIOS_DESEMPATE_DISPONIBLES = [
  { id: "victorias", label: "Más victorias", cmp: (a, b) => b.g - a.g },
  { id: "diferencial", label: "Mejor diferencial de puntos", cmp: (a, b) => (b.pf - b.pc) - (a.pf - a.pc) },
  { id: "puntosFavor", label: "Más puntos anotados", cmp: (a, b) => b.pf - a.pf },
  { id: "puntosContra", label: "Menos puntos recibidos", cmp: (a, b) => a.pc - b.pc },
  { id: "menosDerrotas", label: "Menos derrotas", cmp: (a, b) => a.p - b.p },
  {
    id: "enfrentamientoDirecto", label: "Enfrentamiento directo (cabeza a cabeza)",
    cmp: (a, b, partidosLiga) => {
      let victoriasA = 0, victoriasB = 0;
      (partidosLiga || []).forEach((j) => {
        if (j.bye || j.marcadorLocal == null || j.marcadorVisitante == null) return;
        const equiposDelJuego = [j.local, j.visitante];
        if (!equiposDelJuego.includes(a.nombre) || !equiposDelJuego.includes(b.nombre)) return;
        const golesA = j.local === a.nombre ? j.marcadorLocal : j.marcadorVisitante;
        const golesB = j.local === b.nombre ? j.marcadorLocal : j.marcadorVisitante;
        if (golesA > golesB) victoriasA += 1;
        else if (golesB > golesA) victoriasB += 1;
      });
      return victoriasB - victoriasA;
    },
  },
];
const CRITERIOS_DESEMPATE_DEFECTO = ["victorias", "diferencial", "puntosFavor", "puntosContra"];

/* Calcula la tabla de posiciones a partir del calendario. Los juegos BYE no cuentan.
   `criteriosDesempate` es un arreglo ordenado de ids (ver CRITERIOS_DESEMPATE_DISPONIBLES) que el
   organizador puede configurar; se aplican en orden hasta romper el empate. */
function calcularTablaLiga(partidosLiga, equipoPropio, criteriosDesempate = CRITERIOS_DESEMPATE_DEFECTO) {
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
  const criterios = (criteriosDesempate && criteriosDesempate.length ? criteriosDesempate : CRITERIOS_DESEMPATE_DEFECTO)
    .map((id) => CRITERIOS_DESEMPATE_DISPONIBLES.find((c) => c.id === id))
    .filter(Boolean);
  return Object.values(stats)
    .map((row) => ({ ...row, esPropio: row.nombre === equipoPropio }))
    .sort((a, b) => {
      for (const criterio of criterios) {
        const r = criterio.cmp(a, b, partidosLiga);
        if (r !== 0) return r;
      }
      return a.nombre.localeCompare(b.nombre);
    });
}

/* ============================== PLAYOFFS ============================== */

/* Formatos de playoffs disponibles. `equipos` = cuántos clasifican de la tabla (semilla 1 = mejor lugar). */
const FORMATOS_PLAYOFFS = [
  { id: "final", label: "Final directa", equipos: 2, rondas: ["Final"] },
  { id: "semifinal", label: "Semifinales", equipos: 4, rondas: ["Semifinal", "Final"] },
  { id: "cuartos", label: "Cuartos de final", equipos: 8, rondas: ["Cuartos de Final", "Semifinal", "Final"] },
];

/* Arma la primera ronda con semilla estándar (1 vs. última, 2 vs. penúltima, ...) a partir de la tabla,
   y deja las rondas siguientes vacías ("por definir") listas para irse llenando con los ganadores. */
function generarBracketPlayoffs(formatoId, filasLiga) {
  const formato = FORMATOS_PLAYOFFS.find((f) => f.id === formatoId);
  if (!formato) return null;
  const clasificados = filasLiga.slice(0, formato.equipos);
  const primeraRonda = [];
  for (let i = 0; i < Math.ceil(formato.equipos / 2); i++) {
    const alto = clasificados[i];
    const bajo = clasificados[formato.equipos - 1 - i];
    primeraRonda.push({
      id: uid(),
      equipoA: alto ? alto.nombre : null, seedA: alto ? i + 1 : null,
      equipoB: (bajo && bajo !== alto) ? bajo.nombre : null, seedB: (bajo && bajo !== alto) ? formato.equipos - i : null,
      marcadorA: "", marcadorB: "",
    });
  }
  const rondas = [primeraRonda];
  let numPartidosAnterior = primeraRonda.length;
  for (let r = 1; r < formato.rondas.length; r++) {
    const numPartidos = Math.max(1, Math.ceil(numPartidosAnterior / 2));
    rondas.push(Array.from({ length: numPartidos }, () => ({
      id: uid(), equipoA: null, seedA: null, equipoB: null, seedB: null, marcadorA: "", marcadorB: "",
    })));
    numPartidosAnterior = numPartidos;
  }
  return { formato: formatoId, rondas };
}

/* El ganador de un cruce solo se determina si ambos marcadores están capturados y no hay empate */
function ganadorDeCruce(p) {
  if (!p.equipoA || !p.equipoB) return null;
  if (p.marcadorA === "" || p.marcadorB === "" || p.marcadorA == null || p.marcadorB == null) return null;
  const a = Number(p.marcadorA), b = Number(p.marcadorB);
  if (Number.isNaN(a) || Number.isNaN(b) || a === b) return null;
  return a > b ? { nombre: p.equipoA, seed: p.seedA } : { nombre: p.equipoB, seed: p.seedB };
}

/* Propaga los ganadores de cada ronda hacia los cruces (todavía vacíos) de la ronda siguiente */
function avanzarGanadoresBracket(bracket) {
  if (!bracket) return bracket;
  const rondas = bracket.rondas.map((r) => r.map((p) => ({ ...p })));
  for (let r = 0; r < rondas.length - 1; r++) {
    for (let i = 0; i < rondas[r].length; i++) {
      const ganador = ganadorDeCruce(rondas[r][i]);
      const destino = rondas[r + 1][Math.floor(i / 2)];
      if (!destino) continue;
      if (i % 2 === 0) { destino.equipoA = ganador?.nombre ?? null; destino.seedA = ganador?.seed ?? null; }
      else { destino.equipoB = ganador?.nombre ?? null; destino.seedB = ganador?.seed ?? null; }
    }
  }
  return { ...bracket, rondas };
}

/* ¿El bracket ya tiene algún resultado capturado? (para avisar antes de sobrescribirlo) */
function bracketTieneResultados(bracket) {
  if (!bracket) return false;
  return bracket.rondas.some((r) => r.some((p) => p.marcadorA !== "" || p.marcadorB !== ""));
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
  const [datosEquipoCargados, setDatosEquipoCargados] = useState(false); // evita guardar antes de terminar de leer el roster guardado
  const [partidosLiga, setPartidosLiga] = useState([]); // calendario único de la liga activa (compartido)
  const [fechaLimiteRoster, setFechaLimiteRoster] = useState(""); // fecha límite para que los equipos registren jugadores
  const [ligaFoto, setLigaFoto] = useState(null); // foto de la liga (editable solo por el organizador)
  const [criteriosDesempate, setCriteriosDesempate] = useState(CRITERIOS_DESEMPATE_DEFECTO); // orden de criterios de desempate de la tabla (editable solo por el organizador)
  const [playoffsFormato, setPlayoffsFormato] = useState(null); // 'final' | 'semifinal' | 'cuartos' | null (playoffs aún no configurados)
  const [playoffsBracket, setPlayoffsBracket] = useState(null); // { formato, rondas: [[{id, equipoA, seedA, equipoB, seedB, marcadorA, marcadorB}, ...], ...] }
  const [anotadores, setAnotadores] = useState([]); // máximos anotadores de la liga (compartido): [{id, equipoId, equipoNombre, jugadorId, jugadorNombre, jugadorNumero, jugadorPosicion, jugadorFoto, anotaciones}]
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
  const [creandoLiga, setCreandoLiga] = useState(false);
  const [entrandoConPin, setEntrandoConPin] = useState(false);
  const [intentosFallidosPin, setIntentosFallidosPin] = useState(0);
  const [pinBloqueado, setPinBloqueado] = useState(false);
  const registrarIntentoFallidoPin = () => {
    setIntentosFallidosPin((prev) => {
      const nuevo = prev + 1;
      if (nuevo >= 5) {
        setPinBloqueado(true);
        setTimeout(() => { setPinBloqueado(false); setIntentosFallidosPin(0); }, 30000);
      }
      return nuevo;
    });
  };

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
  const inputFotoLiga = useRef(null);
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
  const [menuPrincipalAbierto, setMenuPrincipalAbierto] = useState(false); // dropdown corto del ☰: Equipos / Cuenta
  const [vistaEquiposAbierta, setVistaEquiposAbierta] = useState(false); // pantalla completa con el listado de equipos
  const [modalCuenta, setModalCuenta] = useState(false); // pop up con las opciones de cuenta
  const [modalDesempates, setModalDesempates] = useState(null); // arreglo temporal de ids en edición, o null si el modal está cerrado
  const [modalPlayoffs, setModalPlayoffs] = useState(null); // id de formato en edición dentro del modal, o null si el modal está cerrado

  // Eliminar liga por completo (requiere el PIN de organizador)
  const [modalEliminarLiga, setModalEliminarLiga] = useState(false);
  const [pinEliminarLigaInput, setPinEliminarLigaInput] = useState("");
  const [errorEliminarLiga, setErrorEliminarLiga] = useState("");
  const [eliminandoLiga, setEliminandoLiga] = useState(false);

  // Cambiar PIN de la cuenta de organizador
  const [modalCambiarPin, setModalCambiarPin] = useState(false);
  const [pinActualInput, setPinActualInput] = useState("");
  const [pinNuevoInput, setPinNuevoInput] = useState("");
  const [pinNuevoConfirmarInput, setPinNuevoConfirmarInput] = useState("");
  const [errorCambiarPin, setErrorCambiarPin] = useState("");

  // Confirmación genérica antes de acciones destructivas (borrar jugador/equipo/jugada, etc.)
  const [confirmacion, setConfirmacion] = useState(null); // { titulo, mensaje, onConfirmar }
  const pedirConfirmacion = (titulo, mensaje, onConfirmar) => setConfirmacion({ titulo, mensaje, onConfirmar });
  const cerrarConfirmacion = () => setConfirmacion(null);
  const ejecutarConfirmacion = () => {
    if (confirmacion?.onConfirmar) confirmacion.onConfirmar();
    setConfirmacion(null);
  };

  // El organizador puede ver el roster de cualquier equipo de la liga, bajo demanda
  const [rostersAbiertos, setRostersAbiertos] = useState({}); // { [equipoId]: bool }
  const [rostersEquipos, setRostersEquipos] = useState({}); // { [equipoId]: { jugadores: [], cargando: bool, cargado: bool } }
  const cargarRosterEquipo = async (equipoId) => {
    setRostersEquipos((prev) => ({ ...prev, [equipoId]: { jugadores: prev[equipoId]?.jugadores || [], cargando: true, cargado: false } }));
    try {
      const res = await window.storage.get(`mi-equipo-datos-${ligaId}-${equipoId}`, true);
      const mio = res?.value ? JSON.parse(res.value) : { jugadores: [] };
      setRostersEquipos((prev) => ({ ...prev, [equipoId]: { jugadores: mio.jugadores ?? [], cargando: false, cargado: true } }));
    } catch (e) {
      setRostersEquipos((prev) => ({ ...prev, [equipoId]: { jugadores: [], cargando: false, cargado: true } }));
    }
  };
  const toggleRosterEquipo = (equipoId) => {
    setRostersAbiertos((prev) => ({ ...prev, [equipoId]: !prev[equipoId] }));
  };
  // Ver el roster de un equipo desde la pantalla "Equipos" (por ejemplo, sesión de equipo consultando a un rival)
  const [modalRosterEquipo, setModalRosterEquipo] = useState(null); // equipoId | null
  const abrirRosterEquipo = (equipoId) => {
    if (!rostersEquipos[equipoId]) cargarRosterEquipo(equipoId);
    setModalRosterEquipo(equipoId);
  };
  // Precarga el conteo de jugadores de todos los equipos en cuanto se entra al tab Roster,
  // así el número se ve de inmediato sin tener que expandir cada equipo.
  useEffect(() => {
    if (tab !== "roster" || !(sesion?.tipo === "creador" || sesion?.tipo === "visitante") || !ligaId) return;
    equipos.forEach((eq) => {
      if (!rostersEquipos[eq.id]) cargarRosterEquipo(eq.id);
    });
  }, [tab, sesion, ligaId, equipos]);

  // Modo claro / oscuro. Preferencia guardada solo en este dispositivo (no es data de la liga).
  const [modoClaro, setModoClaro] = useState(() => {
    try { return localStorage.getItem("modo-claro") === "1"; } catch (e) { return false; }
  });
  const toggleModo = () => {
    setModoClaro((v) => {
      const nuevo = !v;
      try { localStorage.setItem("modo-claro", nuevo ? "1" : "0"); } catch (e) { /* no-op */ }
      return nuevo;
    });
  };
  const activeTheme = modoClaro ? LIGHT_THEME : THEME;

  // Detecta si el dispositivo pierde conexión, para avisar que los cambios no se están guardando
  const [enLinea, setEnLinea] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  useEffect(() => {
    const marcarOnline = () => setEnLinea(true);
    const marcarOffline = () => setEnLinea(false);
    window.addEventListener("online", marcarOnline);
    window.addEventListener("offline", marcarOffline);
    return () => {
      window.removeEventListener("online", marcarOnline);
      window.removeEventListener("offline", marcarOffline);
    };
  }, []);

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
              setDatosEquipoCargados(true);
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
        await window.storage.set(`liga-datos-${ligaId}`, JSON.stringify({ nombre: ligaNombre, pinCreador, equipos, partidosLiga, fechaLimiteRoster, foto: ligaFoto, anotadores, criteriosDesempate, playoffsFormato, playoffsBracket }), true);
        // Mantiene sincronizado el índice liviano (nombre + foto) que se usa en el selector de ligas del login
        const res = await window.storage.get("ligas-indice", true).catch(() => null);
        const lista = res?.value ? JSON.parse(res.value) : [];
        const entrada = lista.find((l) => l.id === ligaId);
        if (entrada && (entrada.nombre !== ligaNombre || entrada.foto !== ligaFoto)) {
          const actualizada = lista.map((l) => (l.id === ligaId ? { ...l, nombre: ligaNombre, foto: ligaFoto } : l));
          await window.storage.set("ligas-indice", JSON.stringify(actualizada), true);
          setLigasIndice(actualizada);
        }
      } catch (e) { console.error("Error guardando liga", e); }
    })();
  }, [ligaId, ligaNombre, pinCreador, equipos, partidosLiga, fechaLimiteRoster, ligaFoto, anotadores, criteriosDesempate, playoffsFormato, playoffsBracket, cargado]);

  // Guardar mi plantilla/jugadas personales (solo si tengo sesión de equipo).
  // Se guarda como dato COMPARTIDO de la liga (bajo una llave única por equipo) para que
  // cualquiera que entre con el PIN de ese equipo, desde cualquier dispositivo, vea lo mismo.
  useEffect(() => {
    if (!cargado || !datosEquipoCargados || !sesion || sesion.tipo !== "equipo") return;
    (async () => {
      try {
        await window.storage.set(`mi-equipo-datos-${sesion.ligaId}-${sesion.equipoId}`, JSON.stringify({ jugadores, jugadas }), true);
      } catch (e) { console.error("Error guardando mi equipo", e); }
    })();
  }, [jugadores, jugadas, cargado, sesion, datosEquipoCargados]);

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
      setFechaLimiteRoster(liga.fechaLimiteRoster ?? "");
      setLigaFoto(liga.foto ?? null);
      setAnotadores(liga.anotadores ?? []);
      setCriteriosDesempate(liga.criteriosDesempate?.length ? liga.criteriosDesempate : CRITERIOS_DESEMPATE_DEFECTO);
      setPlayoffsFormato(liga.playoffsFormato ?? null);
      setPlayoffsBracket(liga.playoffsBracket ?? null);
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
    setCreandoLiga(true);
    try {
      const lista = ligasIndice || (await cargarIndiceLigas());
      const nuevaLista = [...lista, { id: nuevoId, nombre: nombreLigaInput.trim(), foto: null }];
      await window.storage.set("ligas-indice", JSON.stringify(nuevaLista), true);
      setLigasIndice(nuevaLista);
      await window.storage.set(`liga-datos-${nuevoId}`, JSON.stringify({ nombre: nombreLigaInput.trim(), pinCreador: pinCreadorInput.trim(), equipos: [], partidosLiga: [], fechaLimiteRoster: "", foto: null, anotadores: [], criteriosDesempate: CRITERIOS_DESEMPATE_DEFECTO, playoffsFormato: null, playoffsBracket: null }), true);
      setLigaId(nuevoId);
      setLigaNombre(nombreLigaInput.trim());
      setPinCreador(pinCreadorInput.trim());
      setEquipos([]); setPartidosLiga([]); setFechaLimiteRoster(""); setLigaFoto(null); setAnotadores([]);
      const s = { tipo: "creador", ligaId: nuevoId };
      setSesion(s);
      setTab("calendario");
      await window.storage.set("sesion", JSON.stringify(s), false);
    } catch (err) {
      console.error("Error creando la liga", err);
      const detalle = (err && (err.message || err.toString())) || "error desconocido";
      setErrorLogin(`No se pudo guardar: ${detalle}`);
    } finally {
      setCreandoLiga(false);
    }
  };

  const confirmarPinOrganizador = () => {
    setErrorLogin("");
    if (pinBloqueado) { setErrorLogin("Demasiados intentos fallidos. Espera 30 segundos e intenta de nuevo."); return; }
    if (pinCreadorInput.trim() !== pinCreador) {
      registrarIntentoFallidoPin();
      setErrorLogin("PIN de organizador incorrecto.");
      return;
    }
    setIntentosFallidosPin(0);
    const s = { tipo: "creador", ligaId };
    setSesion(s);
    setTab("calendario");
    window.storage.set("sesion", JSON.stringify(s), false).catch(() => {});
  };

  const confirmarPinEquipo = () => {
    setErrorLogin("");
    if (pinBloqueado) { setErrorLogin("Demasiados intentos fallidos. Espera 30 segundos e intenta de nuevo."); return; }
    const encontrado = equipos.find((e) => e.pin === pinEquipoInput.trim());
    if (!encontrado) {
      registrarIntentoFallidoPin();
      setErrorLogin("Ese PIN no corresponde a ningún equipo de esta liga.");
      return;
    }
    setIntentosFallidosPin(0);
    const s = { tipo: "equipo", ligaId, equipoId: encontrado.id };
    setDatosEquipoCargados(false);
    setJugadores([]); setJugadas([]);
    setTab("plantilla");
    setEntrandoConPin(true);
    window.storage.set("sesion", JSON.stringify(s), false).catch(() => {});
    window.storage.get(`mi-equipo-datos-${ligaId}-${encontrado.id}`, true).then((res) => {
      if (res?.value) {
        const mio = JSON.parse(res.value);
        setJugadores(mio.jugadores ?? []);
        setJugadas((mio.jugadas ?? []).map((j) => ({ ...j, asignaciones: j.asignaciones || j.rutas || [] })));
      }
    }).catch(() => {}).finally(() => {
      setDatosEquipoCargados(true);
      setSesion(s);
      setEntrandoConPin(false);
    });
  };

  const volverLogin = () => {
    setPantallaLogin("menu"); setContextoLogin(null); setLigaElegida(null); setErrorLogin("");
    setNombreLigaInput(""); setPinCreadorInput(""); setPinEquipoInput("");
  };

  const cerrarSesion = () => {
    setSesion(null);
    setMenuPrincipalAbierto(false);
    setVistaEquiposAbierta(false);
    setModalCuenta(false);
    setJugadores([]); setJugadas([]);
    setDatosEquipoCargados(false);
    setLigaId(null); setLigaNombre(""); setPinCreador(""); setEquipos([]); setPartidosLiga([]); setFechaLimiteRoster(""); setLigaFoto(null); setAnotadores([]); setCriteriosDesempate(CRITERIOS_DESEMPATE_DEFECTO);
    setPlayoffsFormato(null); setPlayoffsBracket(null);
    setLigasIndice(null); setLigaElegida(null);
    setPantallaLogin("menu"); setContextoLogin(null);
    setNombreLigaInput(""); setPinCreadorInput(""); setPinEquipoInput(""); setErrorLogin("");
    setIntentosFallidosPin(0); setPinBloqueado(false);
    window.storage.set("sesion", "", false).catch(() => {});
  };

  const abrirModalEliminarLiga = () => {
    setModalCuenta(false);
    setPinEliminarLigaInput("");
    setErrorEliminarLiga("");
    setModalEliminarLiga(true);
  };
  const cerrarModalEliminarLiga = () => {
    setModalEliminarLiga(false);
    setPinEliminarLigaInput("");
    setErrorEliminarLiga("");
  };

  const confirmarEliminarLiga = async () => {
    setErrorEliminarLiga("");
    if (pinEliminarLigaInput.trim() !== pinCreador) {
      setErrorEliminarLiga("PIN de organizador incorrecto.");
      return;
    }
    setEliminandoLiga(true);
    try {
      // Borra los datos personales de cada equipo (plantilla y playbook)
      await Promise.all(
        equipos.map((eq) =>
          window.storage.delete(`mi-equipo-datos-${ligaId}-${eq.id}`, true).catch(() => {})
        )
      );
      // Borra los datos compartidos de la liga (equipos, calendario, PIN de organizador)
      await window.storage.delete(`liga-datos-${ligaId}`, true).catch(() => {});
      // Quita la liga del índice compartido para que ya no aparezca en el selector
      const lista = ligasIndice || (await cargarIndiceLigas());
      const nuevaLista = (lista || []).filter((l) => l.id !== ligaId);
      await window.storage.set("ligas-indice", JSON.stringify(nuevaLista), true).catch(() => {});
      setLigasIndice(nuevaLista);
      setModalEliminarLiga(false);
      cerrarSesion();
    } catch (err) {
      console.error("Error eliminando la liga", err);
      setErrorEliminarLiga("No se pudo eliminar la liga. Intenta de nuevo.");
    } finally {
      setEliminandoLiga(false);
    }
  };

  const abrirModalCambiarPin = () => {
    setModalCuenta(false);
    setPinActualInput("");
    setPinNuevoInput("");
    setPinNuevoConfirmarInput("");
    setErrorCambiarPin("");
    setModalCambiarPin(true);
  };
  const cerrarModalCambiarPin = () => {
    setModalCambiarPin(false);
    setPinActualInput("");
    setPinNuevoInput("");
    setPinNuevoConfirmarInput("");
    setErrorCambiarPin("");
  };

  const confirmarCambiarPin = () => {
    setErrorCambiarPin("");
    if (pinActualInput.trim() !== pinCreador) {
      setErrorCambiarPin("El PIN actual es incorrecto.");
      return;
    }
    if (!pinNuevoInput.trim() || pinNuevoInput.trim().length < 4) {
      setErrorCambiarPin("El nuevo PIN debe tener al menos 4 dígitos.");
      return;
    }
    if (pinNuevoInput.trim() === pinActualInput.trim()) {
      setErrorCambiarPin("El nuevo PIN debe ser distinto al actual.");
      return;
    }
    if (equipos.some((e) => e.pin === pinNuevoInput.trim())) {
      setErrorCambiarPin("Ese PIN ya lo usa un equipo de la liga. Elige otro.");
      return;
    }
    if (pinNuevoInput.trim() !== pinNuevoConfirmarInput.trim()) {
      setErrorCambiarPin("Los PIN nuevos no coinciden.");
      return;
    }
    setPinCreador(pinNuevoInput.trim());
    cerrarModalCambiarPin();
  };

  /* ---------- desempates de la tabla de posiciones (solo organizador) ---------- */
  const abrirModalDesempates = () => setModalDesempates([...criteriosDesempate]);
  const cerrarModalDesempates = () => setModalDesempates(null);
  const toggleCriterioDesempate = (id) => {
    setModalDesempates((actual) => {
      if (actual.includes(id)) {
        if (actual.length === 1) return actual; // siempre debe quedar al menos un criterio activo
        return actual.filter((c) => c !== id);
      }
      return [...actual, id];
    });
  };
  const moverCriterioDesempate = (indice, direccion) => {
    setModalDesempates((actual) => {
      const nuevo = [...actual];
      const destino = indice + direccion;
      if (destino < 0 || destino >= nuevo.length) return actual;
      [nuevo[indice], nuevo[destino]] = [nuevo[destino], nuevo[indice]];
      return nuevo;
    });
  };
  const guardarModalDesempates = () => {
    if (modalDesempates && modalDesempates.length) setCriteriosDesempate(modalDesempates);
    cerrarModalDesempates();
  };

  /* ---------- playoffs (solo organizador configura el formato y captura resultados) ---------- */
  const abrirModalPlayoffs = () => setModalPlayoffs(playoffsFormato || "final");
  const cerrarModalPlayoffs = () => setModalPlayoffs(null);

  const generarBracketConTablaActual = (formatoId) => {
    setPlayoffsFormato(formatoId);
    setPlayoffsBracket(generarBracketPlayoffs(formatoId, filasLiga));
  };

  const confirmarFormatoPlayoffs = () => {
    const formatoId = modalPlayoffs;
    cerrarModalPlayoffs();
    const cambiaFormato = formatoId !== playoffsFormato;
    const hayResultados = bracketTieneResultados(playoffsBracket);
    if (!playoffsBracket || cambiaFormato) {
      if (hayResultados) {
        pedirConfirmacion("Cambiar formato de playoffs",
          "Ya hay resultados capturados en el bracket actual. Cambiar el formato genera un bracket nuevo con la tabla de posiciones vigente y se pierden los resultados capturados. ¿Continuar?",
          () => generarBracketConTablaActual(formatoId));
      } else {
        generarBracketConTablaActual(formatoId);
      }
    }
  };

  const desactivarPlayoffs = () => {
    cerrarModalPlayoffs();
    pedirConfirmacion("Desactivar playoffs", "Se ocultará la sección de playoffs y se perderá el bracket y los resultados capturados. ¿Continuar?", () => {
      setPlayoffsFormato(null);
      setPlayoffsBracket(null);
    });
  };

  const regenerarBracketPlayoffs = () => {
    if (!playoffsFormato) return;
    const hayResultados = bracketTieneResultados(playoffsBracket);
    const accion = () => generarBracketConTablaActual(playoffsFormato);
    if (hayResultados) {
      pedirConfirmacion("Actualizar sedes con la tabla actual", "Se vuelve a armar el bracket desde cero usando la tabla de posiciones vigente y se pierden los resultados ya capturados. ¿Continuar?", accion);
    } else {
      accion();
    }
  };

  const actualizarMarcadorPlayoff = (rondaIdx, partidoIdx, campo, valor) => {
    setPlayoffsBracket((actual) => {
      if (!actual) return actual;
      const rondas = actual.rondas.map((r, ri) => ri !== rondaIdx ? r : r.map((p, pi) => pi !== partidoIdx ? p : { ...p, [campo]: valor }));
      return avanzarGanadoresBracket({ ...actual, rondas });
    });
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
  const eliminarJugador = (id) => {
    const j = jugadores.find((x) => x.id === id);
    pedirConfirmacion("Eliminar jugador", `¿Eliminar a ${j?.nombre || "este jugador"} de la plantilla? No se puede deshacer.`, () => {
      setJugadores((js) => js.filter((x) => x.id !== id));
    });
  };

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

  const onFotoLigaChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErrorFoto("");
    try {
      const dataUrl = await resizeImagen(f, 240);
      setLigaFoto(dataUrl);
    } catch (err) {
      setErrorFoto(err.message || "No se pudo cargar la imagen.");
    }
    e.target.value = "";
  };

  // ---- modal de jugador guardado (ver / editar) ----
  const abrirVistaJugador = (j, soloLectura = false) => setJugadorModal({ ...j, modo: "ver", soloLectura });
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
  const fechaLimiteRosterPasada = !!fechaLimiteRoster && new Date(`${fechaLimiteRoster}T23:59:59`) < new Date();

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
  const eliminarJugada = (id) => {
    const j = jugadas.find((x) => x.id === id);
    pedirConfirmacion("Eliminar jugada", `¿Eliminar "${j?.nombre || "esta jugada"}" del playbook? No se puede deshacer.`, () => {
      setJugadas((js) => js.filter((x) => x.id !== id));
    });
  };

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
  const colorResultado = (r) => (r === "G" ? activeTheme.win : r === "P" ? activeTheme.danger : activeTheme.tie);
  const textoResultado = (r) => (r === "G" ? "Ganado" : r === "P" ? "Perdido" : "Empate");

  const fotoDeEquipo = (nombreEquipo) => {
    const eq = listaEquipos.find((t) => t.nombre === nombreEquipo);
    return eq ? eq.foto : null;
  };
  const registroDeEquipo = (nombreEquipo) => {
    const fila = filasLiga.find((f) => f.nombre === nombreEquipo);
    return fila ? `${fila.g}-${fila.p}-${fila.e}` : "0-0-0";
  };

  /* Columna de equipo para las tarjetas del bracket de playoffs — mismo diseño que renderLogoEquipo
     del calendario (logo circular + nombre), pero con la semilla (posición en la tabla) en vez del récord. */
  const renderLogoEquipoBracket = (nombreEquipo, seed) => (
    <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
        style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
        {nombreEquipo && fotoDeEquipo(nombreEquipo)
          ? <img src={fotoDeEquipo(nombreEquipo)} alt="" className="w-full h-full object-cover" />
          : <span className="text-[10px] f-mono font-bold text-center px-1" style={{ color: activeTheme.textDim }}>{nombreEquipo || "?"}</span>}
      </div>
      <div className="text-xs font-semibold text-center truncate w-full"
        style={{ color: !nombreEquipo ? activeTheme.textDim : (nombreEquipo === equipo ? activeTheme.offense : activeTheme.text) }}>
        {nombreEquipo || "Por definir"}
      </div>
      <div className="text-[11px] f-mono" style={{ color: activeTheme.textDim }}>{seed ? `Semilla ${seed}` : "—"}</div>
    </div>
  );

  // Próximo partido: para una sesión de equipo, el siguiente juego de ESE equipo (usado en la tarjeta resumen).
  // Para admin/visitante, el siguiente juego de la liga en general (solo para resaltar la jornada próxima).
  const hoyInicioDia = new Date();
  hoyInicioDia.setHours(0, 0, 0, 0);
  const partidosOrdenadosPorFecha = [...partidosLiga].filter((p) => p.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const proximoPartido = sesion && sesion.tipo === "equipo"
    ? (partidosOrdenadosPorFecha.find((p) => (p.local === equipo || p.visitante === equipo) && new Date(`${p.fecha}T23:59:59`) >= hoyInicioDia) || null)
    : (partidosOrdenadosPorFecha.find((p) => new Date(`${p.fecha}T23:59:59`) >= hoyInicioDia) || null);
  const jornadaProxima = proximoPartido ? (proximoPartido.jornada || "Sin jornada") : null;

  // Escudo + nombre + récord de un equipo — reutilizado en la tarjeta resumen y en cada encuentro del calendario
  const renderLogoEquipo = (nombreEquipo, tamano = "w-16 h-16") => {
    const foto = fotoDeEquipo(nombreEquipo);
    return (
      <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
        <div className={`${tamano} rounded-full overflow-hidden flex items-center justify-center`}
          style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
          {foto ? <img src={foto} alt="" className="w-full h-full object-cover" />
            : <span className="text-[10px] f-mono font-bold text-center px-1" style={{ color: activeTheme.textDim }}>{nombreEquipo}</span>}
        </div>
        <div className="text-xs font-semibold text-center truncate w-full" style={{ color: nombreEquipo === equipo ? activeTheme.offense : activeTheme.text }}>{nombreEquipo}</div>
        <div className="text-[11px] f-mono" style={{ color: activeTheme.textDim }}>{registroDeEquipo(nombreEquipo)}</div>
      </div>
    );
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
  const filasLiga = calcularTablaLiga(partidosLiga, sesion && sesion.tipo === "equipo" ? equipo : null, criteriosDesempate);

  const puedeEditarEquipo = (entry) => sesion && (sesion.tipo === "creador" || (sesion.tipo === "equipo" && entry.id === sesion.equipoId));

  const abrirNuevoEquipo = () => { setModalEquipo({ modo: "nuevo", nombre: "", lugar: "", foto: null }); };
  const abrirEditarEquipo = (entry) => {
    if (!puedeEditarEquipo(entry)) return;
    setModalEquipo({ modo: "editar", esPropio: entry.esPropio, id: entry.id, nombreViejo: entry.nombre, nombre: entry.nombre, lugar: entry.lugar || "", foto: entry.foto || null, pin: entry.pin });
  };
  const cerrarModalEquipo = () => setModalEquipo(null);
  const eliminarEquipoRegistro = (id) => {
    if (!sesion || sesion.tipo !== "creador") return;
    const eq = equipos.find((x) => x.id === id);
    pedirConfirmacion("Eliminar equipo", `¿Eliminar a ${eq?.nombre || "este equipo"} de la liga? Su roster y playbook dejarán de ser accesibles. No se puede deshacer.`, () => {
      setEquipos((eqs) => eqs.filter((x) => x.id !== id));
    });
  };

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
        setAnotadores((as) => as.map((a) => (a.equipoNombre === modalEquipo.nombreViejo ? { ...a, equipoNombre: nombreNuevo } : a)));
      }
    }
    setModalEquipo(null);
  };

  /* ---------- liga: sub-tab (posiciones / estadísticas) y máximos anotadores ---------- */
  const [ligaSubTab, setLigaSubTab] = useState("posiciones"); // 'posiciones' | 'estadisticas'
  const [modalAnotador, setModalAnotador] = useState(null); // { paso: 'equipo' } | { paso: 'jugador', equipoId, equipoNombre }
  // Qué sección de Estadísticas está activa dentro de Liga (0 ofensiva, 1 defensiva, 2 anotadores)
  const [statsSlide, setStatsSlide] = useState(0);

  const filasLigaConJuegos = filasLiga.filter((f) => (f.g + f.p + f.e) > 0);
  const mejorOfensiva = [...filasLigaConJuegos].sort((a, b) => b.pf - a.pf);
  const mejorDefensiva = [...filasLigaConJuegos].sort((a, b) => a.pc - b.pc);
  const anotadoresOrdenados = [...anotadores].sort((a, b) => (b.anotaciones || 0) - (a.anotaciones || 0));

  const abrirModalAnotador = () => {
    setModalAnotador({ paso: "equipo" });
    equipos.forEach((eq) => { if (!rostersEquipos[eq.id]) cargarRosterEquipo(eq.id); });
  };
  const cerrarModalAnotador = () => setModalAnotador(null);
  const elegirEquipoAnotador = (eq) => {
    if (!rostersEquipos[eq.id]) cargarRosterEquipo(eq.id);
    setModalAnotador({ paso: "jugador", equipoId: eq.id, equipoNombre: eq.nombre });
  };
  const agregarAnotador = (jugador) => {
    setAnotadores((as) => {
      if (as.some((a) => a.jugadorId === jugador.id)) return as;
      return [...as, {
        id: uid(),
        equipoId: modalAnotador.equipoId,
        equipoNombre: modalAnotador.equipoNombre,
        jugadorId: jugador.id,
        jugadorNombre: jugador.nombre,
        jugadorNumero: jugador.numero,
        jugadorPosicion: jugador.posicion,
        jugadorFoto: jugador.foto || null,
        anotaciones: 0,
      }];
    });
    setModalAnotador(null);
  };
  const sumarAnotacion = (id) => setAnotadores((as) => as.map((a) => (a.id === id ? { ...a, anotaciones: (a.anotaciones || 0) + 1 } : a)));
  const restarAnotacion = (id) => setAnotadores((as) => as.map((a) => (a.id === id ? { ...a, anotaciones: Math.max(0, (a.anotaciones || 0) - 1) } : a)));
  const eliminarAnotador = (id) => {
    const a = anotadores.find((x) => x.id === id);
    pedirConfirmacion("Quitar anotador", `¿Quitar a ${a?.jugadorNombre || "este jugador"} de la tabla de máximos anotadores?`, () => {
      setAnotadores((as) => as.filter((x) => x.id !== id));
    });
  };

  const fuentes = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&family=Big+Shoulders+Display:wght@700;800&display=swap');
      .f-display { font-family:'Barlow Condensed',sans-serif; letter-spacing:0.02em; }
      .f-mono { font-family:'JetBrains Mono',monospace; }
      .f-score { font-family:'Big Shoulders Display',sans-serif; letter-spacing:0.01em; }
      body, input, select, button { font-family:'Inter',sans-serif; }
      /* Evita el zoom automático de iOS/Android al enfocar campos (ocurre si el font-size es menor a 16px) */
      input, select, textarea { font-size: 16px !important; }
      /* Excepción: el nombre del equipo/liga en el encabezado debe verse grande (text-3xl = 30px), no 16px */
      .header-name-input { font-size: 30px !important; }
      /* Variantes para nombres largos — el tamaño se ajusta automáticamente según la longitud del texto */
      .header-name-md { font-size: 23px !important; }
      .header-name-sm { font-size: 18px !important; }
    `}</style>
  );

  // Elige un tamaño de fuente más chico automáticamente cuando el nombre de la liga/equipo es largo,
  // así se evita que el encabezado se corte con "..."
  const claseTituloEncabezado = (texto) => {
    const len = (texto || "").length;
    if (len > 22) return "header-name-sm";
    if (len > 14) return "header-name-md";
    return "header-name-input";
  };

  const inputStyle = { background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` };

  const bannerSinConexion = !enLinea && (
    <div className="fixed top-0 left-0 right-0 z-[100] text-center text-xs font-semibold py-2"
      style={{ background: activeTheme.danger, color: "#FFFFFF" }}>
      Sin conexión — tus cambios se guardarán al reconectar
    </div>
  );

  if (!cargado) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: activeTheme.bg }}>
        {fuentes}
        {bannerSinConexion}
        <div className="text-sm f-mono" style={{ color: activeTheme.textDim }}>Cargando…</div>
      </div>
    );
  }

  if (!sesion) {
    // La pantalla de inicio de sesión siempre usa la estética navy + dorado (independiente del modo claro/oscuro del resto de la app)
    const loginBg = "#0B1220";
    const loginBg2 = "#0E1A2E";
    const loginGold = "#D9A441";
    const loginGoldSoft = "#C9A227";
    const loginLine = "rgba(217,164,65,0.35)";
    const loginTextDim = "#8A97AC";
    const loginInputStyle = { background: "rgba(255,255,255,0.05)", color: "#EDEFEA", border: `1px solid ${loginLine}` };
    return (
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse 900px 700px at 50% 0%, ${loginBg2}, ${loginBg} 70%)` }}>
        {fuentes}
        {bannerSinConexion}

        {/* Anillos concéntricos decorativos, centrados detrás del contenido */}
        <div className="absolute pointer-events-none" style={{ top: "-8%", left: "50%", transform: "translateX(-50%)", opacity: 0.9 }}>
          <AnillosConcentricos color={loginGold} />
        </div>

        {/* Diagrama de jugada superior, sangrado fuera de la pantalla */}
        <div className="absolute pointer-events-none" style={{ top: "-2%", left: "50%", transform: "translateX(-50%)" }}>
          <PlayDiagramTop color={loginGold} dim={loginLine} />
        </div>

        {/* Diagrama de jugada inferior, sangrado fuera de la pantalla */}
        <div className="absolute pointer-events-none" style={{ bottom: "-6%", left: "50%", transform: "translateX(-50%)", opacity: 0.8 }}>
          <PlayDiagramBottom color={loginGold} dim={loginLine} />
        </div>

        {/* Resplandor sutil detrás del título */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 480px 320px at 50% 42%, ${loginGold}12, transparent 70%)`,
        }} />

        <button onClick={toggleModo}
          className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${loginLine}`, color: loginGold }}
          aria-label="Cambiar modo claro/oscuro">
          {modoClaro ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="max-w-md w-full mx-auto px-5 max-h-[92vh] overflow-y-auto relative">
          {ligaElegida?.foto && (
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${loginLine}` }}>
              <img src={ligaElegida.foto} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          {!ligaElegida && pantallaLogin === "menu" && (
            <div className="text-[11px] f-mono uppercase tracking-[0.2em] text-center mb-2" style={{ color: loginGoldSoft }}>Temporada 2026</div>
          )}
          <div className="f-score font-extrabold text-center mb-1 uppercase" style={{
            fontSize: ligaElegida ? "2.5rem" : "2.7rem", lineHeight: 1.02,
            backgroundImage: `linear-gradient(180deg, #F3D98B 0%, ${loginGold} 45%, ${loginGoldSoft} 100%)`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
          }}>
            {ligaElegida ? ligaElegida.nombre : "Football Manager"}
          </div>
          <div className="text-sm text-center mb-7" style={{ color: loginTextDim }}>
            {pantallaLogin === "menu" ? "Elige cómo quieres entrar"
              : pantallaLogin === "elegirLiga" ? "Selecciona tu liga"
              : pantallaLogin === "crearLiga" ? "Crea tu liga"
              : pantallaLogin === "pinOrganizador" ? "Introduce tu PIN de organizador"
              : pantallaLogin === "pinEquipo" ? "Introduce el PIN de tu equipo"
              : ""}
          </div>

          {pantallaLogin === "menu" && (
            <div className="flex flex-col gap-3">
              <button onClick={() => abrirElegirLiga("organizador")}
                className="w-full flex items-center gap-3 py-3.5 px-4 rounded-lg font-semibold text-sm"
                style={{
                  backgroundImage: `linear-gradient(180deg, #E9C36B 0%, ${loginGold} 55%, ${loginGoldSoft} 100%)`,
                  color: "#241A05", boxShadow: "0 4px 14px rgba(201,162,39,0.35)",
                }}>
                <WhistleIcon size={17} />
                Soy el organizador
              </button>
              <button onClick={() => abrirElegirLiga("equipo")}
                className="w-full flex items-center gap-3 py-3.5 px-4 rounded-lg font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.04)", color: "#EDEFEA", border: `1px solid ${loginLine}` }}>
                <PinIcon size={17} />
                Tengo un PIN de equipo
              </button>
              <button onClick={() => abrirElegirLiga("visitante")}
                className="w-full flex items-center gap-3 py-3.5 px-4 rounded-lg font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.02)", color: loginTextDim, border: `1px solid ${loginLine}` }}>
                <EyeIcon size={17} />
                Entrar como visitante
              </button>
            </div>
          )}

          {pantallaLogin === "elegirLiga" && (
            <div className="flex flex-col gap-2">
              {ligasIndice === null && (
                <div className="text-xs text-center py-6" style={{ color: loginTextDim }}>Cargando ligas…</div>
              )}
              {ligasIndice !== null && ligasIndice.length === 0 && (
                <div className="text-xs text-center py-6" style={{ color: loginTextDim }}>
                  {contextoLogin === "organizador" ? "Todavía no hay ligas — crea la primera." : "Todavía no hay ninguna liga dada de alta."}
                </div>
              )}
              {(ligasIndice || []).map((l) => (
                <button key={l.id} onClick={() => elegirLigaExistente(l)}
                  className="w-full flex items-center gap-3 text-left py-3 px-4 rounded-lg text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#EDEFEA", border: `1px solid ${loginLine}` }}>
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${loginLine}` }}>
                    {l.foto ? <img src={l.foto} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <span className="flex-1 truncate">{l.nombre}</span>
                </button>
              ))}
              {contextoLogin === "organizador" && (
                <button onClick={irACrearLiga}
                  className="w-full py-3 rounded-lg text-sm font-semibold mt-1"
                  style={{ background: "rgba(255,255,255,0.03)", color: loginGold, border: `1px dashed ${loginLine}` }}>
                  ＋ Crear una liga nueva
                </button>
              )}
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium mt-2" style={{ color: loginTextDim }}>Volver</button>
            </div>
          )}

          {pantallaLogin === "crearLiga" && (
            <div className="flex flex-col gap-3">
              <input placeholder="Nombre de la liga" value={nombreLigaInput} onChange={(e) => setNombreLigaInput(e.target.value)}
                className="w-full rounded-md px-3 py-3 text-sm outline-none" style={loginInputStyle} />
              <input placeholder="Elige un PIN de organizador" value={pinCreadorInput}
                onChange={(e) => setPinCreadorInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={loginInputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: "#E0776A" }}>{errorLogin}</div>}
              <button onClick={crearLiga} disabled={creandoLiga} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ backgroundImage: `linear-gradient(180deg, #E9C36B 0%, ${loginGold} 55%, ${loginGoldSoft} 100%)`, color: "#241A05", opacity: creandoLiga ? 0.6 : 1 }}>
                {creandoLiga ? "Creando…" : "Crear liga"}
              </button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: loginTextDim }}>Volver</button>
            </div>
          )}

          {pantallaLogin === "pinOrganizador" && (
            <div className="flex flex-col gap-3">
              <input placeholder="PIN de organizador" value={pinCreadorInput}
                onChange={(e) => setPinCreadorInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={loginInputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: "#E0776A" }}>{errorLogin}</div>}
              <button onClick={confirmarPinOrganizador} disabled={pinBloqueado} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ backgroundImage: `linear-gradient(180deg, #E9C36B 0%, ${loginGold} 55%, ${loginGoldSoft} 100%)`, color: "#241A05", opacity: pinBloqueado ? 0.5 : 1 }}>Entrar</button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: loginTextDim }}>Volver</button>
              <div className="text-[11px] text-center" style={{ color: loginTextDim }}>Tu sesión se guardará en este dispositivo.</div>
            </div>
          )}

          {pantallaLogin === "pinEquipo" && (
            <div className="flex flex-col gap-3">
              <input placeholder="PIN de tu equipo" value={pinEquipoInput}
                onChange={(e) => setPinEquipoInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={loginInputStyle} />
              {errorLogin && <div className="text-xs text-center" style={{ color: "#E0776A" }}>{errorLogin}</div>}
              <button onClick={confirmarPinEquipo} disabled={pinBloqueado || entrandoConPin} className="w-full py-3.5 rounded-lg font-semibold text-sm"
                style={{ backgroundImage: `linear-gradient(180deg, #E9C36B 0%, ${loginGold} 55%, ${loginGoldSoft} 100%)`, color: "#241A05", opacity: pinBloqueado || entrandoConPin ? 0.5 : 1 }}>
                {entrandoConPin ? "Entrando…" : "Entrar"}
              </button>
              <button onClick={volverLogin} className="w-full py-2 text-xs font-medium" style={{ color: loginTextDim }}>Volver</button>
              <div className="text-[11px] text-center" style={{ color: loginTextDim }}>Tu sesión se guardará en este dispositivo.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (modalRosterEquipo) {
    const eqRoster = listaEquipos.find((e) => e.id === modalRosterEquipo);
    const estado = rostersEquipos[modalRosterEquipo];
    const jugadoresEq = estado?.jugadores || [];
    const ofensivaEq = jugadoresEq.filter((j) => j.lado === "ofensiva");
    const defensivaEq = jugadoresEq.filter((j) => j.lado === "defensiva");
    return (
      <div className="min-h-screen w-full" style={{ background: activeTheme.bg }}>
        {fuentes}
        {bannerSinConexion}
        <div className="max-w-md mx-auto px-4 pb-24 pt-6">
          <div className="relative mb-8">
            <button onClick={() => setModalRosterEquipo(null)}
              className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, color: activeTheme.text }}
              aria-label="Regresar">
              <span style={{ transform: "rotate(180deg)", display: "block" }}><ChevronIcon size={16} /></span>
            </button>
            <div className="text-center pt-2">
              <div className="text-[11px] f-mono uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Roster</div>
              <div className="f-display text-2xl font-bold uppercase truncate" style={{ color: activeTheme.text }}>{eqRoster?.nombre || "Equipo"}</div>
            </div>
          </div>

          {estado?.cargando && (
            <div className="text-xs text-center" style={{ color: activeTheme.textDim }}>Cargando roster…</div>
          )}
          {estado?.cargado && jugadoresEq.length === 0 && (
            <div className="text-xs text-center" style={{ color: activeTheme.textDim }}>Este equipo todavía no ha registrado jugadores.</div>
          )}
          {estado?.cargado && jugadoresEq.length > 0 && (
            <div className="flex flex-col gap-4">
              {[["Ofensiva", ofensivaEq], ["Defensiva", defensivaEq]].map(([titulo, lista]) => (
                lista.length > 0 && (
                  <div key={titulo}>
                    <div className="text-[11px] f-mono uppercase tracking-wide mb-2 text-center" style={{ color: activeTheme.textDim }}>{titulo}</div>
                    <div className="flex flex-col gap-2">
                      {lista.map((j) => (
                        <div key={j.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                          style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                          <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                            style={{ background: activeTheme.surface, border: `2px solid ${POSITION_COLORS[j.posicion]}` }}>
                            {j.foto ? <img src={j.foto} alt="" className="w-full h-full object-cover" />
                              : <span className="text-[10px] f-mono font-bold" style={{ color: POSITION_COLORS[j.posicion] }}>{j.posicion}</span>}
                          </div>
                          <div className="flex-1 min-w-0 text-center">
                            <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                            <div className="text-xs" style={{ color: activeTheme.textDim }}>{NOMBRES_POSICION[j.posicion]}</div>
                          </div>
                          <div className="text-sm f-mono font-bold shrink-0" style={{ color: activeTheme.textDim }}>{j.numero}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (vistaEquiposAbierta) {
    return (
      <div className="min-h-screen w-full" style={{ background: activeTheme.bg }}>
        {fuentes}
        {bannerSinConexion}
        <div className="max-w-md mx-auto px-4 pb-24 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setVistaEquiposAbierta(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, color: activeTheme.text }}
              aria-label="Regresar">
              <span style={{ transform: "rotate(180deg)", display: "block" }}><ChevronIcon size={16} /></span>
            </button>
            <div className="f-display text-xl font-bold uppercase flex-1" style={{ color: activeTheme.text }}>Equipos</div>
            {sesion.tipo === "creador" && (
              <button onClick={abrirNuevoEquipo}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                style={{ background: activeTheme.text, color: activeTheme.bg }}>+</button>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {listaEquipos.length === 0 && (
              <div className="text-xs" style={{ color: activeTheme.textDim }}>
                {sesion.tipo === "creador" ? "Agrega tu primer equipo con el +." : "Todavía no hay equipos en la liga."}
              </div>
            )}
            {listaEquipos.map((eq) => (
              <div key={eq.id} onClick={sesion.tipo === "equipo" ? () => abrirRosterEquipo(eq.id) : undefined}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}`, cursor: sesion.tipo === "equipo" ? "pointer" : "default" }}>
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                  {eq.foto ? <img src={eq.foto} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: eq.esPropio ? activeTheme.offense : activeTheme.text }}>{eq.nombre}</div>
                  <div className="text-xs truncate" style={{ color: activeTheme.textDim }}>
                    {eq.lugar || "Sin ubicación"}
                  </div>
                </div>
                {sesion.tipo === "creador" && (
                  <div className="shrink-0 flex flex-col items-center rounded-md px-2 py-1"
                    style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                    <div className="text-[8px] f-mono uppercase leading-none mb-1" style={{ color: activeTheme.textDim }}>PIN</div>
                    <div className="f-mono text-sm font-bold tracking-widest leading-none" style={{ color: activeTheme.text }}>{eq.pin}</div>
                  </div>
                )}
                {puedeEditarEquipo(eq) && (
                  <button onClick={(e) => { e.stopPropagation(); abrirEditarEquipo(eq); }} className="text-xs px-2 shrink-0" style={{ color: activeTheme.textDim }}>✎</button>
                )}
                {sesion.tipo === "creador" && (
                  <button onClick={() => eliminarEquipoRegistro(eq.id)} className="text-xs px-2 shrink-0" style={{ color: activeTheme.danger }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============ MODAL: AGREGAR/EDITAR EQUIPO (accesible desde la pantalla de Equipos) ============ */}
        {modalEquipo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalEquipo}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>
                {modalEquipo.modo === "nuevo" ? "Agregar equipo" : "Editar equipo"}
              </div>
              <input type="file" accept="image/*" ref={inputFotoModalEquipo} className="hidden" onChange={onFotoModalEquipoChange} />
              <div className="flex justify-center mb-4">
                <button onClick={() => inputFotoModalEquipo.current?.click()}
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                  {modalEquipo.foto ? <img src={modalEquipo.foto} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xs" style={{ color: activeTheme.textDim }}>Logo del equipo</span>}
                </button>
              </div>
              {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: activeTheme.danger }}>{errorFoto}</div>}
              <div className="flex flex-col gap-2 mb-4">
                <input placeholder="Nombre del equipo" value={modalEquipo.nombre}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, nombre: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                <input placeholder="De dónde son (ciudad, estadio...)" value={modalEquipo.lugar}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, lugar: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
              </div>
              {modalEquipo.modo === "editar" && (
                <div className="text-[11px] mb-4" style={{ color: activeTheme.textDim }}>
                  Si cambias el nombre, se actualiza en todos los juegos del calendario donde aparece.
                </div>
              )}
              {modalEquipo.modo === "editar" && modalEquipo.pin && (
                <div className="flex items-center justify-between mb-4 rounded-md px-3 py-2.5" style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                  <div>
                    <div className="text-[10px] f-mono uppercase" style={{ color: activeTheme.textDim }}>PIN del equipo</div>
                    <div className="f-mono text-lg font-bold tracking-widest" style={{ color: activeTheme.text }}>{modalEquipo.pin}</div>
                  </div>
                  {sesion.tipo === "creador" && (
                    <button onClick={regenerarPinModal} className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: activeTheme.surface, color: activeTheme.text }}>Regenerar</button>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={cerrarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={guardarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: CONFIRMACIÓN GENÉRICA (borrar equipo) ============ */}
        {confirmacion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarConfirmacion}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-2 uppercase tracking-wide" style={{ color: activeTheme.danger }}>{confirmacion.titulo}</div>
              <div className="text-sm mb-5" style={{ color: activeTheme.textDim }}>{confirmacion.mensaje}</div>
              <div className="flex gap-2">
                <button onClick={cerrarConfirmacion} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={ejecutarConfirmacion} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.danger, color: "#FFFFFF" }}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: activeTheme.bg }}>
      {fuentes}
      {bannerSinConexion}
      <div className="max-w-md mx-auto px-4 pb-24 pt-6">

        {/* encabezado */}
        <div className="flex items-center gap-3 mb-1">
          {sesion.tipo === "equipo" && (
            <>
              <input type="file" accept="image/*" ref={inputFotoEquipo} className="hidden" onChange={onFotoEquipoChange} />
              <button onClick={() => inputFotoEquipo.current?.click()}
                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                {equipoFoto ? <img src={equipoFoto} alt="" className="w-full h-full object-cover" />
                  : <span className="text-xl" style={{ color: activeTheme.textDim }}>+</span>}
              </button>
            </>
          )}
          {sesion.tipo === "creador" && (
            <>
              <input type="file" accept="image/*" ref={inputFotoLiga} className="hidden" onChange={onFotoLigaChange} />
              <button onClick={() => inputFotoLiga.current?.click()}
                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                {ligaFoto ? <img src={ligaFoto} alt="" className="w-full h-full object-cover" />
                  : <span className="text-xl" style={{ color: activeTheme.textDim }}>+</span>}
              </button>
            </>
          )}
          {sesion.tipo === "visitante" && ligaFoto && (
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
              style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
              <img src={ligaFoto} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          {sesion.tipo === "equipo" ? (
            <input value={equipo} onChange={(e) => actualizarMiEquipo({ nombre: e.target.value })}
              className={`${claseTituloEncabezado(equipo)} f-display bg-transparent outline-none w-full font-bold`}
              style={{ color: activeTheme.text }} />
          ) : sesion.tipo === "creador" ? (
            <input value={ligaNombre} onChange={(e) => setLigaNombre(e.target.value)}
              className={`${claseTituloEncabezado(ligaNombre)} f-display bg-transparent outline-none w-full font-bold`}
              style={{ color: activeTheme.text }} />
          ) : (
            <div className="f-display font-bold w-full leading-tight"
              style={{
                color: activeTheme.text,
                fontSize: (ligaNombre || "Visitante").length > 22 ? 18 : (ligaNombre || "Visitante").length > 14 ? 23 : 30,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>{ligaNombre || "Visitante"}</div>
          )}

          <button onClick={toggleModo}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, color: activeTheme.textDim }}
            aria-label="Cambiar modo claro/oscuro">
            {modoClaro ? <MoonIcon /> : <SunIcon />}
          </button>

          <div className="relative shrink-0">
            <button onClick={() => setMenuPrincipalAbierto((v) => !v)}
              className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[3px] shrink-0"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
              <span className="block w-4 h-[2px] rounded-full" style={{ background: activeTheme.text }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: activeTheme.text }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: activeTheme.text }} />
            </button>

            {menuPrincipalAbierto && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuPrincipalAbierto(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 max-w-[75vw] rounded-xl p-2 overflow-hidden"
                  style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
                  <button onClick={() => { setMenuPrincipalAbierto(false); setVistaEquiposAbierta(true); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ color: activeTheme.text }}>
                    <RosterIcon size={15} /> Equipos
                  </button>
                  <button onClick={() => { setMenuPrincipalAbierto(false); setModalCuenta(true); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ color: activeTheme.text }}>
                    <GearIcon size={15} /> Cuenta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {sesion.tipo === "equipo" && (
          <div className="flex gap-3 f-mono text-[11px] mb-5 uppercase tracking-wide flex-wrap" style={{ color: activeTheme.textDim }}>
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
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${activeTheme.border}, transparent)`, marginBottom: 20, marginTop: -8 }} />

        {/* tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
          {(sesion.tipo === "equipo"
            ? [["plantilla", "Roster"], ["calendario", "Calendario"], ["liga", "Liga"], ["jugadas", "Playbook"]]
            : sesion.tipo === "creador"
            ? [["calendario", "Calendario"], ["roster", "Roster"], ["liga", "Liga"]]
            : [["calendario", "Calendario"], ["roster", "Roster"], ["liga", "Liga"]]
          ).map(([key, label]) => {
            const IconoTab = key === "plantilla" || key === "roster" ? RosterIcon
              : key === "calendario" ? CalendarIcon
              : key === "liga" ? TrophyIcon
              : PlaybookIcon;
            return (
              <button key={key} onClick={() => { setTab(key); cerrarEditor(); cerrarVistaJugada(); }}
                className="flex-1 py-2 rounded-md text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                style={{ background: tab === key ? activeTheme.text : "transparent", color: tab === key ? activeTheme.bg : activeTheme.textDim }}>
                <IconoTab size={13} />
                {label}
              </button>
            );
          })}
        </div>

        {/* ============ TAB PLANTILLA ============ */}
        {tab === "plantilla" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: activeTheme.text }}>Roster</div>
              <button onClick={() => setModalJugadorAbierto(true)} disabled={fechaLimiteRosterPasada}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: activeTheme.text, color: activeTheme.bg, opacity: fechaLimiteRosterPasada ? 0.4 : 1 }}>+</button>
            </div>

            {fechaLimiteRoster && (
              <div className="rounded-lg px-3 py-2.5 mb-4 text-xs"
                style={{
                  background: fechaLimiteRosterPasada ? activeTheme.danger + "22" : activeTheme.surface2,
                  border: `1px solid ${fechaLimiteRosterPasada ? activeTheme.danger + "66" : activeTheme.border}`,
                  color: fechaLimiteRosterPasada ? activeTheme.danger : activeTheme.textDim,
                }}>
                {fechaLimiteRosterPasada
                  ? `La fecha límite para registrar jugadores fue el ${formatearFecha(fechaLimiteRoster)}. Ya no se pueden agregar más.`
                  : `Fecha límite para registrar jugadores: ${formatearFecha(fechaLimiteRoster)}.`}
              </div>
            )}

            {jugadores.length === 0 && (
              <div className="rounded-xl p-6 mb-6 text-center" style={{ background: activeTheme.surface, border: `1px dashed ${activeTheme.border}` }}>
                <div className="text-sm mb-3" style={{ color: activeTheme.textDim }}>Todavía no has registrado jugadores en tu roster.</div>
                <button onClick={() => setModalJugadorAbierto(true)} disabled={fechaLimiteRosterPasada}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeTheme.text, color: activeTheme.bg, opacity: fechaLimiteRosterPasada ? 0.5 : 1 }}>
                  + Agregar tu primer jugador
                </button>
              </div>
            )}

            {[["Ofensiva", ofensiva], ["Defensiva", defensiva]].map(([titulo, lista]) => (
              <div key={titulo} className="mb-6">
                <div className="f-display text-base font-bold mb-2 uppercase" style={{ color: activeTheme.text }}>{titulo}</div>
                {lista.length === 0 && jugadores.length > 0 && <div className="text-sm py-3" style={{ color: activeTheme.textDim }}>Todavía no hay jugadores aquí.</div>}
                <div className="flex flex-col gap-2">
                  {lista.map((j) => (
                    <div key={j.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                      style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                      <button onClick={() => abrirVistaJugador(j)}
                        className="w-11 h-11 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: activeTheme.surface2, border: `2px solid ${POSITION_COLORS[j.posicion]}` }}>
                        {j.foto ? <img src={j.foto} alt="" className="w-full h-full object-cover" />
                          : <span className="text-xs f-mono font-bold" style={{ color: POSITION_COLORS[j.posicion] }}>{j.posicion}</span>}
                      </button>
                      <div className="flex-1 min-w-0" onClick={() => abrirVistaJugador(j)} style={{ cursor: "pointer" }}>
                        <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold f-mono"
                            style={{ background: POSITION_COLORS[j.posicion], color: "#0A0D0C" }}>{j.posicion}</span>
                          <span className="text-xs" style={{ color: activeTheme.textDim }}>{NOMBRES_POSICION[j.posicion]}</span>
                        </div>
                      </div>
                      <div className="text-base f-mono font-bold shrink-0" style={{ color: activeTheme.textDim }}>{j.numero}</div>
                      <button onClick={() => eliminarJugador(j.id)} className="text-xs px-2 shrink-0" style={{ color: activeTheme.danger }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ MODAL: AGREGAR JUGADOR ============ */}
        {modalJugadorAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setModalJugadorAbierto(false)}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Agregar jugador</div>
              <input type="file" accept="image/*" ref={inputFotoNueva} className="hidden" onChange={onFotoNuevaChange} />
              <div className="flex justify-center mb-4">
                <button onClick={() => inputFotoNueva.current?.click()}
                  className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                  {fotoNueva ? <img src={fotoNueva} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xs" style={{ color: activeTheme.textDim }}>Foto</span>}
                </button>
              </div>
              {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: activeTheme.danger }}>{errorFoto}</div>}
              <div className="flex gap-2 mb-3">
                <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 min-w-0 rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                <input placeholder="#" value={numero} onChange={(e) => setNumero(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-16 shrink-0 rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
              </div>
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
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={agregarJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Añadir</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL JUGADOR (ver / editar) ============ */}
        {jugadorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalJugador}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <input type="file" accept="image/*" ref={inputFotoModalJugador} className="hidden" onChange={onFotoModalChange} />

              {jugadorModal.modo === "ver" ? (
                <div>
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden mb-3 flex items-center justify-center"
                      style={{ background: activeTheme.surface2, border: `3px solid ${POSITION_COLORS[jugadorModal.posicion]}` }}>
                      {jugadorModal.foto ? <img src={jugadorModal.foto} alt="" className="w-full h-full object-cover" />
                        : <span className="text-2xl f-mono font-bold" style={{ color: POSITION_COLORS[jugadorModal.posicion] }}>{jugadorModal.posicion}</span>}
                    </div>
                    <div className="f-display text-2xl font-bold" style={{ color: activeTheme.text }}>{jugadorModal.nombre}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold f-mono"
                        style={{ background: POSITION_COLORS[jugadorModal.posicion], color: "#0A0D0C" }}>{jugadorModal.posicion}</span>
                      <span className="text-xs" style={{ color: activeTheme.textDim }}>{NOMBRES_POSICION[jugadorModal.posicion]}</span>
                      <span className="text-sm f-mono font-bold" style={{ color: activeTheme.textDim }}>#{jugadorModal.numero}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={cerrarModalJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: jugadorModal.soloLectura ? activeTheme.text : activeTheme.surface2, color: jugadorModal.soloLectura ? activeTheme.bg : activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cerrar</button>
                    {!jugadorModal.soloLectura && (
                      <button onClick={pasarAEditarJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                        style={{ background: activeTheme.text, color: activeTheme.bg }}>Editar</button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Editar jugador</div>
                  <div className="flex justify-center mb-4">
                    <button onClick={() => inputFotoModalJugador.current?.click()}
                      className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                      {jugadorModal.foto ? <img src={jugadorModal.foto} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xs" style={{ color: activeTheme.textDim }}>Cambiar foto</span>}
                    </button>
                  </div>
                  {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: activeTheme.danger }}>{errorFoto}</div>}
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
                      style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                    <button onClick={guardarEdicionJugador} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                      style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar cambios</button>
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
                style={{ background: activeTheme.offense, color: "#1A1200" }}>+ Jugada ofensiva</button>
              <button onClick={() => iniciarNuevaJugada("defensiva")} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: activeTheme.defense, color: "#0A1522" }}>+ Jugada defensiva</button>
            </div>

            {jugadas.length === 0 && <div className="text-sm text-center py-10" style={{ color: activeTheme.textDim }}>
              Aún no has creado ninguna jugada. Empieza con un botón de arriba.
            </div>}

            {jugadasAgrupadas.map((grupo) => (
              <div key={grupo.nombreF} className="mb-2">
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: activeTheme.border }} />
                  <span className="text-[11px] f-mono uppercase tracking-wide shrink-0" style={{ color: activeTheme.textDim }}>{grupo.nombreF}</span>
                  <div className="flex-1 h-px" style={{ background: activeTheme.border }} />
                </div>
                <div className="flex flex-col gap-3">
                  {grupo.items.map((j) => (
                    <div key={j.id} className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                      <button onClick={() => abrirVistaJugada(j)} className="w-16 h-24 rounded-md overflow-hidden shrink-0">
                        <Field tokens={j.tokens} asignaciones={j.asignaciones} side={j.lado} mode="ver" losY={j.losY} mini />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                        <div className="text-[11px] f-mono uppercase" style={{ color: j.lado === "ofensiva" ? activeTheme.offense : activeTheme.defense }}>{j.lado}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <button onClick={() => abrirVistaJugada(j)} className="text-xs px-3 py-1 rounded font-medium"
                            style={{ background: activeTheme.surface2, color: activeTheme.text }}>Ver</button>
                          <button onClick={() => abrirJugada(j)} className="text-xs px-3 py-1 rounded font-medium"
                            style={{ background: activeTheme.surface2, color: activeTheme.text }}>Editar</button>
                          <button onClick={() => eliminarJugada(j.id)} className="text-xs px-3 py-1 rounded font-medium" style={{ color: activeTheme.danger }}>Eliminar</button>
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
                <div className="f-display text-lg font-bold" style={{ color: activeTheme.text }}>{jugadaEnVista.nombre}</div>
                <div className="text-[11px] f-mono uppercase" style={{ color: jugadaEnVista.lado === "ofensiva" ? activeTheme.offense : activeTheme.defense }}>
                  {jugadaEnVista.lado} · {jugadaEnVista.formacion || "Personalizada"} · Solo lectura
                </div>
              </div>
              <button onClick={cerrarVistaJugada} className="text-xs px-3 py-1.5 rounded font-medium"
                style={{ background: activeTheme.surface2, color: activeTheme.text }}>Cerrar</button>
            </div>
            <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: `${FIELD_W}/${FIELD_H}` }}>
              <Field tokens={jugadaEnVista.tokens} asignaciones={jugadaEnVista.asignaciones} side={jugadaEnVista.lado} mode="ver" losY={jugadaEnVista.losY} />
            </div>
            <button onClick={() => { abrirJugada(jugadaEnVista); setViendoJugadaId(null); }}
              className="w-full py-3 rounded-lg font-semibold text-sm"
              style={{ background: activeTheme.text, color: activeTheme.bg }}>Editar esta jugada</button>
          </div>
        )}

        {/* ============ SELECTOR DE FORMACIÓN ============ */}
        {tab === "jugadas" && eligiendoFormacion && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: activeTheme.text }}>Elegir formación</div>
              <button onClick={() => setEligiendoFormacion(null)} className="text-xs" style={{ color: activeTheme.textDim }}>Cancelar</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(eligiendoFormacion === "ofensiva" ? OFFENSE_FORMATIONS : DEFENSE_FORMATIONS).map((f) => (
                <button key={f.nombre} onClick={() => elegirFormacion(f)}
                  className="rounded-xl p-2 text-left" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                  <div className="w-full rounded-md overflow-hidden mb-2" style={{ aspectRatio: `${FIELD_W}/${FIELD_H}` }}>
                    <Field tokens={f.tokens.map((t) => ({ ...t, id: t.pos }))} asignaciones={[]} side={eligiendoFormacion} mode="ver" mini />
                  </div>
                  <div className="text-xs font-semibold" style={{ color: activeTheme.text }}>{f.nombre}</div>
                </button>
              ))}
              <button onClick={() => elegirFormacion(null)}
                className="rounded-xl p-2 flex flex-col items-center justify-center gap-2"
                style={{ background: activeTheme.surface, border: `1px dashed ${activeTheme.border}`, aspectRatio: "0.65" }}>
                <span className="text-2xl" style={{ color: activeTheme.textDim }}>＋</span>
                <span className="text-xs font-semibold" style={{ color: activeTheme.textDim }}>Empezar en blanco</span>
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
              style={{ background: activeTheme.surface, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }} />

            <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
              {[["colocar", "Colocar"], ["rutas", editando.lado === "ofensiva" ? "Rutas/Bloqueos" : "Coberturas"], ["linea", "Línea"], ["eliminar", "Quitar"]].map(([key, label]) => (
                <button key={key} onClick={() => { setModo(key); setSeleccion(null); setRutaEnCurso(null); setZonaSeleccionada(null); }}
                  className="flex-1 py-2 rounded-md text-xs font-semibold"
                  style={{ background: modo === key ? activeTheme.text : "transparent", color: modo === key ? activeTheme.bg : activeTheme.textDim }}>
                  {label}
                </button>
              ))}
            </div>

            {modo === "rutas" && editando.lado === "defensiva" && (
              <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                {[["personal", "Personal"], ["zona", "Zona"]].map(([key, label]) => (
                  <button key={key} onClick={() => setCoberturaTipo(key)}
                    className="flex-1 py-1.5 rounded-md text-xs font-semibold"
                    style={{ background: coberturaTipo === key ? activeTheme.text : "transparent", color: coberturaTipo === key ? activeTheme.bg : activeTheme.textDim }}>
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

            <div className="text-xs mb-3 min-h-[2.2em]" style={{ color: activeTheme.textDim }}>
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
                  style={{ background: activeTheme.surface2, color: activeTheme.text }}>Cancelar</button>
                {rutaEnCurso.tipo !== "zona" && (
                  <button onClick={terminarRuta} disabled={rutaEnCurso.puntos.length === 0}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: activeTheme.text, color: activeTheme.bg, opacity: rutaEnCurso.puntos.length === 0 ? 0.5 : 1 }}>
                    Terminar
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-1">
              <button onClick={cerrarEditor} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: activeTheme.surface, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
              <button onClick={guardarJugada} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar jugada</button>
            </div>
          </div>
        )}

        {/* ============ TAB CALENDARIO (único, agrupado por jornada, colapsable) ============ */}
        {tab === "calendario" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="f-display text-lg font-bold uppercase" style={{ color: activeTheme.text }}>Calendario</div>
              {sesion.tipo === "creador" && (
                <button onClick={abrirModalPartido}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: activeTheme.text, color: activeTheme.bg, boxShadow: activeTheme.shadow }}>+</button>
              )}
            </div>

            {partidosLiga.length === 0 && (
              <div className="rounded-xl p-6 text-center" style={{ background: activeTheme.surface, border: `1px dashed ${activeTheme.border}` }}>
                <div className="text-sm mb-3" style={{ color: activeTheme.textDim }}>No hay juegos programados todavía.</div>
                {sesion.tipo === "creador" && (
                  <button onClick={abrirModalPartido} className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: activeTheme.text, color: activeTheme.bg }}>
                    + Agregar el primer juego
                  </button>
                )}
              </div>
            )}

            {/* -------- tarjeta resumen: próximo partido (solo para la sesión de equipo, muestra SU próximo juego) -------- */}
            {sesion.tipo === "equipo" && proximoPartido && (
              <div className="rounded-xl p-5 mb-5"
                style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.offense}55`, boxShadow: activeTheme.shadow }}>
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <CalendarIcon size={12} />
                  <span className="text-[10px] f-mono uppercase font-bold tracking-widest" style={{ color: activeTheme.offense }}>Próximo partido</span>
                </div>
                {proximoPartido.bye ? (
                  <div className="flex items-center justify-between gap-1">
                    {renderLogoEquipo(proximoPartido.local)}
                    <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-2">
                      <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearFecha(proximoPartido.fecha)}</div>
                      <div className="f-mono text-xl font-bold text-center mt-1" style={{ color: activeTheme.textDim }}>BYE</div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                        <span className="text-sm f-mono font-bold" style={{ color: activeTheme.textDim }}>BYE</span>
                      </div>
                      <div className="text-xs font-semibold text-center" style={{ color: activeTheme.textDim }}>Sin rival</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-1">
                      {renderLogoEquipo(proximoPartido.local)}
                      <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-2">
                        <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearFecha(proximoPartido.fecha)}</div>
                        {proximoPartido.hora && <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearHora(proximoPartido.hora)}</div>}
                        <div className="f-display text-2xl font-bold text-center" style={{ color: activeTheme.text }}>VS</div>
                      </div>
                      {renderLogoEquipo(proximoPartido.visitante)}
                    </div>
                    {proximoPartido.lugar && (
                      <a href={urlMapsDeLugar(proximoPartido.lugar)} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1 text-xs text-center mt-4 underline decoration-dotted underline-offset-2"
                        style={{ color: activeTheme.textDim }}>
                        <PinIcon />{proximoPartido.lugar}
                      </a>
                    )}
                  </>
                )}
              </div>
            )}

            {partidosPorJornada.map((grupo) => {
              const abierta = !!jornadasAbiertas[grupo.jornada];
              const esProxima = grupo.jornada === jornadaProxima;
              const subtitulo = rangoFechas(grupo.items);
              return (
                <div key={grupo.jornada} className="mb-3">
                  <button onClick={() => toggleJornada(grupo.jornada)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-left select-none"
                    style={{
                      background: abierta ? activeTheme.surface2 : activeTheme.surface,
                      border: `1px solid ${abierta || esProxima ? activeTheme.offense + "55" : activeTheme.border}`,
                      boxShadow: activeTheme.shadow,
                    }}>
                    <span className="flex flex-col items-start min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="f-mono text-sm font-bold uppercase tracking-wide" style={{ color: activeTheme.text }}>
                          {grupo.jornada === "Sin jornada" ? "Sin jornada" : `Jornada ${grupo.jornada}`}
                        </span>
                        {esProxima && (
                          <span className="text-[9px] f-mono font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{ background: activeTheme.offense, color: "#1A1200" }}>Próxima</span>
                        )}
                      </span>
                      {subtitulo && (
                        <span className="text-[11px] f-mono mt-0.5" style={{ color: activeTheme.textDim }}>{subtitulo}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] f-mono uppercase" style={{ color: activeTheme.textDim }}>
                        <span className="font-bold" style={{ color: activeTheme.offense }}>{grupo.items.length}</span> juego{grupo.items.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{
                        display: "inline-flex",
                        transform: abierta ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        color: abierta ? activeTheme.offense : activeTheme.textDim,
                      }}><ChevronIcon /></span>
                    </span>
                  </button>

                  <div style={{ display: "grid", gridTemplateRows: abierta ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease" }}>
                    <div style={{ overflow: "hidden", minHeight: 0 }}>
                      <div className="flex flex-col gap-3 mt-3">
                        {grupo.items.map((p) => {
                          const r = resultadoPartido(p);
                          const tieneMarcador = p.marcadorLocal !== null && p.marcadorLocal !== undefined && p.marcadorVisitante !== null && p.marcadorVisitante !== undefined;

                          if (p.bye) {
                            return (
                              <div key={p.id} className="rounded-xl p-5 select-none"
                                style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, boxShadow: activeTheme.shadow }}
                                onMouseDown={() => iniciarPulsacionLarga(p.id)} onMouseUp={cancelarPulsacionLarga} onMouseLeave={cancelarPulsacionLarga}
                                onTouchStart={() => iniciarPulsacionLarga(p.id)} onTouchEnd={cancelarPulsacionLarga} onTouchCancel={cancelarPulsacionLarga}>
                                <div className="flex items-center justify-between gap-1">
                                  {renderLogoEquipo(p.local)}

                                  <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-2">
                                    <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearFecha(p.fecha)}</div>
                                    <div className="f-mono text-2xl font-bold text-center mt-1" style={{ color: activeTheme.textDim }}>BYE</div>
                                    <span className="text-[11px] px-2 py-1 rounded font-bold f-mono uppercase mt-0.5"
                                      style={{ background: activeTheme.surface2, color: activeTheme.textDim, border: `1px solid ${activeTheme.border}` }}>Descanso</span>
                                  </div>

                                  <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                      style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                                      <span className="text-sm f-mono font-bold" style={{ color: activeTheme.textDim }}>BYE</span>
                                    </div>
                                    <div className="text-xs font-semibold text-center" style={{ color: activeTheme.textDim }}>Sin rival</div>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={p.id} className="rounded-xl p-5 select-none"
                              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, boxShadow: activeTheme.shadow }}
                              onMouseDown={() => iniciarPulsacionLarga(p.id)} onMouseUp={cancelarPulsacionLarga} onMouseLeave={cancelarPulsacionLarga}
                              onTouchStart={() => iniciarPulsacionLarga(p.id)} onTouchEnd={cancelarPulsacionLarga} onTouchCancel={cancelarPulsacionLarga}>
                              <div className="flex items-center justify-between gap-1">
                                {renderLogoEquipo(p.local)}
                                <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: tieneMarcador ? activeTheme.text : activeTheme.textDim }}>
                                  {tieneMarcador ? p.marcadorLocal : "–"}
                                </div>

                                <div className="flex flex-col items-center gap-1.5 min-w-0 px-2">
                                  <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearFecha(p.fecha)}</div>
                                  {p.hora && <div className="text-xs f-mono text-center" style={{ color: activeTheme.textDim }}>{formatearHora(p.hora)}</div>}
                                  {r && (
                                    <span className="text-[11px] px-2 py-1 rounded font-bold f-mono uppercase mt-0.5"
                                      style={{ background: colorResultado(r), color: "#0A0D0C" }}>{textoResultado(r)}</span>
                                  )}
                                </div>

                                <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: tieneMarcador ? activeTheme.text : activeTheme.textDim }}>
                                  {tieneMarcador ? p.marcadorVisitante : "–"}
                                </div>
                                {renderLogoEquipo(p.visitante)}
                              </div>

                              {p.lugar && (
                                <a href={urlMapsDeLugar(p.lugar)} target="_blank" rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onTouchStart={(e) => e.stopPropagation()}
                                  className="flex items-center justify-center gap-1 text-xs text-center mt-4 underline decoration-dotted underline-offset-2"
                                  style={{ color: activeTheme.textDim }}>
                                  <PinIcon />{p.lugar}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ TAB LIGA (tabla + estadísticas + equipos) ============ */}
        {tab === "liga" && (
          <div>
            <div className="flex gap-1 mb-5 p-1 rounded-lg" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
              {[["posiciones", "Posiciones"], ["playoffs", "Playoffs"], ["estadisticas", "Estadísticas"]].map(([key, label]) => (
                <button key={key} onClick={() => setLigaSubTab(key)}
                  className="flex-1 py-2 rounded-md text-[11px] font-semibold transition"
                  style={{ background: ligaSubTab === key ? activeTheme.text : "transparent", color: ligaSubTab === key ? activeTheme.bg : activeTheme.textDim }}>
                  {label}
                </button>
              ))}
            </div>

            {ligaSubTab === "posiciones" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="f-display text-lg font-bold uppercase" style={{ color: activeTheme.text }}>Tabla de posiciones</div>
                  {sesion.tipo === "creador" && (
                    <button onClick={abrirModalDesempates}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-md shrink-0"
                      style={{ background: activeTheme.surface2, color: activeTheme.textDim, border: `1px solid ${activeTheme.border}` }}>
                      <GearIcon size={12} /> Desempates
                    </button>
                  )}
                </div>

                <div className="rounded-xl overflow-hidden mb-6" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${activeTheme.border}` }}>
                        <th className="text-center py-2 px-2 f-mono uppercase" style={{ color: activeTheme.textDim }}>#</th>
                        <th className="text-center py-2 px-2 f-mono uppercase" style={{ color: activeTheme.textDim }}>Equipo</th>
                        <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: activeTheme.textDim }}>PJ</th>
                        <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: activeTheme.textDim }}>G</th>
                        <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: activeTheme.textDim }}>P</th>
                        <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: activeTheme.textDim }}>E</th>
                        <th className="text-center py-2 px-1 f-mono uppercase" style={{ color: activeTheme.textDim }}>DIF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filasLiga.map((eq, idx) => (
                        <tr key={eq.id} style={{ borderBottom: `1px solid ${activeTheme.border}`, background: eq.esPropio ? activeTheme.surface2 : "transparent" }}>
                          <td className="text-center py-2 px-2 f-mono font-bold" style={{ color: activeTheme.textDim }}>{idx + 1}</td>
                          <td className="text-center py-2 px-2 font-semibold truncate max-w-[110px]" style={{ color: eq.esPropio ? activeTheme.offense : activeTheme.text }}>{eq.nombre}</td>
                          <td className="text-center py-2 px-1 f-mono" style={{ color: activeTheme.text }}>{eq.g + eq.p + eq.e}</td>
                          <td className="text-center py-2 px-1 f-mono" style={{ color: activeTheme.win }}>{eq.g}</td>
                          <td className="text-center py-2 px-1 f-mono" style={{ color: activeTheme.danger }}>{eq.p}</td>
                          <td className="text-center py-2 px-1 f-mono" style={{ color: activeTheme.textDim }}>{eq.e}</td>
                          <td className="text-center py-2 px-1 f-mono" style={{ color: activeTheme.text }}>{eq.pf - eq.pc > 0 ? "+" : ""}{eq.pf - eq.pc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-[11px] mb-1" style={{ color: activeTheme.textDim }}>
                  La tabla se calcula automáticamente a partir de los marcadores guardados en el Calendario. Los juegos BYE no se contabilizan.
                </div>
                <div className="text-[11px]" style={{ color: activeTheme.textDim }}>
                  Desempates: {criteriosDesempate.map((id) => CRITERIOS_DESEMPATE_DISPONIBLES.find((c) => c.id === id)?.label).filter(Boolean).join(" → ")}
                </div>
              </div>
            )}

            {ligaSubTab === "playoffs" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="f-display text-lg font-bold uppercase" style={{ color: activeTheme.text }}>Playoffs</div>
                  {sesion.tipo === "creador" && (
                    <button onClick={abrirModalPlayoffs}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-md shrink-0"
                      style={{ background: activeTheme.surface2, color: activeTheme.textDim, border: `1px solid ${activeTheme.border}` }}>
                      <GearIcon size={12} /> {playoffsFormato ? "Configurar" : "Activar"}
                    </button>
                  )}
                </div>

                {!playoffsBracket && (
                  <div className="rounded-xl py-10 px-5 text-center" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                    <div className="text-sm font-semibold mb-1" style={{ color: activeTheme.text }}>Todavía no hay playoffs configurados</div>
                    <div className="text-xs mb-4" style={{ color: activeTheme.textDim }}>
                      {sesion.tipo === "creador"
                        ? "Elige un formato — final directa, semifinales o cuartos de final — y arma el bracket con la tabla de posiciones actual."
                        : "El organizador todavía no activó la fase de playoffs de esta liga."}
                    </div>
                    {sesion.tipo === "creador" && (
                      <button onClick={abrirModalPlayoffs} className="py-2.5 px-5 rounded-lg text-sm font-semibold"
                        style={{ background: activeTheme.offense, color: "#1A1305" }}>
                        Configurar playoffs
                      </button>
                    )}
                  </div>
                )}

                {playoffsBracket && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-bold uppercase tracking-wide" style={{ color: activeTheme.offense }}>
                        {FORMATOS_PLAYOFFS.find((f) => f.id === playoffsBracket.formato)?.label}
                      </div>
                      {sesion.tipo === "creador" && (
                        <button onClick={regenerarBracketPlayoffs} className="text-[11px] font-medium underline underline-offset-2" style={{ color: activeTheme.textDim }}>
                          Actualizar sedes con la tabla
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-6">
                      {playoffsBracket.rondas.map((ronda, rondaIdx) => (
                        <div key={rondaIdx}>
                          <div className="text-[11px] f-mono uppercase tracking-wide mb-2" style={{ color: activeTheme.textDim }}>
                            {FORMATOS_PLAYOFFS.find((f) => f.id === playoffsBracket.formato)?.rondas[rondaIdx]}
                          </div>
                          <div className="flex flex-col gap-3">
                            {ronda.map((p, partidoIdx) => {
                              const ganador = ganadorDeCruce(p);
                              const ambosDefinidos = !!(p.equipoA && p.equipoB);
                              const puedeEditar = sesion.tipo === "creador" && ambosDefinidos;
                              const nombreRondaActual = FORMATOS_PLAYOFFS.find((f) => f.id === playoffsBracket.formato)?.rondas[rondaIdx];
                              return (
                                <div key={p.id} className="rounded-xl p-5 select-none"
                                  style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, boxShadow: activeTheme.shadow }}>
                                  <div className="flex items-center justify-between gap-1">
                                    {renderLogoEquipoBracket(p.equipoA, p.seedA)}

                                    {puedeEditar ? (
                                      <input type="number" value={p.marcadorA}
                                        onChange={(e) => actualizarMarcadorPlayoff(rondaIdx, partidoIdx, "marcadorA", e.target.value)}
                                        className="f-mono text-3xl font-bold text-center px-1 shrink-0 w-14 outline-none bg-transparent"
                                        style={{ color: activeTheme.text, borderBottom: `1px dashed ${activeTheme.border}` }} />
                                    ) : (
                                      <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: p.marcadorA !== "" ? activeTheme.text : activeTheme.textDim }}>
                                        {p.marcadorA !== "" ? p.marcadorA : "–"}
                                      </div>
                                    )}

                                    <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-2">
                                      <div className="text-xs f-mono text-center uppercase" style={{ color: activeTheme.textDim }}>{nombreRondaActual}</div>
                                      <span className="text-[11px] px-2 py-1 rounded font-bold f-mono uppercase mt-0.5"
                                        style={{
                                          background: ganador ? activeTheme.win : activeTheme.surface2,
                                          color: ganador ? "#0A0D0C" : activeTheme.textDim,
                                          border: ganador ? "none" : `1px solid ${activeTheme.border}`,
                                        }}>
                                        {ganador ? `Avanza: ${ganador.nombre}` : ambosDefinidos ? "Por jugar" : "Por definir"}
                                      </span>
                                    </div>

                                    {puedeEditar ? (
                                      <input type="number" value={p.marcadorB}
                                        onChange={(e) => actualizarMarcadorPlayoff(rondaIdx, partidoIdx, "marcadorB", e.target.value)}
                                        className="f-mono text-3xl font-bold text-center px-1 shrink-0 w-14 outline-none bg-transparent"
                                        style={{ color: activeTheme.text, borderBottom: `1px dashed ${activeTheme.border}` }} />
                                    ) : (
                                      <div className="f-mono text-3xl font-bold text-center px-1 shrink-0" style={{ color: p.marcadorB !== "" ? activeTheme.text : activeTheme.textDim }}>
                                        {p.marcadorB !== "" ? p.marcadorB : "–"}
                                      </div>
                                    )}

                                    {renderLogoEquipoBracket(p.equipoB, p.seedB)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {ligaSubTab === "estadisticas" && (
              <div>
                {/* Selector de sección — cambia el contenido sin deslizar */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {["Ofensiva", "Defensa", "Anotadores"].map((label, i) => (
                    <button key={label} onClick={() => setStatsSlide(i)}
                      className="px-3 py-1 rounded-full text-[10px] f-mono uppercase font-bold tracking-wide"
                      style={{
                        background: statsSlide === i ? activeTheme.text : activeTheme.surface,
                        color: statsSlide === i ? activeTheme.bg : activeTheme.textDim,
                        border: `1px solid ${statsSlide === i ? activeTheme.text : activeTheme.border}`,
                      }}>{label}</button>
                  ))}
                </div>

                {/* -------- mejor ofensiva -------- */}
                {statsSlide === 0 && (
                  <div>
                    <div className="f-display text-base font-bold uppercase mb-2 text-center" style={{ color: activeTheme.text }}>Mejor ofensiva</div>
                    <div className="rounded-xl overflow-hidden" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                      {mejorOfensiva.length === 0 && (
                        <div className="text-xs p-4 text-center" style={{ color: activeTheme.textDim }}>Sin datos todavía — captura marcadores en el Calendario.</div>
                      )}
                      {mejorOfensiva.length > 0 && (
                        <div className="overflow-y-auto" style={{ maxHeight: "56vh" }}>
                          <table className="w-full text-xs">
                            <thead>
                              <tr style={{ borderBottom: `1px solid ${activeTheme.border}` }}>
                                <th className="text-center py-1.5 px-2 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>#</th>
                                <th className="text-center py-1.5 px-2 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>Equipo</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>PJ</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>PF</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>Prom.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mejorOfensiva.map((eq, idx) => {
                                const pj = eq.g + eq.p + eq.e;
                                return (
                                  <tr key={eq.id} style={{ borderBottom: `1px solid ${activeTheme.border}` }}>
                                    <td className="text-center py-1.5 px-2 f-mono font-bold" style={{ color: idx === 0 ? activeTheme.offense : activeTheme.textDim }}>{idx + 1}</td>
                                    <td className="text-center py-1.5 px-2 font-semibold" style={{ color: activeTheme.text }}>{eq.nombre}</td>
                                    <td className="text-center py-1.5 px-1 f-mono" style={{ color: activeTheme.textDim }}>{pj}</td>
                                    <td className="text-center py-1.5 px-1 f-mono font-bold" style={{ color: activeTheme.text }}>{eq.pf}</td>
                                    <td className="text-center py-1.5 px-1 f-mono" style={{ color: activeTheme.textDim }}>{(eq.pf / pj).toFixed(1)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------- mejor defensa -------- */}
                {statsSlide === 1 && (
                  <div>
                    <div className="f-display text-base font-bold uppercase mb-2 text-center" style={{ color: activeTheme.text }}>Mejor defensa</div>
                    <div className="rounded-xl overflow-hidden" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                      {mejorDefensiva.length === 0 && (
                        <div className="text-xs p-4 text-center" style={{ color: activeTheme.textDim }}>Sin datos todavía — captura marcadores en el Calendario.</div>
                      )}
                      {mejorDefensiva.length > 0 && (
                        <div className="overflow-y-auto" style={{ maxHeight: "56vh" }}>
                          <table className="w-full text-xs">
                            <thead>
                              <tr style={{ borderBottom: `1px solid ${activeTheme.border}` }}>
                                <th className="text-center py-1.5 px-2 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>#</th>
                                <th className="text-center py-1.5 px-2 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>Equipo</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>PJ</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>PC</th>
                                <th className="text-center py-1.5 px-1 f-mono uppercase" style={{ color: activeTheme.textDim, background: activeTheme.surface, position: "sticky", top: 0 }}>Prom.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mejorDefensiva.map((eq, idx) => {
                                const pj = eq.g + eq.p + eq.e;
                                return (
                                  <tr key={eq.id} style={{ borderBottom: `1px solid ${activeTheme.border}` }}>
                                    <td className="text-center py-1.5 px-2 f-mono font-bold" style={{ color: idx === 0 ? activeTheme.defense : activeTheme.textDim }}>{idx + 1}</td>
                                    <td className="text-center py-1.5 px-2 font-semibold" style={{ color: activeTheme.text }}>{eq.nombre}</td>
                                    <td className="text-center py-1.5 px-1 f-mono" style={{ color: activeTheme.textDim }}>{pj}</td>
                                    <td className="text-center py-1.5 px-1 f-mono font-bold" style={{ color: activeTheme.text }}>{eq.pc}</td>
                                    <td className="text-center py-1.5 px-1 f-mono" style={{ color: activeTheme.textDim }}>{(eq.pc / pj).toFixed(1)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------- máximos anotadores -------- */}
                {statsSlide === 2 && (
                  <div>
                    <div className="relative mb-2">
                      <div className="f-display text-base font-bold uppercase text-center" style={{ color: activeTheme.text }}>Máximos anotadores</div>
                      {sesion.tipo === "creador" && (
                        <button onClick={abrirModalAnotador}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                          style={{ background: activeTheme.text, color: activeTheme.bg }}>+</button>
                      )}
                    </div>
                    <div className="rounded-xl overflow-hidden mb-2" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                      {anotadoresOrdenados.length === 0 && (
                        <div className="text-xs p-4 text-center" style={{ color: activeTheme.textDim }}>
                          {sesion.tipo === "creador" ? "Toca + para agregar jugadores a la tabla de anotadores." : "Todavía no hay anotadores registrados."}
                        </div>
                      )}
                      {anotadoresOrdenados.length > 0 && (
                        <div className="overflow-y-auto" style={{ maxHeight: "56vh" }}>
                          {anotadoresOrdenados.map((a, idx) => (
                            <div key={a.id}
                              onDoubleClick={() => { if (sesion.tipo === "creador") sumarAnotacion(a.id); }}
                              className="flex items-center gap-2.5 px-3 py-2"
                              style={{ borderBottom: idx < anotadoresOrdenados.length - 1 ? `1px solid ${activeTheme.border}` : "none", cursor: sesion.tipo === "creador" ? "pointer" : "default" }}>
                              <div className="w-5 text-center f-mono font-bold text-xs shrink-0" style={{ color: idx === 0 ? activeTheme.offense : activeTheme.textDim }}>{idx + 1}</div>
                              <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                                style={{ background: activeTheme.surface2, border: `2px solid ${POSITION_COLORS[a.jugadorPosicion] || activeTheme.border}` }}>
                                {a.jugadorFoto ? <img src={a.jugadorFoto} alt="" className="w-full h-full object-cover" />
                                  : <span className="text-[9px] f-mono font-bold" style={{ color: POSITION_COLORS[a.jugadorPosicion] || activeTheme.textDim }}>{a.jugadorPosicion}</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{a.jugadorNombre}</div>
                                <div className="text-[10px] truncate" style={{ color: activeTheme.textDim }}>{a.equipoNombre} · {a.jugadorPosicion} · #{a.jugadorNumero}</div>
                              </div>
                              <div className="f-mono text-base font-bold shrink-0" style={{ color: activeTheme.text }}>{a.anotaciones || 0}</div>
                              {sesion.tipo === "creador" && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={(e) => { e.stopPropagation(); restarAnotacion(a.id); }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: activeTheme.surface2, color: activeTheme.text }}>−</button>
                                  <button onClick={(e) => { e.stopPropagation(); sumarAnotacion(a.id); }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: activeTheme.surface2, color: activeTheme.text }}>+</button>
                                  <button onClick={(e) => { e.stopPropagation(); eliminarAnotador(a.id); }}
                                    className="text-xs px-1.5 shrink-0" style={{ color: activeTheme.danger }}>✕</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {sesion.tipo === "creador" && anotadoresOrdenados.length > 0 && (
                      <div className="text-[11px] text-center" style={{ color: activeTheme.textDim }}>Doble click sobre un jugador para sumarle una anotación.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ MODAL: AGREGAR ANOTADOR (elegir equipo → elegir jugador) ============ */}
        {modalAnotador && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalAnotador}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden max-h-[80vh] flex flex-col"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              {modalAnotador.paso === "equipo" ? (
                <>
                  <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Elige el equipo</div>
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    {equipos.length === 0 && (
                      <div className="text-xs" style={{ color: activeTheme.textDim }}>Todavía no hay equipos en la liga.</div>
                    )}
                    {equipos.map((eq) => (
                      <button key={eq.id} onClick={() => elegirEquipoAnotador(eq)}
                        className="w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5"
                        style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                          style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                          {eq.foto ? <img src={eq.foto} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <span className="flex-1 text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{eq.nombre}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={cerrarModalAnotador} className="w-full py-3 rounded-lg font-semibold text-sm mt-4"
                    style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[11px] f-mono uppercase tracking-wide" style={{ color: activeTheme.textDim }}>{modalAnotador.equipoNombre} — elige el jugador</div>
                    <button onClick={() => setModalAnotador({ paso: "equipo" })} className="text-xs" style={{ color: activeTheme.textDim }}>Atrás</button>
                  </div>
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    {rostersEquipos[modalAnotador.equipoId]?.cargando && (
                      <div className="text-xs" style={{ color: activeTheme.textDim }}>Cargando roster…</div>
                    )}
                    {rostersEquipos[modalAnotador.equipoId]?.cargado && (rostersEquipos[modalAnotador.equipoId]?.jugadores || []).length === 0 && (
                      <div className="text-xs" style={{ color: activeTheme.textDim }}>Este equipo todavía no ha registrado jugadores.</div>
                    )}
                    {(rostersEquipos[modalAnotador.equipoId]?.jugadores || []).map((j) => {
                      const yaAgregado = anotadores.some((a) => a.jugadorId === j.id);
                      return (
                        <button key={j.id} onClick={() => !yaAgregado && agregarAnotador(j)} disabled={yaAgregado}
                          className="w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5"
                          style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}`, opacity: yaAgregado ? 0.5 : 1 }}>
                          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                            style={{ background: activeTheme.surface, border: `2px solid ${POSITION_COLORS[j.posicion]}` }}>
                            {j.foto ? <img src={j.foto} alt="" className="w-full h-full object-cover" />
                              : <span className="text-[10px] f-mono font-bold" style={{ color: POSITION_COLORS[j.posicion] }}>{j.posicion}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                            <div className="text-[11px]" style={{ color: activeTheme.textDim }}>{j.posicion} · #{j.numero}</div>
                          </div>
                          {yaAgregado && <span className="text-[10px] f-mono uppercase" style={{ color: activeTheme.textDim }}>Ya agregado</span>}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={cerrarModalAnotador} className="w-full py-3 rounded-lg font-semibold text-sm mt-4"
                    style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============ TAB ROSTER (roster de todos los equipos, solo organizador) ============ */}
        {tab === "roster" && (sesion.tipo === "creador" || sesion.tipo === "visitante") && (
          <div>
            {sesion.tipo === "creador" && (
              <div className="rounded-xl p-4 mb-6" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}>
                <div className="text-[11px] f-mono uppercase tracking-wide mb-2" style={{ color: activeTheme.textDim }}>Fecha límite para registrar jugadores</div>
                <div className="flex gap-2">
                  <input type="date" value={fechaLimiteRoster} onChange={(e) => setFechaLimiteRoster(e.target.value)}
                    className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
                    style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }} />
                  {fechaLimiteRoster && (
                    <button onClick={() => setFechaLimiteRoster("")} className="px-3 rounded-md text-xs font-semibold"
                      style={{ background: activeTheme.surface2, color: activeTheme.danger, border: `1px solid ${activeTheme.border}` }}>Quitar</button>
                  )}
                </div>
                <div className="text-[11px] mt-2" style={{ color: activeTheme.textDim }}>
                  {fechaLimiteRoster
                    ? (fechaLimiteRosterPasada
                        ? `Venció el ${formatearFecha(fechaLimiteRoster)} — los equipos ya no pueden agregar jugadores.`
                        : `Los equipos podrán agregar jugadores hasta el ${formatearFecha(fechaLimiteRoster)}.`)
                    : "Sin fecha límite — los equipos pueden registrar jugadores en cualquier momento."}
                </div>
              </div>
            )}

            <div className="f-display text-lg font-bold uppercase mb-4" style={{ color: activeTheme.text }}>Roster</div>
            {equipos.length === 0 && (
              <div className="text-sm py-3" style={{ color: activeTheme.textDim }}>Todavía no hay equipos en la liga.</div>
            )}
            {equipos.map((eq) => {
              const abierta = !!rostersAbiertos[eq.id];
              const estado = rostersEquipos[eq.id];
              const jugadoresEq = estado?.jugadores || [];
              const ofensivaEq = jugadoresEq.filter((j) => j.lado === "ofensiva");
              const defensivaEq = jugadoresEq.filter((j) => j.lado === "defensiva");
              return (
                <div key={eq.id} className="mb-3">
                  <button onClick={() => toggleRosterEquipo(eq.id)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-left select-none"
                    style={{
                      background: abierta ? activeTheme.surface2 : activeTheme.surface,
                      border: `1px solid ${abierta ? activeTheme.offense + "55" : activeTheme.border}`,
                      boxShadow: activeTheme.shadow,
                    }}>
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                        {eq.foto ? <img src={eq.foto} alt="" className="w-full h-full object-cover" /> : null}
                      </span>
                      <span className="f-mono text-sm font-bold uppercase tracking-wide truncate" style={{ color: activeTheme.text }}>{eq.nombre}</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      {estado?.cargado && (
                        <span className="text-[11px] f-mono uppercase" style={{ color: activeTheme.textDim }}>
                          <span className="font-bold" style={{ color: activeTheme.offense }}>{jugadoresEq.length}</span> jugador{jugadoresEq.length !== 1 ? "es" : ""}
                        </span>
                      )}
                      <span style={{
                        display: "inline-flex",
                        transform: abierta ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        color: abierta ? activeTheme.offense : activeTheme.textDim,
                      }}><ChevronIcon /></span>
                    </span>
                  </button>

                  <div style={{ display: "grid", gridTemplateRows: abierta ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease" }}>
                    <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <div className="mt-3 rounded-xl p-4" style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, boxShadow: activeTheme.shadow }}>
                      {estado?.cargando && (
                        <div className="text-xs" style={{ color: activeTheme.textDim }}>Cargando roster…</div>
                      )}
                      {estado?.cargado && jugadoresEq.length === 0 && (
                        <div className="text-xs" style={{ color: activeTheme.textDim }}>Este equipo todavía no ha registrado jugadores.</div>
                      )}
                      {estado?.cargado && jugadoresEq.length > 0 && (
                        <div className="flex flex-col gap-4">
                          {[["Ofensiva", ofensivaEq], ["Defensiva", defensivaEq]].map(([titulo, lista]) => (
                            lista.length > 0 && (
                              <div key={titulo}>
                                <div className="text-[11px] f-mono uppercase tracking-wide mb-2" style={{ color: activeTheme.textDim }}>{titulo}</div>
                                <div className="flex flex-col gap-2">
                                  {lista.map((j) => (
                                    sesion.tipo === "creador" ? (
                                      <button key={j.id} onClick={() => abrirVistaJugador(j, true)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left w-full"
                                        style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                                        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                                          style={{ background: activeTheme.surface, border: `2px solid ${POSITION_COLORS[j.posicion]}` }}>
                                          {j.foto ? <img src={j.foto} alt="" className="w-full h-full object-cover" />
                                            : <span className="text-[10px] f-mono font-bold" style={{ color: POSITION_COLORS[j.posicion] }}>{j.posicion}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                                          <div className="text-xs" style={{ color: activeTheme.textDim }}>{NOMBRES_POSICION[j.posicion]}</div>
                                        </div>
                                        <div className="text-sm f-mono font-bold shrink-0" style={{ color: activeTheme.textDim }}>{j.numero}</div>
                                      </button>
                                    ) : (
                                      // Visitante: solo nombre, posición y número — sin foto ni ficha detallada
                                      <div key={j.id} className="flex items-center gap-3 rounded-lg px-3 py-2"
                                        style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold f-mono shrink-0"
                                          style={{ background: POSITION_COLORS[j.posicion], color: "#0A0D0C" }}>{j.posicion}</span>
                                        <div className="flex-1 min-w-0 text-sm font-semibold truncate" style={{ color: activeTheme.text }}>{j.nombre}</div>
                                        <div className="text-sm f-mono font-bold shrink-0" style={{ color: activeTheme.textDim }}>{j.numero}</div>
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ MODAL: ACCIONES DEL ENCUENTRO (engranaje) ============ */}
        {menuPartidoAbierto && (() => {
          const p = partidosLiga.find((x) => x.id === menuPartidoAbierto);
          if (!p) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setMenuPartidoAbierto(null)}>
              <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
                style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
                onClick={(e) => e.stopPropagation()}>
                <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>
                  {p.bye ? "Descanso (BYE)" : `${p.local} vs. ${p.visitante}`}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setMenuPartidoAbierto(null); abrirEditarPartido(p); }}
                    className="w-full py-3 rounded-lg font-semibold text-sm"
                    style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Editar encuentro</button>
                  <button onClick={() => { setMenuPartidoAbierto(null); eliminarPartido(p.id); }}
                    className="w-full py-3 rounded-lg font-semibold text-sm"
                    style={{ background: activeTheme.surface2, color: activeTheme.danger }}>Eliminar encuentro</button>
                  <button onClick={() => setMenuPartidoAbierto(null)}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm" style={{ color: activeTheme.textDim }}>Cancelar</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============ MODAL: AGREGAR JUEGO ============ */}
        {modalPartidoAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setModalPartidoAbierto(false)}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Agregar juego</div>

              <button onClick={() => setEsBye((v) => !v)}
                className="w-full flex items-center justify-between mb-3 rounded-md px-3 py-2.5"
                style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                <span className="text-sm font-medium" style={{ color: activeTheme.text }}>Descanso (BYE)</span>
                <span className="w-11 h-6 rounded-full relative shrink-0" style={{ background: esBye ? activeTheme.offense : activeTheme.border }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ background: activeTheme.text, left: esBye ? "22px" : "2px", transition: "left 0.15s" }} />
                </span>
              </button>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-24">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Jornada</div>
                    <select value={jornadaPartido} onChange={(e) => setJornadaPartido(e.target.value)}
                      className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle}>
                      {opcionesJornada.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Fecha</div>
                    <input type="date" value={fechaPartido} onChange={(e) => setFechaPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Equipo local</div>
                  <select value={localCalendario} onChange={(e) => onCambiarLocalCalendario(e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                    {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                  </select>
                </div>

                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Equipo visitante</div>
                    <select value={visitanteCalendario} onChange={(e) => setVisitanteCalendario(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                      <option value="">Selecciona rival</option>
                      {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                  </div>
                )}

                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Hora</div>
                    <input type="time" value={horaPartido} onChange={(e) => setHoraPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
                {!esBye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Lugar (se llena solo con el del equipo local)</div>
                    <input value={lugarPartido} onChange={(e) => setLugarPartido(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
              </div>

              {equipos.length === 0 && (
                <div className="text-[11px] mb-3" style={{ color: activeTheme.textDim }}>
                  Aún no has agregado equipos rivales — hazlo desde la pestaña Liga para poder elegirlos aquí.
                </div>
              )}
              {errorPartido && <div className="text-xs mb-3" style={{ color: activeTheme.danger }}>{errorPartido}</div>}

              <div className="flex gap-2">
                <button onClick={() => setModalPartidoAbierto(false)} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={agregarPartidoCalendario} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Agregar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: EDITAR ENCUENTRO (equipos, hora, marcador, eliminar) ============ */}
        {modalEditarPartido && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarEditarPartido}>
            <div className="w-full max-w-sm rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Editar encuentro</div>

              <button onClick={() => setModalEditarPartido((m) => ({ ...m, bye: !m.bye }))}
                className="w-full flex items-center justify-between mb-3 rounded-md px-3 py-2.5"
                style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                <span className="text-sm font-medium" style={{ color: activeTheme.text }}>Descanso (BYE)</span>
                <span className="w-11 h-6 rounded-full relative shrink-0" style={{ background: modalEditarPartido.bye ? activeTheme.offense : activeTheme.border }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full" style={{ background: activeTheme.text, left: modalEditarPartido.bye ? "22px" : "2px", transition: "left 0.15s" }} />
                </span>
              </button>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-24">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Jornada</div>
                    <select value={modalEditarPartido.jornada}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, jornada: e.target.value }))}
                      className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle}>
                      <option value="">–</option>
                      {opcionesJornada.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Fecha</div>
                    <input type="date" value={modalEditarPartido.fecha}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, fecha: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Equipo local</div>
                  <select value={modalEditarPartido.local} onChange={(e) => onCambiarLocalEdicion(e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                    {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                  </select>
                </div>

                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Equipo visitante</div>
                    <select value={modalEditarPartido.visitante} onChange={(e) => setModalEditarPartido((m) => ({ ...m, visitante: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle}>
                      <option value="">Selecciona rival</option>
                      {listaEquipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                  </div>
                )}

                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Hora</div>
                    <input type="time" value={modalEditarPartido.hora}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, hora: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}
                {!modalEditarPartido.bye && (
                  <div>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim, opacity: 0.65 }}>Lugar</div>
                    <input value={modalEditarPartido.lugar}
                      onChange={(e) => setModalEditarPartido((m) => ({ ...m, lugar: e.target.value }))}
                      className="w-full rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                  </div>
                )}

                {!modalEditarPartido.bye && sesion.tipo === "creador" && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1">
                      <div className="text-[10px] f-mono uppercase mb-1 truncate" style={{ color: activeTheme.textDim }}>{modalEditarPartido.local || "Local"}</div>
                      <input value={modalEditarPartido.marcadorLocal}
                        onChange={(e) => setModalEditarPartido((m) => ({ ...m, marcadorLocal: e.target.value.replace(/[^0-9]/g, "") }))}
                        className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
                    </div>
                    <span className="f-mono text-sm mt-4" style={{ color: activeTheme.textDim }}>–</span>
                    <div className="flex-1">
                      <div className="text-[10px] f-mono uppercase mb-1 truncate" style={{ color: activeTheme.textDim }}>{modalEditarPartido.visitante || "Visitante"}</div>
                      <input value={modalEditarPartido.marcadorVisitante}
                        onChange={(e) => setModalEditarPartido((m) => ({ ...m, marcadorVisitante: e.target.value.replace(/[^0-9]/g, "") }))}
                        className="w-full rounded-md px-2 py-2 text-sm outline-none f-mono text-center" style={inputStyle} />
                    </div>
                  </div>
                )}
                {!modalEditarPartido.bye && sesion.tipo !== "creador" && (
                  <div className="rounded-md px-3 py-2.5" style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                    <div className="text-[10px] f-mono uppercase mb-1" style={{ color: activeTheme.textDim }}>Marcador</div>
                    <div className="text-sm" style={{ color: activeTheme.text }}>
                      {modalEditarPartido.marcadorLocal !== "" && modalEditarPartido.marcadorVisitante !== ""
                        ? `${modalEditarPartido.marcadorLocal} – ${modalEditarPartido.marcadorVisitante}`
                        : "Sin capturar"}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: activeTheme.textDim }}>Solo el organizador puede capturar o cambiar el marcador.</div>
                  </div>
                )}
              </div>

              {errorEditarPartido && <div className="text-xs mb-3" style={{ color: activeTheme.danger }}>{errorEditarPartido}</div>}

              <div className="flex gap-2 mb-2">
                <button onClick={cerrarEditarPartido} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={guardarEdicionPartido} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
              </div>
              <button onClick={eliminarDesdeModal} className="w-full py-2.5 rounded-lg font-semibold text-sm"
                style={{ color: activeTheme.danger }}>Eliminar encuentro</button>
            </div>
          </div>
        )}

        {/* ============ MODAL: AGREGAR/EDITAR EQUIPO ============ */}
        {modalEquipo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalEquipo}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>
                {modalEquipo.modo === "nuevo" ? "Agregar equipo" : "Editar equipo"}
              </div>
              <input type="file" accept="image/*" ref={inputFotoModalEquipo} className="hidden" onChange={onFotoModalEquipoChange} />
              <div className="flex justify-center mb-4">
                <button onClick={() => inputFotoModalEquipo.current?.click()}
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: activeTheme.surface2, border: `1px dashed ${activeTheme.border}` }}>
                  {modalEquipo.foto ? <img src={modalEquipo.foto} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xs" style={{ color: activeTheme.textDim }}>Logo del equipo</span>}
                </button>
              </div>
              {errorFoto && <div className="text-xs mb-3 text-center" style={{ color: activeTheme.danger }}>{errorFoto}</div>}
              <div className="flex flex-col gap-2 mb-4">
                <input placeholder="Nombre del equipo" value={modalEquipo.nombre}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, nombre: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
                <input placeholder="De dónde son (ciudad, estadio...)" value={modalEquipo.lugar}
                  onChange={(e) => setModalEquipo((m) => ({ ...m, lugar: e.target.value }))}
                  className="rounded-md px-3 py-2 text-sm outline-none" style={inputStyle} />
              </div>
              {modalEquipo.modo === "editar" && (
                <div className="text-[11px] mb-4" style={{ color: activeTheme.textDim }}>
                  Si cambias el nombre, se actualiza en todos los juegos del calendario donde aparece.
                </div>
              )}
              {modalEquipo.modo === "editar" && modalEquipo.pin && (
                <div className="flex items-center justify-between mb-4 rounded-md px-3 py-2.5" style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                  <div>
                    <div className="text-[10px] f-mono uppercase" style={{ color: activeTheme.textDim }}>PIN del equipo</div>
                    <div className="f-mono text-lg font-bold tracking-widest" style={{ color: activeTheme.text }}>{modalEquipo.pin}</div>
                  </div>
                  {sesion.tipo === "creador" && (
                    <button onClick={regenerarPinModal} className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: activeTheme.surface, color: activeTheme.text }}>Regenerar</button>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={cerrarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={guardarModalEquipo} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: CONFIRMACIÓN GENÉRICA (borrar jugador/equipo/jugada) ============ */}
        {confirmacion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarConfirmacion}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-2 uppercase tracking-wide" style={{ color: activeTheme.danger }}>{confirmacion.titulo}</div>
              <div className="text-sm mb-5" style={{ color: activeTheme.textDim }}>{confirmacion.mensaje}</div>
              <div className="flex gap-2">
                <button onClick={cerrarConfirmacion} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={ejecutarConfirmacion} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.danger, color: "#FFFFFF" }}>Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: CUENTA (pop up con cerrar sesión / cambiar pin / eliminar liga) ============ */}
        {modalCuenta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={() => setModalCuenta(false)}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Cuenta</div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setModalCuenta(false); cerrarSesion(); }} className="w-full py-3 rounded-lg text-sm font-semibold"
                  style={{ background: activeTheme.surface2, color: activeTheme.danger, border: `1px solid ${activeTheme.border}` }}>Cerrar sesión</button>
                {sesion.tipo === "creador" && (
                  <>
                    <button onClick={abrirModalCambiarPin} className="w-full py-3 rounded-lg text-sm font-semibold"
                      style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cambiar PIN de organizador</button>
                    <button onClick={abrirModalEliminarLiga} className="w-full py-3 rounded-lg text-sm font-semibold"
                      style={{ background: "transparent", color: activeTheme.danger, border: `1px dashed ${activeTheme.danger}66` }}>Eliminar liga</button>
                  </>
                )}
              </div>
              <button onClick={() => setModalCuenta(false)} className="w-full py-2 mt-3 text-xs font-medium" style={{ color: activeTheme.textDim }}>Cerrar</button>
            </div>
          </div>
        )}

        {/* ============ MODAL: ELIMINAR LIGA (requiere PIN de organizador) ============ */}
        {modalEliminarLiga && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalEliminarLiga}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-2 uppercase tracking-wide" style={{ color: activeTheme.danger }}>Eliminar liga</div>
              <div className="text-sm mb-4" style={{ color: activeTheme.textDim }}>
                Esto borra <strong style={{ color: activeTheme.text }}>{ligaNombre || "esta liga"}</strong> por completo: equipos, rosters, playbooks y calendario. No se puede deshacer. Introduce el PIN de organizador para confirmar.
              </div>
              <input placeholder="PIN de organizador" value={pinEliminarLigaInput}
                onChange={(e) => setPinEliminarLigaInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest mb-3"
                style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }} />
              {errorEliminarLiga && <div className="text-xs mb-3" style={{ color: activeTheme.danger }}>{errorEliminarLiga}</div>}
              <div className="flex gap-2">
                <button onClick={cerrarModalEliminarLiga} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={confirmarEliminarLiga} disabled={eliminandoLiga || !pinEliminarLigaInput.trim()}
                  className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.danger, color: "#FFFFFF", opacity: eliminandoLiga || !pinEliminarLigaInput.trim() ? 0.6 : 1 }}>
                  {eliminandoLiga ? "Eliminando…" : "Eliminar liga"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: CAMBIAR PIN DE ORGANIZADOR ============ */}
        {modalCambiarPin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalCambiarPin}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-3 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Cambiar PIN de organizador</div>
              <div className="flex flex-col gap-2 mb-4">
                <input placeholder="PIN actual" value={pinActualInput} type="password" inputMode="numeric"
                  onChange={(e) => setPinActualInput(e.target.value.replace(/[^0-9]/g, ""))}
                  className="rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
                <input placeholder="Nuevo PIN" value={pinNuevoInput} type="password" inputMode="numeric"
                  onChange={(e) => setPinNuevoInput(e.target.value.replace(/[^0-9]/g, ""))}
                  className="rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
                <input placeholder="Confirma el nuevo PIN" value={pinNuevoConfirmarInput} type="password" inputMode="numeric"
                  onChange={(e) => setPinNuevoConfirmarInput(e.target.value.replace(/[^0-9]/g, ""))}
                  className="rounded-md px-3 py-3 text-sm outline-none f-mono text-center tracking-widest" style={inputStyle} />
              </div>
              {errorCambiarPin && <div className="text-xs mb-3" style={{ color: activeTheme.danger }}>{errorCambiarPin}</div>}
              <div className="flex gap-2">
                <button onClick={cerrarModalCambiarPin} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={confirmarCambiarPin} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: DESEMPATES DE LA TABLA (solo organizador) ============ */}
        {modalDesempates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalDesempates}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-2 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Desempates de la tabla</div>
              <div className="text-xs mb-4" style={{ color: activeTheme.textDim }}>
                Si dos o más equipos quedan empatados en victorias, se aplican estos criterios en el orden de la lista hasta romper el empate. Toca uno para activarlo o desactivarlo, y usa las flechas para reordenarlos.
              </div>
              <div className="flex flex-col gap-2 mb-4 max-h-[50vh] overflow-y-auto">
                {CRITERIOS_DESEMPATE_DISPONIBLES.map((c) => {
                  const idx = modalDesempates.indexOf(c.id);
                  const activo = idx !== -1;
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                      style={{ background: activeTheme.surface2, border: `1px solid ${activeTheme.border}` }}>
                      <button onClick={() => toggleCriterioDesempate(c.id)}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ background: activo ? activeTheme.offense : "transparent", border: `1.5px solid ${activo ? activeTheme.offense : activeTheme.border}` }}
                        aria-label={activo ? "Desactivar criterio" : "Activar criterio"}>
                        {activo && <span style={{ color: "#1A1305", fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </button>
                      <div className="flex-1 text-xs font-semibold" style={{ color: activo ? activeTheme.text : activeTheme.textDim }}>
                        {activo ? `${idx + 1}. ` : ""}{c.label}
                      </div>
                      {activo && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => moverCriterioDesempate(idx, -1)} disabled={idx === 0}
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ color: activeTheme.textDim, opacity: idx === 0 ? 0.3 : 1 }} aria-label="Subir">▲</button>
                          <button onClick={() => moverCriterioDesempate(idx, 1)} disabled={idx === modalDesempates.length - 1}
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ color: activeTheme.textDim, opacity: idx === modalDesempates.length - 1 ? 0.3 : 1 }} aria-label="Bajar">▼</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button onClick={cerrarModalDesempates} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={guardarModalDesempates} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODAL: FORMATO DE PLAYOFFS (solo organizador) ============ */}
        {modalPlayoffs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,8,7,0.75)" }} onClick={cerrarModalPlayoffs}>
            <div className="w-full max-w-sm rounded-2xl p-5 overflow-hidden"
              style={{ background: activeTheme.surface, border: `1px solid ${activeTheme.border}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] f-mono mb-2 uppercase tracking-wide" style={{ color: activeTheme.textDim }}>Formato de playoffs</div>
              <div className="text-xs mb-4" style={{ color: activeTheme.textDim }}>
                Elige cuántos equipos clasifican según la tabla de posiciones. Al guardar se arma el bracket con la semilla 1 (mejor lugar) contra la última semilla clasificada, y así sucesivamente.
              </div>
              <div className="flex flex-col gap-2 mb-2">
                {FORMATOS_PLAYOFFS.map((f) => (
                  <button key={f.id} onClick={() => setModalPlayoffs(f.id)}
                    className="w-full flex items-center justify-between text-left py-3 px-4 rounded-lg text-sm font-semibold"
                    style={{
                      background: modalPlayoffs === f.id ? activeTheme.offense : activeTheme.surface2,
                      color: modalPlayoffs === f.id ? "#1A1305" : activeTheme.text,
                      border: `1px solid ${modalPlayoffs === f.id ? activeTheme.offense : activeTheme.border}`,
                    }}>
                    <span>{f.label}</span>
                    <span className="text-[11px] font-normal" style={{ color: modalPlayoffs === f.id ? "#1A1305" : activeTheme.textDim }}>{f.equipos} equipos</span>
                  </button>
                ))}
              </div>
              {equipos.length < (FORMATOS_PLAYOFFS.find((f) => f.id === modalPlayoffs)?.equipos || 0) && (
                <div className="text-[11px] mb-2" style={{ color: activeTheme.danger }}>
                  La liga tiene {equipos.length} equipo{equipos.length === 1 ? "" : "s"} registrados — los lugares sin equipo quedarán como "Por definir".
                </div>
              )}
              {playoffsFormato && (
                <button onClick={desactivarPlayoffs} className="w-full py-2 text-xs font-medium mt-1 mb-2" style={{ color: activeTheme.danger }}>
                  Desactivar playoffs
                </button>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={cerrarModalPlayoffs} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.surface2, color: activeTheme.text, border: `1px solid ${activeTheme.border}` }}>Cancelar</button>
                <button onClick={confirmarFormatoPlayoffs} className="flex-1 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: activeTheme.text, color: activeTheme.bg }}>Guardar</button>
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