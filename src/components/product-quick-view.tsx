import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Product } from "@/data/store";
import { useStore } from "@/context/store-context";
import {
  categoryLabel,
  formatPrice,
  priceOf,
  whatsappLink,
} from "@/lib/store-helpers";
import { ProductVisual } from "@/components/product-visual";
import { ProductSizePicker } from "@/components/size-guide";
import { getSizeLabel } from "@/lib/size-guide";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Check,
  Maximize2,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

export function ProductQuickView({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (item: {
    product: Product;
    size: string;
    color: string;
    qty: number;
  }) => void;
}) {
  const { settings, categories } = useStore();
  const [size, setSize] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!product) return;
    const firstSize = product.sizes[0] ?? "";
    setSize(firstSize);
    setSizeLabel(getSizeLabel(product, firstSize, "standard"));
    setColor(product.colors[0]?.name ?? "");
    setQty(1);
    setZoom(false);
  }, [product?.id]);

  if (!product) return null;

  const finalPrice = priceOf(product);
  const activeColor = product.colors.find((entry) => entry.name === color);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-none border-ink/15 bg-card p-0 shadow-2xl sm:max-w-4xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-3 start-3 z-20 flex size-8 items-center justify-center border border-ink/20 bg-paper/95 text-ink transition-colors hover:border-ink/50"
        >
          <X className="size-4" />
        </button>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative border-b border-ink/10 md:border-b-0 md:border-e">
            <div className="relative overflow-hidden">
              <ProductVisual
                product={product}
                className="aspect-square w-full md:aspect-auto md:h-full md:min-h-[480px]"
                imageClassName={cn(
                  "transition-transform duration-700 ease-out",
                  zoom && "scale-[1.75]",
                )}
                plateClassName={cn(
                  "p-10 transition-transform duration-700 ease-out",
                  zoom && "scale-[1.75]",
                )}
              >
                <span className="mono absolute bottom-4 start-4 z-10 text-[7px] tracking-[0.2em] text-white/60">
                  ZOMA WINTER EDIT
                </span>
              </ProductVisual>
              <button
                type="button"
                onClick={() => setZoom((current) => !current)}
                className="absolute bottom-3 end-3 flex items-center gap-1.5 border border-ink/20 bg-paper/85 px-2.5 py-1.5 text-[9px] text-ink backdrop-blur transition-colors hover:bg-ink hover:text-paper"
              >
                <Maximize2 className="size-3" />
                {zoom ? "تصغير" : "تكبير"}
              </button>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2">
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                QUICK VIEW / {product.kind.toUpperCase()}
              </p>
              <p className="text-[10px] text-ink-soft/50">
                {categoryLabel(product.category, categories)}
              </p>
            </div>
            <DialogTitle className="mt-2 text-2xl font-semibold leading-snug text-ink">
              {product.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              تفاصيل {product.name} واختيار المقاس واللون
            </DialogDescription>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-b border-ink/10 pb-5">
              <span className="mono text-2xl text-ink">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="price-strike mono pb-1 text-[11px] text-ink-soft/40">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mono mb-1 bg-gold px-2 py-0.5 text-[9px] font-medium text-espresso">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-[12.5px] leading-7 text-ink-soft/75">
              {product.description}
            </p>

            <p className="mt-3 text-[10.5px] text-ink-soft/50">
              <span className="text-gold">القماش:</span> {product.fabric}
            </p>

            {size && (
              <ProductSizePicker
                key={product.id}
                compact
                product={product}
                value={size}
                onChange={(nextSize, nextLabel) => {
                  setSize(nextSize);
                  setSizeLabel(nextLabel);
                }}
              />
            )}

            <div className="mt-5">
              <p className="text-[11px] font-medium text-ink">
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
                        ? "border-gold ring-1 ring-gold ring-offset-2 ring-offset-card"
                        : "border-ink/20 hover:border-ink/50",
                    )}
                    style={{ backgroundColor: option.hex }}
                  >
                    {color === option.name && (
                      <Check
                        className="size-3.5"
                        style={{
                          color:
                            option.hex.toLowerCase() === "#f2ebdc"
                              ? "#211c17"
                              : "#f4f3ec",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center border border-ink/15">
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  className="px-3 py-2.5 text-ink transition-colors hover:bg-ink/5"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="mono w-8 text-center text-[12px]">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.min(9, current + 1))}
                  className="px-3 py-2.5 text-ink transition-colors hover:bg-ink/5"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  product.inStock ? "text-ink-soft/60" : "text-destructive",
                )}
              >
                {product.inStock
                  ? "متوفر — يُشحن خلال ٢٤ ساعة"
                  : "نفدت الكمية — تواصل معنا"}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  onAdd({
                    product,
                    size: sizeLabel || getSizeLabel(product, size, "standard"),
                    color,
                    qty,
                  })
                }
                disabled={!size || !color || !product.inStock}
                className="h-12 w-full bg-gold text-[11px] font-semibold tracking-[0.1em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                أضف إلى الحقيبة
              </button>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappLink(
                    `مرحباً ${settings.storeName}، أريد الاستفسار عن: ${product.name}`,
                    settings.whatsapp,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center justify-center gap-1.5 border border-ink/15 text-[10px] text-ink transition-colors hover:border-ink/40"
                >
                  <MessageCircle className="size-3.5 text-gold" />
                  اسأل على واتساب
                </a>
                <Link
                  to={`/product/${product.id}`}
                  className="flex h-10 items-center justify-center border border-ink/15 text-[10px] text-ink transition-colors hover:border-ink/40"
                >
                  كل التفاصيل
                </Link>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-[9.5px] text-ink-soft/50">
              <span className="flex items-center gap-2">
                <Truck className="size-3.5 text-ink-soft/40" />
                توصيل لكل المحافظات
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-ink-soft/40" />
                استبدال خلال ١٤ يوماً
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
