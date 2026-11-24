import { useMemo, useState } from "react";
import {
  Info,
  Maximize2,
  Ruler,
  ScanLine,
} from "lucide-react";
import type { Product } from "@/data/store";
import {
  getSizeChoices,
  getSizeDetails,
  hasStandardSizes,
  type SizeChoice,
  type SizeDetails,
  type SizeSystem,
} from "@/lib/size-guide";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProductSizePicker({
  product,
  value,
  onChange,
  compact = false,
}: {
  product: Product;
  value: string;
  onChange: (value: string, label: string) => void;
  compact?: boolean;
}) {
  const [system, setSystem] = useState<SizeSystem>("standard");
  const [open, setOpen] = useState(false);
  const choices = useMemo(() => getSizeChoices(product), [product]);
  const details = useMemo(
    () => getSizeDetails(product, value),
    [product, value],
  );
  const active =
    choices.find((choice) => choice.value === value) ?? choices[0];
  const supportsSystems = hasStandardSizes(product);

  const labelFor = (choice: SizeChoice, mode: SizeSystem) =>
    mode === "standard" ? choice.standard : choice.eu;

  const changeSystem = (next: SizeSystem) => {
    setSystem(next);
    if (active) onChange(active.value, labelFor(active, next));
  };

  const chooseSize = (choice: SizeChoice) => {
    if (choice.value === value) {
      setOpen(true);
      return;
    }
    onChange(choice.value, labelFor(choice, system));
  };

  return (
    <div className={cn(compact ? "mt-4" : "mt-6")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-ink">المقاس</p>
        <div className="flex flex-wrap items-center gap-2">
          {supportsSystems && (
            <SystemToggle value={system} onChange={changeSystem} />
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 text-[9px] text-ink-soft/55 transition-colors hover:text-gold"
          >
            <Ruler className="size-3 text-gold" />
            دليل القياس
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {choices.map((choice) => {
          const selected = choice.value === value;
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => chooseSize(choice)}
              aria-pressed={selected}
              title={
                selected
                  ? "اضغط مرة أخرى لعرض تفاصيل القياسات"
                  : `اختر مقاس ${labelFor(choice, system)}`
              }
              className={cn(
                "mono flex h-11 min-w-11 items-center justify-center rounded-full border px-3.5 text-[11px] transition-all duration-200",
                selected
                  ? "border-gold bg-gold text-espresso shadow-[0_6px_18px_-10px_color-mix(in_srgb,var(--gold)_80%,transparent)]"
                  : "border-ink/20 bg-card text-ink hover:border-ink/50 hover:bg-paper-deep/60",
              )}
            >
              {labelFor(choice, system)}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border border-ink/10 bg-paper-deep/35 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ink-soft/65">
          {details.summary.map((metric) => (
            <span key={metric.label} className="flex items-baseline gap-1">
              <span className="text-ink-soft/45">{metric.label}:</span>
              <span className="mono text-[10.5px] text-ink" dir="ltr">
                {metric.value}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-1.5 flex items-start gap-1.5 text-[8.5px] leading-4 text-ink-soft/45">
          <Info className="mt-px size-2.5 shrink-0 text-gold/70" />
          {details.fitNote}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 flex w-full items-center justify-center gap-1.5 text-[8.5px] text-ink-soft/40 transition-colors hover:text-gold lg:justify-start"
      >
        <ScanLine className="size-3" />
        اضغط على المقاس المحدد مرة أخرى لعرض تفاصيل القياسات
      </button>

      <SizeDetailsDialog
        open={open}
        onOpenChange={setOpen}
        product={product}
        value={value}
        details={details}
        choices={choices}
        system={system}
        supportsSystems={supportsSystems}
        onSystemChange={changeSystem}
        onSelect={(choice) => chooseSize(choice)}
      />
    </div>
  );
}

function SystemToggle({
  value,
  onChange,
}: {
  value: SizeSystem;
  onChange: (next: SizeSystem) => void;
}) {
  return (
    <div className="flex overflow-hidden border border-ink/15 text-[8.5px]">
      {[
        { id: "standard" as const, label: "Standard" },
        { id: "eu" as const, label: "EU" },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={cn(
            "px-2.5 py-1.5 transition-colors",
            value === option.id
              ? "bg-ink text-paper"
              : "text-ink-soft/60 hover:bg-paper-deep hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SizeDetailsDialog({
  open,
  onOpenChange,
  product,
  value,
  details,
  choices,
  system,
  supportsSystems,
  onSystemChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  value: string;
  details: SizeDetails;
  choices: SizeChoice[];
  system: SizeSystem;
  supportsSystems: boolean;
  onSystemChange: (next: SizeSystem) => void;
  onSelect: (choice: SizeChoice) => void;
}) {
  const active =
    choices.find((choice) => choice.value === value) ?? choices[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[93vh] w-[calc(100%-1.5rem)] max-w-5xl overflow-y-auto rounded-none border-ink/15 bg-card p-0 shadow-2xl sm:max-w-5xl [&>button]:z-30">
        <div className="sticky top-0 z-20 border-b border-ink/10 bg-card/95 px-5 py-4 ps-12 backdrop-blur-md">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mono text-[8px] tracking-[0.2em] text-gold">
                SIZE LAB / {product.kind.toUpperCase()}
              </p>
              <DialogTitle className="mt-1.5 text-xl text-ink sm:text-2xl">
                تفاصيل القياسات
              </DialogTitle>
              <DialogDescription className="mt-1 text-[10px] text-ink-soft/55">
                {product.name} — قياسات الجسم والقطعة بالسنتيمتر.
              </DialogDescription>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-ink-soft/45">
                  المقاس المعروض
                </span>
                {supportsSystems && (
                  <SystemToggle value={system} onChange={onSystemChange} />
                )}
              </div>
              <span className="mono text-[9px] text-gold">
                {active?.standard}
                {active && active.eu !== active.standard
                  ? ` · EU ${active.eu}`
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center border border-gold/35 text-gold">
                <Maximize2 className="size-3.5" />
              </span>
              <div>
                <p className="text-[10.5px] font-medium text-ink">
                  اختر مقاساً لعرض تفاصيله
                </p>
                <p className="text-[8.5px] text-ink-soft/45">
                  المقاس المحدد الآن: {active ? active.standard : details.size}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {choices.map((choice) => {
                const selected = choice.value === value;
                const label =
                  system === "standard" ? choice.standard : choice.eu;
                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => onSelect(choice)}
                    className={cn(
                      "mono flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[10px] transition-colors",
                      selected
                        ? "border-gold bg-gold text-espresso"
                        : "border-ink/20 text-ink hover:border-ink/50",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-3xl border border-ink/10 bg-card p-3">
            <div className="flex items-center justify-between">
                <p className="mono text-[8px] tracking-[0.16em] text-gold">
                  GARMENT FLAT
                </p>
                <span className="mono text-[7.5px] text-ink-soft/40">
                  CM / {details.standardSize}
                </span>
              </div>
              <GarmentFlat product={product} details={details} />
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {details.garment.map((metric) => (
                  <div
                    key={metric.key}
                    className="flex items-baseline justify-between gap-2 border border-ink/10 bg-paper-deep/35 px-2.5 py-2"
                  >
                    <span className="text-[8px] text-ink-soft/55">
                      {metric.label}
                    </span>
                    <span className="mono text-[10px] text-ink" dir="ltr">
                      {metric.value}
                      <span className="ms-0.5 text-[7px] text-gold">سم</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {details.summary.map((metric) => (
              <div
                key={metric.label}
                className="border border-ink/10 bg-paper-deep/30 px-2 py-2.5 text-center"
              >
                <p className="text-[8px] text-ink-soft/50">{metric.label}</p>
                <p className="mono mt-1 text-[12px] text-ink" dir="ltr">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 border border-gold/20 bg-gold/[0.04] px-3 py-2.5">
            <Info className="mt-0.5 size-3 shrink-0 text-gold" />
            <div>
              <p className="text-[9px] leading-5 text-ink-soft/65">
                {details.note}
              </p>
              <p className="mt-0.5 text-[8.5px] text-gold/75">
                {details.fitNote}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GarmentFlat({
  product,
  details,
}: {
  product: Product;
  details: SizeDetails;
}) {
  const metric = (key: string) =>
    details.garment.find((item) => item.key === key)?.value ?? "—";
  const isTop = details.profile === "top";
  const isBottom = details.profile === "bottom";
  const isShoe = details.profile === "shoes";
  const isShirt = product.kind === "shirt" || product.kind === "polo";

  if (isTop) {
    return (
      <svg viewBox="0 0 300 330" className="mx-auto h-auto w-full max-w-[310px]">
        <defs>
          <linearGradient id="garment-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--paper-deep)" />
            <stop offset="1" stopColor="var(--card)" />
          </linearGradient>
        </defs>
        <path
          d="M150 34 L121 48 L82 66 L58 158 L82 167 L98 125 L98 286 Q150 296 202 286 L202 125 L218 167 L242 158 L218 66 L179 48 Z"
          fill="url(#garment-fill)"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.45 }}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M150 34 L132 49 L150 92 L168 49 Z"
          fill="var(--card)"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.35 }}
          strokeWidth="1.1"
        />
        <path
          d="M150 92 V286"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.2 }}
          strokeWidth="1"
        />
        {!isShirt && (
          <>
            <path
              d="M128 52 L150 96 L138 105 L122 66 Z"
              style={{ fill: "var(--ink)", fillOpacity: 0.06 }}
            />
            <path
              d="M172 52 L150 96 L162 105 L178 66 Z"
              style={{ fill: "var(--ink)", fillOpacity: 0.06 }}
            />
          </>
        )}
        {(isShirt ? [126, 158, 190, 222, 254, 278] : [170, 200]).map((cy) => (
          <circle
            key={cy}
            cx={isShirt ? 150 : 163}
            cy={cy}
            r="2.2"
            style={{ fill: "var(--gold)" }}
          />
        ))}

        <line
          x1="112"
          y1="60"
          x2="188"
          y2="60"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="86"
          y1="148"
          x2="214"
          y2="148"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="66"
          y1="90"
          x2="94"
          y2="158"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="255"
          y1="76"
          x2="255"
          y2="290"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />

        <FlatBubble x={150} y={44} value={metric("shoulder")} />
        <FlatBubble x={150} y={134} value={metric("chest")} />
        <FlatBubble x={45} y={216} value={metric("sleeve")} />
        <FlatBubble x={265} y={184} value={metric("length")} align="end" />
        <text
          x="150"
          y="322"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="1.2"
          fontFamily="IBM Plex Mono, monospace"
          style={{ fill: "var(--ink-soft)", fillOpacity: 0.4 }}
        >
          {product.kind.toUpperCase()} / TECHNICAL FLAT
        </text>
      </svg>
    );
  }

  if (isBottom) {
    return (
      <svg viewBox="0 0 300 330" className="mx-auto h-auto w-full max-w-[310px]">
        <path
          d="M96 34 H204 L218 300 H171 L150 139 L129 300 H82 Z"
          fill="var(--paper-deep)"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.45 }}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M96 53 H204"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.2 }}
          strokeWidth="1"
        />
        <path
          d="M150 53 V139"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.2 }}
          strokeWidth="1"
        />
        <line
          x1="96"
          y1="65"
          x2="204"
          y2="65"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="91"
          y1="118"
          x2="209"
          y2="118"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="150"
          y1="139"
          x2="150"
          y2="296"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
          strokeDasharray="3 3"
        />
        <line
          x1="253"
          y1="64"
          x2="253"
          y2="300"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <FlatBubble x={104} y={76} value={metric("waist")} align="end" />
        <FlatBubble x={196} y={76} value={metric("hip")} />
        <FlatBubble x={150} y={216} value={metric("inseam")} />
        <FlatBubble x={263} y={168} value={metric("length")} align="end" />
        <text
          x="150"
          y="322"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="1.2"
          fontFamily="IBM Plex Mono, monospace"
          style={{ fill: "var(--ink-soft)", fillOpacity: 0.4 }}
        >
          TROUSERS / TECHNICAL FLAT
        </text>
      </svg>
    );
  }

  if (isShoe) {
    return (
      <svg viewBox="0 0 300 330" className="mx-auto h-auto w-full max-w-[310px]">
        <path
          d="M36 225 V195 C36 178 54 169 76 162 L138 142 L166 177 L218 190 C257 197 274 210 274 233 V247 H36 Z"
          fill="var(--paper-deep)"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.45 }}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M36 247 H274 M84 243 V247 M112 243 V247"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.4 }}
          strokeWidth="1.4"
        />
        <path
          d="M138 142 C149 160 142 178 126 195 M160 151 C173 166 168 184 154 201"
          fill="none"
          style={{ stroke: "var(--ink)", strokeOpacity: 0.25 }}
          strokeWidth="1"
        />
        <line
          x1="34"
          y1="266"
          x2="276"
          y2="266"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <line
          x1="285"
          y1="136"
          x2="285"
          y2="250"
          style={{ stroke: "var(--gold)", strokeOpacity: 0.7 }}
          strokeWidth="1.1"
        />
        <FlatBubble x={150} y={282} value={metric("length")} />
        <FlatBubble x={96} y={282} value={metric("width")} align="end" />
        <text
          x="150"
          y="322"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="1.2"
          fontFamily="IBM Plex Mono, monospace"
          style={{ fill: "var(--ink-soft)", fillOpacity: 0.4 }}
        >
          SHOES / TECHNICAL FLAT
        </text>
      </svg>
    );
  }

  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center border border-dashed border-ink/15 px-6 text-center">
      <p className="mono text-2xl text-gold">{details.standardSize}</p>
      <p className="mt-2 max-w-[240px] text-[10.5px] leading-6 text-ink-soft/55">
        استخدم القياسات المفصّلة أسفل الصورة قبل تأكيد الطلب.
      </p>
    </div>
  );
}

function FlatBubble({
  x,
  y,
  value,
}: {
  x: number;
  y: number;
  value: string;
  align?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="15"
        style={{
          fill: "var(--card)",
          stroke: "var(--gold)",
          strokeOpacity: 0.7,
        }}
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 3}
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="IBM Plex Mono, monospace"
        style={{ fill: "var(--ink)" }}
      >
        {value}
      </text>
    </g>
  );
}
