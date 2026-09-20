import { cn } from "@/lib/utils";

/**
 * Motivos abstractos, uno por servicio. Son SVG dibujados a mano (no iconos de
 * librería) para que la sección no se parezca a ninguna plantilla.
 *
 * Cada uno tiene su propio gesto en bucle —texto que se escribe, datos que
 * circulan, un punto que orbita— y no sólo una entrada. Eso importa sobre todo
 * en pantallas chicas, donde no existe la columna fija y el motivo es toda la
 * vida que tiene la sección.
 *
 * Los trazos que se dibujan llevan `pathLength={1}`: así una sola longitud de
 * guion sirve para cualquier curva, sin importar cuánto mida de verdad.
 */

const SVG_PROPS = {
  viewBox: "0 0 320 320",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  className: "size-full",
} as const;

const ACCENT = "var(--color-accent)";

function SoftwareMotif() {
  return (
    <svg {...SVG_PROPS}>
      <rect className="motif-item" x="34" y="34" width="118" height="118" rx="18" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="170" y="34" width="116" height="74" rx="18" stroke="currentColor" strokeWidth="2" />
      {/* El bloque de marca respira: es el que "está corriendo". */}
      <rect className="motif-breathe" x="170" y="126" width="116" height="160" rx="18" fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeWidth="2" />
      <rect className="motif-item" x="34" y="170" width="118" height="116" rx="18" stroke="currentColor" strokeWidth="2" />
      <circle className="motif-item" cx="228" cy="206" r="26" stroke={ACCENT} strokeWidth="2" />
      {/* El tilde se dibuja solo, una y otra vez: algo que se completa. */}
      <path className="motif-type" pathLength={1} d="M216 206l9 9 15-18" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: "500ms" }} />
      {/* Renglones que se escriben dentro del bloque grande. */}
      <path className="motif-type" pathLength={1} d="M62 78h62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "200ms" }} />
      <path className="motif-type" pathLength={1} d="M62 104h34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "420ms" }} />
      <path className="motif-type" pathLength={1} d="M62 212h62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "640ms" }} />
      <path className="motif-type" pathLength={1} d="M62 238h44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "860ms" }} />
    </svg>
  );
}

function AppsMotif() {
  return (
    <svg {...SVG_PROPS}>
      <rect className="motif-item" x="22" y="58" width="216" height="158" rx="16" stroke="currentColor" strokeWidth="2" />
      <path className="motif-item" d="M22 92h216" stroke="currentColor" strokeWidth="2" />
      <circle className="motif-item" cx="42" cy="75" r="4" fill="currentColor" />
      <circle className="motif-item" cx="58" cy="75" r="4" fill="currentColor" />
      <circle className="motif-item" cx="74" cy="75" r="4" fill="currentColor" />

      {/* La pantalla del navegador se va cargando de contenido. */}
      <path className="motif-type" pathLength={1} d="M48 120h90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "150ms" }} />
      <path className="motif-type" pathLength={1} d="M48 144h130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "420ms" }} />
      <path className="motif-type" pathLength={1} d="M48 168h72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "690ms" }} />

      <rect className="motif-item" x="196" y="118" width="102" height="168" rx="22" fill="var(--color-ink-950)" fillOpacity="0.55" stroke={ACCENT} strokeWidth="2" />
      <path className="motif-item" d="M232 136h30" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />

      {/* Y el teléfono se carga después, como si fuera la misma app. */}
      <path className="motif-type" pathLength={1} d="M216 174h62" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" style={{ animationDelay: "960ms" }} />
      <path className="motif-type" pathLength={1} d="M216 198h44" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" style={{ animationDelay: "1180ms" }} />
      <path className="motif-type" pathLength={1} d="M216 222h62" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" style={{ animationDelay: "1400ms" }} />
    </svg>
  );
}

