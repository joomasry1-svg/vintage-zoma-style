import type { Product } from "@/data/store";
import { categoryLabel, formatPrice, priceOf } from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { ArrowUpLeft, Plus } from "lucide-react";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  const finalPrice = priceOf(product);

  return (
    <article className="group relative flex h-full flex-col border border-ink/12 bg-card/70 transition-colors duration-300 hover:border-gold/70">
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="relative block w-full overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        aria-label={`عرض سريع: ${product.name}`}
      >
        <ProductPlate
          kind={product.kind}
          tone={product.tone}
          className="aspect-[4/5] w-full"
          plateClassName="p-6 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        >
          <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
            {product.badge === "hot" && (
              <span className="bg-gold px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-espresso">
                الأكثر طلباً
              </span>
            )}
            {product.badge === "new" && (
              <span className="bg-espresso px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-paper">
                وصل حديثاً
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="absolute top-3 end-3 border border-ink/20 bg-paper/85 px-2 py-1 text-[10px] font-semibold tabular text-ink">
              -{product.discount}%
            </span>
          )}
          <span className="absolute bottom-4 end-4 text-[8px] tracking-[0.3em] text-ink/35">
            ZOMA · ARCHIVE
          </span>
        </ProductPlate>

        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/90 px-4 py-2.5 text-[10px] font-medium tracking-[0.24em] text-paper transition-transform duration-300 ease-out md:translate-y-full md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0">
          عرض سريع
          <ArrowUpLeft className="size-3.5" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] tracking-[0.22em] text-sepia">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-7 text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
          {product.fabric}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-ink/10 pt-3">
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-lg text-ink tabular sm:text-xl">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="price-strike mt-0.5 text-[11px] text-muted-foreground tabular">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`اختيار المقاس وإضافة ${product.name} للسلة`}
            className="flex size-8 shrink-0 items-center justify-center border border-ink/25 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper sm:size-auto sm:px-3 sm:py-2 sm:text-[10px] sm:font-medium sm:tracking-[0.14em]"
          >
            <Plus className="size-3.5 sm:hidden" />
            <span className="hidden sm:inline">أضف للسلة</span>
          </button>
        </div>
      </div>
    </article>
  );
}
