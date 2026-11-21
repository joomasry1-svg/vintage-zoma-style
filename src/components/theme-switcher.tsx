import { Check, Palette } from "lucide-react";
import { useTheme, type SiteTheme } from "@/context/theme-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: SiteTheme;
  label: string;
  note: string;
  swatches: string[];
}[] = [
  {
    id: "ivory",
    label: "أبيض وأحمر",
    note: "نهار فاتح ولمسة Scarlet",
    swatches: ["#fbf7f2", "#b4232b"],
  },
  {
    id: "obsidian",
    label: "ليل وذهبي",
    note: "أوبسيديان مع شامبانيا",
    swatches: ["#0d0d0d", "#c5a059"],
  },
];

export function ThemeSwitcher({ labeled = false }: { labeled?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="تغيير ألوان الموقع"
          title="ألوان الموقع"
          className={cn(
            "flex h-10 items-center justify-center gap-2 border border-ink/15 text-ink-soft/75 transition-colors hover:border-gold/60 hover:text-gold",
            labeled ? "px-3" : "w-10",
          )}
        >
          <Palette className="size-4 shrink-0" />
          {labeled && (
            <span className="hidden text-[10px] xl:inline">الألوان</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-none border-ink/15 bg-popover p-3 shadow-2xl"
      >
        <p className="mono text-[8px] tracking-[0.2em] text-gold">
          SITE THEME / الألوان
        </p>
        <p className="mt-1 text-[11px] leading-5 text-ink">
          اختر مزاج المتجر.
        </p>
        <div className="mt-3 space-y-1.5">
          {OPTIONS.map((option) => {
            const active = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 border px-2.5 py-2 text-start transition-colors",
                  active
                    ? "border-gold/60 bg-gold/10"
                    : "border-ink/10 hover:border-ink/30 hover:bg-paper-deep",
                )}
              >
                <span className="flex shrink-0 overflow-hidden rounded-full border border-ink/20">
                  {option.swatches.map((color) => (
                    <span
                      key={color}
                      className="size-4"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] text-ink">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[8.5px] text-ink-soft/55">
                    {option.note}
                  </span>
                </span>
                {active && <Check className="size-3.5 shrink-0 text-gold" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 border-t border-ink/10 pt-2 text-[8.5px] leading-4 text-ink-soft/40">
          يُحفظ اختيارك على هذا الجهاز.
        </p>
      </PopoverContent>
    </Popover>
  );
}
