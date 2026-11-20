import { useEffect, useState } from "react";
import type { Product } from "@/data/store";
import { STORE } from "@/data/store";
import {
  categoryLabel,
  formatPrice,
  priceOf,
  whatsappLink,
} from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Maximize2,
  MessageCircle,
  Minus,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function ProductQuickView({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (item: { product: Product; size: string; color: string; qty: number }) => void;
}) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0]?.name ?? "");
    setQty(1);
    setZoom(false);
  }, [product]);

  if (!product) return null;

  const finalPrice = priceOf(product);
  const activeColor = product.colors.find((entry) => entry.name === color);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto border-ink/20 bg-paper p-0 shadow-2xl sm:max-w-4xl">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative border-b border-ink/12 md:border-b-0 md:border-e">
            <div className="relative overflow-hidden">
              <ProductPlate
                kind={product.kind}
                tone={activeColor?.hex ?? product.tone}
                className="aspect-square w-full md:aspect-auto md:h-full md:min-h-[480px]"
                plateClassName={cn(
                  "p-10 transition-transform duration-700 ease-out",
                  zoom && "scale-[1.75]",
                )}
              >
                <span className="absolute bottom-4 start-4 text-[8px] tracking-[0.34em] text-ink/35">
                  ZOMA · ARCHIVE PLATE
                </span>
              </ProductPlate>
              <button
                type="button"
                onClick={() => setZoom((current) => !current)}
                className="absolute bottom-3 end-3 flex items-center gap-1.5 border border-ink/25 bg-paper/90 px-2.5 py-1.5 text-[10px] tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <Maximize2 className="size-3" />
                {zoom ? "تصغير" : "تكبير القماش"}
              </button>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-[10px] tracking-[0.28em] text-sepia">
              {categoryLabel(product.category)}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl leading-snug text-ink">
              {product.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              تفاصيل {product.name} واختيار المقاس واللون
            </DialogDescription>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-b border-ink/12 pb-5">
              <span className="font-display text-3xl text-ink tabular">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="price-strike pb-1 text-sm text-muted-foreground tabular">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mb-1 border border-gold/50 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-sepia">
                    وفّر {product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-[13px] leading-7 text-ink-soft">
              {product.description}
            </p>

            <p className="mt-3 text-[11px] text-muted-foreground">
              <span className="text-sepia">القماش:</span> {product.fabric}
            </p>

            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-ink">
                  المقاس
                </p>
                <span className="text-[10px] text-muted-foreground">
                  دليل المقاسات متاح عبر واتساب
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    className={cn(
                      "min-w-11 border px-3 py-2 text-xs transition-colors",
                      size === option
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/20 bg-paper/60 text-ink hover:border-ink/60",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-ink">
                اللون {activeColor ? `— ${activeColor.name}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-label={option.name}
                    aria-pressed={color === option.name}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border transition-all",
                      color === option.name
                        ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                        : "border-ink/25 hover:border-ink/60",
                    )}
                    style={{ backgroundColor: option.hex }}
                  >
                    {color === option.name && (
                      <Check
                        className="size-3.5"
                        style={{ color: option.hex === "#f2ebdc" ? "#211c17" : "#f4ecdd" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center border border-ink/20">
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  className="px-3 py-2.5 text-ink transition-colors hover:bg-ink/5"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm tabular">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.min(9, current + 1))}
                  className="px-3 py-2.5 text-ink transition-colors hover:bg-ink/5"
                  aria-label="زيادة الكمية"
                >
                  <PlusGlyph />
                </button>
              </div>
              <span
                className={cn(
                  "text-[11px]",
                  product.inStock ? "text-ink-soft" : "text-destructive",
                )}
              >
                {product.inStock
                  ? "متوفر — يُشحن خلال ٢٤ ساعة"
                  : "نفدت الكمية — تواصل معنا"}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => onAdd({ product, size, color, qty })}
                disabled={!size || !color || !product.inStock}
                className="h-12 w-full rounded-none bg-ink text-xs tracking-[0.18em] text-paper hover:bg-espresso"
              >
                أضف إلى الحقيبة
              </Button>
              <a
                href={whatsappLink(
                  `مرحباً ${STORE.name}، أريد الاستفسار عن: ${product.name}`,
                  STORE.whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 border border-ink/25 text-[11px] tracking-[0.12em] text-ink transition-colors hover:border-ink/60 hover:bg-ink/5"
              >
                <MessageCircle className="size-4" />
                اسأل عن القطعة على واتساب
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <Truck className="size-3.5 text-sepia" />
                توصيل لكل المحافظات
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-sepia" />
                استبدال خلال ١٤ يوماً
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlusGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