function AutomationMotif() {
  return (
    <svg {...SVG_PROPS}>
      <circle className="motif-item motif-spin" cx="160" cy="160" r="96" stroke="currentColor" strokeWidth="2" strokeDasharray="14 12" />
      <circle className="motif-item" cx="160" cy="64" r="22" fill="var(--color-ink-950)" fillOpacity="0.55" stroke={ACCENT} strokeWidth="2" />
      <circle className="motif-item" cx="243" cy="208" r="22" fill="var(--color-ink-950)" fillOpacity="0.55" stroke="currentColor" strokeWidth="2" />
      <circle className="motif-item" cx="77" cy="208" r="22" fill="var(--color-ink-950)" fillOpacity="0.55" stroke="currentColor" strokeWidth="2" />
      <path className="motif-item" d="M150 64h20M160 54v20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path className="motif-item" d="M186 96l22-16-4 22" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="motif-breathe" cx="160" cy="160" r="34" fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeWidth="2" />
      <path className="motif-item" d="M146 160h28M160 146v28" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      {/* Un pulso recorre el ciclo: el proceso corriendo solo. */}
      <g className="motif-orbit" style={{ transformOrigin: "160px 160px" }}>
        <circle cx="160" cy="64" r="7" fill={ACCENT} />
      </g>
    </svg>
  );
}

function AssistantMotif() {
  return (
    <svg {...SVG_PROPS}>
      <path className="motif-item" d="M34 74a16 16 0 0116-16h132a16 16 0 0116 16v58a16 16 0 01-16 16H86l-34 26v-26h-2a16 16 0 01-16-16V74z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* La consulta que entra, escribiéndose. */}
      <path className="motif-type" pathLength={1} d="M68 94h80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "200ms" }} />
      <path className="motif-type" pathLength={1} d="M68 116h52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "480ms" }} />

      <path className="motif-item" d="M286 186a16 16 0 00-16-16H138a16 16 0 00-16 16v58a16 16 0 0016 16h96l34 26v-26h2a16 16 0 0016-16v-58z" fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" />
      {/* Los tres puntos del que está por responder. */}
      <circle className="motif-dot" cx="176" cy="215" r="5" fill={ACCENT} style={{ animationDelay: "0ms" }} />
      <circle className="motif-dot" cx="204" cy="215" r="5" fill={ACCENT} style={{ animationDelay: "180ms" }} />
      <circle className="motif-dot" cx="232" cy="215" r="5" fill={ACCENT} style={{ animationDelay: "360ms" }} />
    </svg>
  );
}

function IntegrationsMotif() {
  return (
    <svg {...SVG_PROPS}>
      <rect className="motif-item" x="26" y="52" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="26" y="130" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="26" y="208" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-breathe" x="218" y="122" width="76" height="76" rx="18" fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeWidth="2" />
      {/* Los datos circulan de los sistemas de la izquierda al de la derecha. */}
      <path className="motif-flow" pathLength={1} d="M102 82c70 0 46 78 116 78" stroke={ACCENT} strokeWidth="2" style={{ animationDelay: "0ms" }} />
      <path className="motif-flow" pathLength={1} d="M102 160h116" stroke={ACCENT} strokeWidth="2" style={{ animationDelay: "-1.2s" }} />
      <path className="motif-flow" pathLength={1} d="M102 238c70 0 46-78 116-78" stroke={ACCENT} strokeWidth="2" style={{ animationDelay: "-2.4s" }} />
      <circle className="motif-item" cx="256" cy="160" r="9" fill={ACCENT} />
    </svg>
  );
}

const MOTIFS = [
  SoftwareMotif,
  AppsMotif,
  AutomationMotif,
  AssistantMotif,
  IntegrationsMotif,
];

export function ServiceVisual({
  index,
  active,
  className,
}: {
  index: number;
  active: boolean;
  className?: string;
}) {
  const Motif = MOTIFS[index % MOTIFS.length];

  return (
    <div data-active={active} className={cn("motif text-chalk-muted", className)}>
      <Motif />
    </div>
  );
}

export const SERVICE_MOTIF_COUNT = MOTIFS.length;
