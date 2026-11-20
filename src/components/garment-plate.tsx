import { useId, type ReactNode } from "react";
import type { GarmentKind } from "@/data/store";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (channel: number) =>
    Math.round(channel + (target - channel) * p)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

type PlateProps = {
  kind: GarmentKind;
  tone: string;
  className?: string;
};

/**
 * Hand-drawn archival plate illustrations. They keep the catalog visually
 * consistent and load instantly, unlike remote product photography.
 */
export function GarmentPlate({ kind, tone, className }: PlateProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ink = "#211c17";
  const isLight = luminance(tone) > 0.6;
  const detail = isLight ? "#211c17" : "#e3d5b9";
  const fill = `url(#plate-fill-${uid})`;
  const weave = `url(#plate-weave-${uid})`;
  const cream = "#efe4ce";

  const jacket =
    "M120 40 C108 40 99 45 94 54 L54 78 L38 226 L66 230 L72 140 L72 258 L168 258 L168 140 L174 230 L202 226 L186 78 L146 54 C141 45 132 40 120 40 Z";
  const shirt =
    "M120 46 L104 54 L70 64 L52 108 L72 122 L90 104 L90 250 L150 250 L150 104 L168 122 L188 108 L170 64 L136 54 Z";
  const polo =
    "M120 48 L104 56 L76 66 L58 130 L82 138 L92 112 L92 250 L148 250 L148 112 L158 138 L182 130 L164 66 L136 56 Z";
  const trousers =
    "M86 56 L154 56 L164 268 L136 268 L124 142 L116 268 L88 268 Z";

  const common = {
    stroke: ink,
    strokeWidth: 1.7,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  const render = () => {
    switch (kind) {
      case "coat":
      case "jacket":
      case "suit":
      case "blazer": {
        const isBlazer = kind === "blazer";
        return (
          <>
            <path d={jacket} fill={fill} {...common} />
            <path d={jacket} fill={weave} stroke="none" />
            <path
              d="M120 56 L104 88 L120 134 L136 88 Z"
              fill={cream}
              {...common}
              strokeWidth={1.3}
            />
            <path
              d="M103 56 L120 92 L113 100 L96 70 Z"
              fill={shade(tone, isLight ? -0.12 : 0.1)}
              {...common}
              strokeWidth={1.2}
            />
            <path
              d="M137 56 L120 92 L127 100 L144 70 Z"
              fill={shade(tone, isLight ? -0.12 : 0.1)}
              {...common}
              strokeWidth={1.2}
            />
            <path
              d="M110 50 L120 64 L130 50"
              fill="none"
              {...common}
              strokeWidth={1.4}
            />
            {isBlazer ? (
              <>
                <path
                  d="M120 96 L120 250"
                  stroke={detail}
                  strokeWidth={1}
                  opacity={0.55}
                />
                <path
                  d="M86 194 H110 V216 H86 Z M130 194 H154 V216 H130 Z"
                  fill="none"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.75}
                />
                <ellipse
                  cx={50}
                  cy={176}
                  rx={12}
                  ry={17}
                  fill={shade(tone, isLight ? -0.14 : 0.12)}
                  stroke={ink}
                  strokeWidth={1.2}
                />
                <ellipse
                  cx={190}
                  cy={176}
                  rx={12}
                  ry={17}
                  fill={shade(tone, isLight ? -0.14 : 0.12)}
                  stroke={ink}
                  strokeWidth={1.2}
                />
              </>
            ) : (
              <>
                <path
                  d="M120 92 l7 12 -3 54 -4 8 -4 -8 -3 -54 z"
                  fill="#8a7050"
                  stroke={ink}
                  strokeWidth={1.1}
                />
                <path
                  d="M85 196 H109 M131 196 H155"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.7}
                />
              </>
            )}
            <circle cx={127} cy={160} r={2.4} fill="#a9884f" stroke={ink} strokeWidth={0.8} />
            <circle cx={127} cy={186} r={2.4} fill="#a9884f" stroke={ink} strokeWidth={0.8} />
            <path
              d="M90 60 C86 92 78 116 72 140 M150 60 C154 92 162 116 168 140"
              fill="none"
              stroke={detail}
              strokeWidth={1}
              opacity={0.6}
            />
            <path
              d="M41 224 L65 228 M175 228 L199 224"
              stroke={detail}
              strokeWidth={1.1}
              opacity={0.55}
            />
            <path d="M72 244 H168" stroke={detail} strokeWidth={0.9} opacity={0.4} />
          </>
        );
      }
      case "shirt":
      case "polo": {
        const isPolo = kind === "polo";
        const body = isPolo ? polo : shirt;
        return (
          <>
            <path d={body} fill={fill} {...common} />
            <path d={body} fill={weave} stroke="none" />
            {isPolo ? (
              <>
                <path
                  d="M106 56 L120 78 L134 56 L120 50 Z"
                  fill={shade(tone, isLight ? -0.1 : 0.14)}
                  {...common}
                  strokeWidth={1.2}
                />
                <path
                  d="M120 78 V96 M120 78 L110 64 M120 78 L130 64"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.8}
                />
                <circle cx={120} cy={88} r={1.8} fill={detail} />
                <path
                  d="M94 150 h-12 v18 h12"
                  fill="none"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.7}
                />
                <path
                  d="M92 238 H148"
                  stroke={detail}
                  strokeWidth={1.2}
                  opacity={0.5}
                />
              </>
            ) : (
              <>
                <path
                  d="M120 50 L102 62 L114 88 L120 72 Z"
                  fill={cream}
                  {...common}
                  strokeWidth={1.2}
                />
                <path
                  d="M120 50 L138 62 L126 88 L120 72 Z"
                  fill={cream}
                  {...common}
                  strokeWidth={1.2}
                />
                <path
                  d="M120 88 V250"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.55}
                />
                {[108, 132, 156, 180, 204, 228].map((y) => (
                  <circle
                    key={y}
                    cx={120}
                    cy={y}
                    r={2.2}
                    fill={detail}
                    opacity={0.75}
                  />
                ))}
                <path
                  d="M92 146 H82 V168 H92"
                  fill="none"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.65}
                />
                <path
                  d="M60 112 L74 122 M180 112 L166 122"
                  stroke={detail}
                  strokeWidth={1.1}
                  opacity={0.55}
                />
              </>
            )}
          </>
        );
      }
      case "trousers":
        return (
          <>
            <path d={trousers} fill={fill} {...common} />
            <path d={trousers} fill={weave} stroke="none" />
            <path
              d="M86 56 H154 V74 H86 Z"
              fill={shade(tone, isLight ? -0.1 : 0.12)}
              {...common}
              strokeWidth={1.2}
            />
            <path d="M120 74 V148" stroke={detail} strokeWidth={1} opacity={0.55} />
            <path
              d="M96 84 C104 96 106 104 106 112 M144 84 C136 96 134 104 134 112"
              fill="none"
              stroke={detail}
              strokeWidth={1.1}
              opacity={0.6}
            />
            <path
              d="M102 74 V82 M138 74 V82"
              stroke={detail}
              strokeWidth={1.4}
              opacity={0.7}
            />
            <path
              d="M92 254 H118 M126 254 H160"
              stroke={detail}
              strokeWidth={1}
              opacity={0.5}
            />
          </>
        );
      case "shoes":
        return (
          <>
            <path
              d="M42 228 V208 C42 194 54 188 68 184 L104 172 L122 194 L160 204 C188 210 202 219 202 233 V244 H42 Z"
              fill={fill}
              {...common}
            />
            <path
              d="M42 228 V208 C42 194 54 188 68 184 L104 172 L122 194 L160 204 C188 210 202 219 202 233 V244 H42 Z"
              fill={weave}
              stroke="none"
            />
            <path
              d="M42 244 H202"
              stroke={ink}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <path
              d="M104 172 C112 186 106 198 96 210 M112 176 C122 186 118 200 108 212 M122 194 C134 200 140 210 138 220"
              fill="none"
              stroke={detail}
              strokeWidth={1.1}
              opacity={0.8}
            />
            <path
              d="M152 206 C170 212 182 220 184 232"
              fill="none"
              stroke={detail}
              strokeWidth={1}
              opacity={0.6}
            />
            <path
              d="M54 204 C56 196 62 192 70 190"
              fill="none"
              stroke={detail}
              strokeWidth={1}
              opacity={0.5}
            />
            <path d="M64 240 V244 M84 240 V244" stroke={detail} strokeWidth={1} opacity={0.5} />
          </>
        );
      case "watch":
        return (
          <>
            <rect
              x={104}
              y={54}
              width={32}
              height={74}
              rx={7}
              fill={shade(tone, -0.25)}
              {...common}
              strokeWidth={1.4}
            />
            <rect
              x={104}
              y={172}
              width={32}
              height={74}
              rx={7}
              fill={shade(tone, -0.25)}
              {...common}
              strokeWidth={1.4}
            />
            <circle cx={120} cy={150} r={48} fill={cream} {...common} strokeWidth={1.8} />
            <circle
              cx={120}
              cy={150}
              r={40}
              fill={fill}
              {...common}
              strokeWidth={1.2}
            />
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (index * 30 * Math.PI) / 180;
              const outer = 34;
              const inner = index % 3 === 0 ? 27 : 30;
              return (
                <line
                  key={index}
                  x1={120 + Math.sin(angle) * inner}
                  y1={150 - Math.cos(angle) * inner}
                  x2={120 + Math.sin(angle) * outer}
                  y2={150 - Math.cos(angle) * outer}
                  stroke={detail}
                  strokeWidth={index % 3 === 0 ? 1.6 : 0.9}
                  opacity={0.8}
                />
              );
            })}
            <line
              x1={120}
              y1={150}
              x2={120}
              y2={124}
              stroke={ink}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={120}
              y1={150}
              x2={140}
              y2={160}
              stroke={ink}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
            <circle cx={120} cy={150} r={2.4} fill={ink} />
            <rect
              x={166}
              y={143}
              width={7}
              height={13}
              rx={2}
              fill={shade(tone, -0.15)}
              stroke={ink}
              strokeWidth={1.1}
            />
          </>
        );
      case "tie":
        return (
          <>
            <path
              d="M120 52 L140 68 L130 92 L120 102 L110 92 L100 68 Z"
              fill={fill}
              {...common}
            />
            <path
              d="M110 92 L120 102 L130 92 L152 118 L130 258 H110 L88 118 Z"
              fill={fill}
              {...common}
            />
            <path
              d="M110 92 L120 102 L130 92 L152 118 L130 258 H110 L88 118 Z"
              fill={weave}
              stroke="none"
            />
            <path
              d="M98 128 L142 118 M94 160 L128 152 M92 192 L124 186 M94 224 L122 218"
              stroke={detail}
              strokeWidth={1.2}
              opacity={0.5}
            />
            <path d="M110 258 H130" stroke={ink} strokeWidth={1.4} />
          </>
        );
      case "belt":
        return (
          <>
            <rect
              x={42}
              y={116}
              width={156}
              height={68}
              rx={30}
              fill={fill}
              {...common}
            />
            <rect
              x={42}
              y={116}
              width={156}
              height={68}
              rx={30}
              fill={weave}
              stroke="none"
            />
            <rect
              x={54}
              y={130}
              width={132}
              height={40}
              rx={18}
              fill="none"
              stroke={detail}
              strokeWidth={1.1}
              opacity={0.55}
            />
            <rect
              x={176}
              y={108}
              width={34}
              height={84}
              rx={6}
              fill="none"
              stroke={ink}
              strokeWidth={2}
            />
            <path
              d="M192 108 V192 M176 150 H188"
              stroke={ink}
              strokeWidth={1.4}
            />
            {[196, 206, 216].map((x) => (
              <circle key={x} cx={x} cy={150} r={2} fill={detail} opacity={0.7} />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 240 300"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="رسم توضيحي للقطعة"
    >
      <defs>
        <linearGradient id={`plate-fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(tone, 0.14)} />
          <stop offset="55%" stopColor={tone} />
          <stop offset="100%" stopColor={shade(tone, -0.18)} />
        </linearGradient>
        <pattern
          id={`plate-weave-${uid}`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 6 L6 0"
            stroke={detail}
            strokeWidth="0.4"
            opacity="0.22"
          />
        </pattern>
      </defs>
      <ellipse cx={120} cy={268} rx={82} ry={9} fill={ink} opacity={0.07} />
      {render()}
    </svg>
  );
}

/** Framed aged-paper product plate used across cards, hero and cart. */
export function ProductPlate({
  kind,
  tone,
  className,
  plateClassName,
  framed = true,
  children,
}: {
  kind: GarmentKind;
  tone: string;
  className?: string;
  plateClassName?: string;
  framed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden paper-texture", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,252,244,0.92),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(90deg,rgba(33,28,23,0.05)_0px,rgba(33,28,23,0.05)_1px,transparent_1px,transparent_7px)]" />
      <GarmentPlate
        kind={kind}
        tone={tone}
        className={cn("absolute inset-0 h-full w-full p-5", plateClassName)}
      />
      {framed && (
        <div className="pointer-events-none absolute inset-3 border border-ink/12" />
      )}
      {children}
    </div>
  );
}
