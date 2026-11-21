import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import type { Product } from "@/data/store";
import { getSizeDetails, type SizeDetails } from "@/lib/size-guide";
import { cn } from "@/lib/utils";

function formatMeasure(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function SizeGuide({
  product,
  size,
  compact = false,
}: {
  product: Product;
  size: string;
  compact?: boolean;
}) {
  const details = useMemo(() => getSizeDetails(product, size), [product, size]);

  return (
    <motion.div
      key={`${product.id}-${size}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mt-3 overflow-hidden border border-ink/12 bg-card",
        compact && "mt-2.5",
      )}
    >
      <div className="flex items-center justify-between border-b border-ink/10 bg-paper-deep/50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center border border-gold/40 text-gold">
            <Ruler className="size-3" />
          </span>
          <p className="text-[10px] font-medium text-ink">
            دليل مقاس{" "}
            <span className="mono text-[11px] text-gold">{details.size}</span>
          </p>
        </div>
        <span className="mono text-[7px] tracking-[0.16em] text-ink-soft/45">
          CM / APPROX.
        </span>
      </div>

      <div
        className={cn(
          "grid",
          compact
            ? "grid-cols-[112px_1fr]"
            : "sm:grid-cols-[190px_1fr]",
        )}
      >
        <div className="relative flex items-center justify-center border-b border-ink/10 bg-paper-deep/35 px-2 py-3 sm:border-b-0 sm:border-e">
          <SizeFigure details={details} />
        </div>

        <div className="p-3">
          <div className="grid grid-cols-3 gap-1.5">
            <Metric
              label={details.widthLabel}
              value={formatMeasure(details.width)}
            />
            <Metric
              label={details.lengthLabel}
              value={formatMeasure(details.length)}
            />
            <Metric label={details.heightLabel} value={details.height} />
          </div>

          {!compact && (
            <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-ink/10 pt-2">
              {details.secondary.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-[7.5px] leading-4 text-ink-soft/50">
                    {item.label}
                  </p>
                  <p className="mono mt-0.5 text-[9.5px] leading-4 text-ink/80">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!compact && (
            <p className="mt-2 border-t border-ink/10 pt-2 text-[8.5px] leading-4 text-ink-soft/55">
              {details.note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 bg-paper-deep/45 px-1.5 py-2 text-center">
      <p className="text-[7.5px] leading-4 text-ink-soft/60">{label}</p>
      <p className="mt-0.5 flex items-baseline justify-center gap-0.5">
        <span className="mono text-[13px] leading-5 text-ink" dir="ltr">
          {value}
        </span>
        <span className="text-[7.5px] text-gold">سم</span>
      </p>
    </div>
  );
}

function SizeFigure({ details }: { details: SizeDetails }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const accent = `var(--gold)`;
  const showBodyHeight = details.height.includes("–");

  return (
    <svg
      viewBox="0 0 200 236"
      role="img"
      aria-label={`رسم قياس: ${details.widthLabel} ${formatMeasure(details.width)} سم، ${details.lengthLabel} ${formatMeasure(details.length)} سم، ${details.heightLabel} ${details.height} سم`}
      className="h-auto w-full max-w-[180px]"
    >
      <defs>
        <pattern
          id={`grid-${uid}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            style={{ stroke: "var(--ink)", strokeOpacity: 0.06 }}
            strokeWidth="0.7"
          />
        </pattern>
      </defs>

      <rect width="200" height="236" fill={`url(#grid-${uid})`} />

      {/* Height scale beside the figure */}
      {showBodyHeight && (
        <>
          <line
            x1="174"
            y1="46"
            x2="174"
            y2="210"
            style={{ stroke: accent, strokeOpacity: 0.7 }}
            strokeWidth="1"
          />
          {[46, 70, 94, 118, 142, 166, 190, 210].map((y) => (
            <line
              key={y}
              x1="170"
              y1={y}
              x2="178"
              y2={y}
              style={{ stroke: accent, strokeOpacity: 0.65 }}
              strokeWidth="1"
            />
          ))}
          <text
            x="174"
            y="32"
            textAnchor="middle"
            style={{ fill: accent }}
            fontSize="6.5"
            letterSpacing="1"
            fontFamily="IBM Plex Mono, monospace"
          >
            HEIGHT
          </text>
          <text
            x="174"
            y="41"
            textAnchor="middle"
            style={{ fill: "var(--ink-soft)" }}
            fontSize="6"
            fontFamily="IBM Plex Mono, monospace"
          >
            {details.height}
          </text>
        </>
      )}

      {/* Figure */}
      <g
        style={{
          stroke: "var(--ink)",
          strokeOpacity: 0.5,
          fill: "none",
        }}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="95" cy="32" r="11" />
        <path d="M95 43 L95 50" />
        <path d="M75 62 Q95 51 115 62" />
        <path d="M75 62 Q70 88 74 112 L80 118" />
        <path d="M115 62 Q120 88 116 112 L110 118" />
        <path d="M81 120 L79 207" />
        <path d="M109 120 L111 207" />
      </g>

      {/* Jacket body */}
      <path
        d="M75 62 Q95 53 115 62 L112 121 Q95 130 78 121 Z"
        style={{
          fill: accent,
          fillOpacity: 0.09,
          stroke: "var(--ink)",
          strokeOpacity: 0.45,
        }}
        strokeWidth="1.2"
      />
      <line
        x1="95"
        y1="58"
        x2="95"
        y2="126"
        strokeDasharray="2 3"
        style={{ stroke: "var(--ink)", strokeOpacity: 0.22 }}
        strokeWidth="0.9"
      />

      {/* Garment length marker inside the body */}
      <line
        x1="101"
        y1="64"
        x2="101"
        y2="120"
        style={{ stroke: accent }}
        strokeWidth="1.2"
      />
      <circle cx="101" cy="64" r="2.2" style={{ fill: accent }} />
      <circle cx="101" cy="120" r="2.2" style={{ fill: accent }} />
      <text
        x="106"
        y="94"
        style={{ fill: accent }}
        fontSize="6.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        L {formatMeasure(details.length)}
      </text>

      {/* Horizontal chest width */}
      <line
        x1="44"
        y1="92"
        x2="146"
        y2="92"
        style={{ stroke: accent }}
        strokeWidth="1.2"
      />
      <line
        x1="44"
        y1="87"
        x2="44"
        y2="97"
        style={{ stroke: accent }}
        strokeWidth="1.3"
      />
      <line
        x1="146"
        y1="87"
        x2="146"
        y2="97"
        style={{ stroke: accent }}
        strokeWidth="1.3"
      />
      <rect
        x="70"
        y="79"
        width="50"
        height="11"
        style={{ fill: "var(--card)" }}
        opacity="0.92"
      />
      <text
        x="95"
        y="87.5"
        textAnchor="middle"
        style={{ fill: accent }}
        fontSize="6.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        W {formatMeasure(details.width)} CM
      </text>

      {/* Footnotes */}
      <text
        x="12"
        y="225"
        style={{ fill: "var(--ink-soft)", fillOpacity: 0.65 }}
        fontSize="6.5"
      >
        عرضي / طولي
      </text>
      <line
        x1="12"
        y1="228"
        x2="63"
        y2="228"
        style={{ stroke: accent, strokeOpacity: 0.4 }}
        strokeWidth="1"
      />
    </svg>
  );
}
