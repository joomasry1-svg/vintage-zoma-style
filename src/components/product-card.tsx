import { Link } from "react-router";
import type { Product } from "@/data/store";
import { categoryLabel, formatPrice, priceOf } from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { ArrowUpRight, Plus } from "lucide-react";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  const finalPrice = priceOf(product);

  return (
    <article className="group relative flex h-full flex-col border border-ink/10 bg-card transition-colors duration-300 hover:border-gold/40">
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`صفحة ${product.name}`}
      >
        <ProductPlate
          kind={product.kind}
          tone={product.tone}
          className="aspect-[4/5] w-full"
          plateClassName="p-6 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        >
          <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
            {product.badge === "hot" && (
              <span className="mono bg-gold px-2 py-1 text-[8px] font-medium tracking-[0.12em] text-espresso">
                BESTSELLER
              </span>
            )}
            {product.badge === "new" && (
              <span className="mono bg-signal-blue px-2 py-1 text-[8px] font-medium tracking-[0.12em] text-espresso">
                NEW IN
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="mono absolute top-3 end-3 border border-[#211c17]/20 bg-stage/90 px-2 py-1 text-[9px] font-medium text-[#211c17]">
              -{product.discount}%
            </span>
          )}
          <span className="mono absolute bottom-4 end-4 text-[7px] tracking-[0.24em] text-[#211c17]/35">
            ZOMA ARCHIVE / {product.kind.toUpperCase()}
          </span>
        </ProductPlate>

        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-espresso/95 px-4 py-2.5 text-[9px] tracking-[0.16em] text-gold transition-transform duration-300 ease-out group-hover:translate-y-0">
          عرض سريع للمقاسات
          <ArrowUpRight className="size-3" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          to={`/product/${product.id}`}
          className="text-[10px] tracking-[0.06em] text-ink-soft/45 transition-colors hover:text-gold"
        >
          {categoryLabel(product.category)}
        </Link>
        <Link to={`/product/${product.id}`} className="mt-1.5">
          <h3 className="text-[15px] font-medium leading-7 text-ink transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-[10.5px] text-ink-soft/45">
          {product.fabric}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-ink/10 pt-3">
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="mono whitespace-nowrap text-[13px] text-ink">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="price-strike mono mt-0.5 text-[9px] text-ink-soft/40">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`اختيار المقاس وإضافة ${product.name} للسلة`}
            className="flex size-8 shrink-0 items-center justify-center border border-ink/20 text-ink transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-espresso sm:h-8 sm:w-auto sm:gap-1.5 sm:px-2.5"
          >
            <Plus className="size-3.5" />
            <span className="hidden text-[9px] sm:inline">أضف</span>
          </button>
        </div>
      </div>
    </article>
  );
}
