import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS, STORE, type CategoryId, type Product } from "@/data/store";
import {
  categoryLabel,
  formatPrice,
  priceOf,
  searchProducts,
} from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  Phone,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

export function SiteHeader({
  cartCount,
  onOpenCart,
  onSelectProduct,
  onApplySearch,
  onNavigateCategory,
}: {
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onApplySearch: (query: string) => void;
  onNavigateCategory: (category: CategoryId | "all") => void;
}) {
  const navItems = CATEGORIES.filter((category) =>
    ["suits", "blazers", "shirts", "shoes"].includes(category.id),
  );

  const goTo = (category: CategoryId | "all") => {
    onNavigateCategory(category);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="relative z-40">
      <AnnouncementMarquee />

      <div className="sticky top-0 z-40 border-b border-ink/15 bg-paper/95 shadow-[0_1px_0_rgba(33,28,23,0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex shrink-0 flex-col items-start leading-none"
            aria-label={STORE.name}
          >
            <span className="font-latin text-[26px] font-medium tracking-[0.22em] text-ink">
              ZOMA
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[8px] tracking-[0.32em] text-sepia">
              STORE
              <span className="inline-block size-1 rotate-45 bg-gold" />
              القاهرة
            </span>
          </button>

          <nav className="mx-auto hidden items-center gap-6 lg:flex xl:gap-7">
            <button
              type="button"
              onClick={() => goTo("all")}
              className="text-[12px] tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
            >
              كل المجموعة
            </button>
            {navItems.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => goTo(category.id)}
                className={cn(
                  "text-[12px] tracking-[0.08em] text-ink-soft transition-colors hover:text-ink",
                  category.id === "shoes" && "hidden xl:block",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <div className="hidden w-48 md:block lg:w-52 xl:w-64">
              <HeaderSearch
                onSelectProduct={onSelectProduct}
                onApplySearch={onApplySearch}
              />
            </div>

            <a
              href={STORE.phoneHref}
              className="hidden h-10 items-center gap-2 border border-ink/20 px-3 text-[11px] text-ink-soft transition-colors hover:border-ink hover:text-ink sm:flex"
              aria-label={`اتصل بنا ${STORE.phoneDisplay}`}
            >
              <Phone className="size-3.5 text-sepia" />
              <span className="hidden lg:inline">اتصل بنا</span>
            </a>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex h-10 items-center gap-2 border border-ink bg-ink px-3 text-[11px] tracking-[0.06em] text-paper transition-colors hover:bg-espresso"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">الحقيبة</span>
              <span className="flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-espresso tabular">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        <div className="border-t border-ink/10 px-4 py-2 md:hidden">
          <HeaderSearch
            onSelectProduct={onSelectProduct}
            onApplySearch={onApplySearch}
          />
        </div>
      </div>
    </header>
  );
}

function AnnouncementMarquee() {
  return (
    <div
      dir="ltr"
      className="marquee overflow-hidden border-b border-gold/25 bg-espresso py-2.5"
    >
      <div dir="ltr" className="marquee-track" style={{ "--marquee-duration": "48s" } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {STORE.announcement.map((text, index) => (
              <span
                key={`${copy}-${index}`}
                dir="rtl"
                className="flex items-center gap-4 px-5 text-[11px] tracking-[0.06em] text-paper-deep/90"
              >
                <span className="inline-block size-1 rotate-45 bg-gold/80" />
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSearch({
  onSelectProduct,
  onApplySearch,
}: {
  onSelectProduct: (product: Product) => void;
  onApplySearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim() ? searchProducts(PRODUCTS, query).slice(0, 4) : [];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const applySearch = () => {
    if (!query.trim()) return;
    onApplySearch(query.trim());
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-sepia" />
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            applySearch();
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
        placeholder="ابحث عن بدلة، قميص، حذاء..."
        aria-label="البحث في المتجر"
        className="h-10 rounded-none border-ink/20 bg-paper/60 ps-9 pe-8 text-[11px] placeholder:text-muted-foreground/80 focus-visible:border-gold focus-visible:ring-gold/25"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setIsOpen(false);
          }}
          className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-ink"
          aria-label="مسح البحث"
        >
          <X className="size-3" />
        </button>
      )}

      {isOpen && query.trim() && (
        <div className="absolute start-0 end-0 top-full z-50 mt-2 w-full border border-ink/20 bg-paper shadow-xl md:start-auto md:end-0 md:w-[330px]">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-ink/10">
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-paper-deep/40"
                    >
                      <ProductPlate
                        kind={product.kind}
                        tone={product.tone}
                        className="size-11 shrink-0 border border-ink/10"
                        plateClassName="p-1"
                        framed={false}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-display text-[13px] leading-5 text-ink">
                          {product.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {categoryLabel(product.category)}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink tabular">
                        {formatPrice(priceOf(product))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={applySearch}
                className="flex w-full items-center justify-between border-t border-ink/10 px-3 py-2 text-[10px] tracking-[0.12em] text-sepia transition-colors hover:bg-paper-deep/40 hover:text-ink"
              >
                عرض كل النتائج في المتجر
                <ArrowUpLeft className="size-3" />
              </button>
            </>
          ) : (
            <div className="px-3 py-4">
              <p className="text-[11px] text-ink">لا توجد نتائج مطابقة.</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                جرّب «بدلة»، «كتان»، «كحلي» أو «حذاء».
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
