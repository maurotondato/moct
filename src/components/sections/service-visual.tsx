import { cn } from "@/lib/utils";

/**
 * Motivos abstractos, uno por servicio. Son SVG dibujados a mano (no iconos de
 * librería) para que la sección no se parezca a ninguna plantilla.
 *
 * Los cinco comparten grilla, grosor de trazo y lenguaje geométrico: cambian de
 * figura sin cambiar de familia. La animación de entrada la maneja el CSS a
 * partir de `data-active`, con retraso escalonado por hijo.
 */

const SVG_PROPS = {
  viewBox: "0 0 320 320",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  className: "size-full",
  strokeWidth: 2,
} as const;

function SoftwareMotif() {
  return (
    <svg {...SVG_PROPS}>
      <rect className="motif-item" x="34" y="34" width="118" height="118" rx="18" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="170" y="34" width="116" height="74" rx="18" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="170" y="126" width="116" height="160" rx="18" fill="var(--color-accent)" fillOpacity="0.14" stroke="var(--color-accent)" strokeWidth="2" />
      <rect className="motif-item" x="34" y="170" width="118" height="116" rx="18" stroke="currentColor" strokeWidth="2" />
      <circle className="motif-item" cx="228" cy="206" r="26" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-item" d="M216 206l9 9 15-18" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <path className="motif-item" d="M48 120h90M48 144h130M48 168h72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect className="motif-item" x="196" y="118" width="102" height="168" rx="22" fill="var(--color-ink-950)" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-item" d="M232 136h30" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path className="motif-item" d="M216 174h62M216 198h44M216 222h62" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
    </svg>
  );
}

function AutomationMotif() {
  return (
    <svg {...SVG_PROPS}>
      <circle className="motif-item motif-spin" cx="160" cy="160" r="96" stroke="currentColor" strokeWidth="2" strokeDasharray="14 12" />
      <circle className="motif-item" cx="160" cy="64" r="22" fill="var(--color-ink-950)" stroke="var(--color-accent)" strokeWidth="2" />
      <circle className="motif-item" cx="243" cy="208" r="22" fill="var(--color-ink-950)" stroke="currentColor" strokeWidth="2" />
      <circle className="motif-item" cx="77" cy="208" r="22" fill="var(--color-ink-950)" stroke="currentColor" strokeWidth="2" />
      <path className="motif-item" d="M150 64h20M160 54v20" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path className="motif-item" d="M186 96l22-16-4 22" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="motif-item" cx="160" cy="160" r="34" fill="var(--color-accent)" fillOpacity="0.14" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-item" d="M146 160h28M160 146v28" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function AssistantMotif() {
  return (
    <svg {...SVG_PROPS}>
      <path className="motif-item" d="M34 74a16 16 0 0116-16h132a16 16 0 0116 16v58a16 16 0 01-16 16H86l-34 26v-26h-2a16 16 0 01-16-16V74z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path className="motif-item" d="M68 94h80M68 116h52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="motif-item" d="M286 186a16 16 0 00-16-16H138a16 16 0 00-16 16v58a16 16 0 0016 16h96l34 26v-26h2a16 16 0 0016-16v-58z" fill="var(--color-accent)" fillOpacity="0.14" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
      <circle className="motif-item" cx="176" cy="215" r="5" fill="var(--color-accent)" />
      <circle className="motif-item" cx="204" cy="215" r="5" fill="var(--color-accent)" />
      <circle className="motif-item" cx="232" cy="215" r="5" fill="var(--color-accent)" />
    </svg>
  );
}

function IntegrationsMotif() {
  return (
    <svg {...SVG_PROPS}>
      <rect className="motif-item" x="26" y="52" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="26" y="130" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="26" y="208" width="76" height="60" rx="14" stroke="currentColor" strokeWidth="2" />
      <rect className="motif-item" x="218" y="122" width="76" height="76" rx="18" fill="var(--color-accent)" fillOpacity="0.14" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-draw" pathLength={1} d="M102 82c70 0 46 78 116 78" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-draw" pathLength={1} d="M102 160h116" stroke="var(--color-accent)" strokeWidth="2" />
      <path className="motif-draw" pathLength={1} d="M102 238c70 0 46-78 116-78" stroke="var(--color-accent)" strokeWidth="2" />
      <circle className="motif-item" cx="256" cy="160" r="9" fill="var(--color-accent)" />
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
    <div
      data-active={active}
      className={cn("motif text-chalk-muted", className)}
    >
      <Motif />
    </div>
  );
}

export const SERVICE_MOTIF_COUNT = MOTIFS.length;
