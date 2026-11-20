import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/context/store-context";
import {
  categoryLabel,
  formatPrice,
  priceOf,
  searchProducts,
  whatsappLink,
} from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowUpLeft,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/?view=catalog#catalog", label: "المتجر" },
  { to: "/lookbook", label: "المجتمع" },
  { to: "/booking", label: "المواعيد" },
];

export function SiteHeader() {
  const { settings, cart } = useStore();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-40">
      {settings.announcement.length > 0 && <AnnouncementMarquee />}

      <div className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[74px] lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 flex-col items-start leading-none"
            aria-label={settings.storeName}
          >
            <span className="mono text-[24px] font-medium tracking-[0.22em] text-ink">
              ZOMA
            </span>
            <span className="mono mt-1 flex items-center gap-1.5 text-[7.5px] tracking-[0.22em] text-ink-soft/50">
              STORE
              <span className="inline-block size-1 bg-gold" />
              CAIRO
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded={menuOpen}
            className="flex size-10 shrink-0 items-center justify-center border border-ink/15 text-ink-soft/75 transition-colors hover:border-ink/40 hover:text-ink lg:hidden"
          >
            <Menu className="size-4" />
          </button>

          <nav className="mx-auto hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[12px] text-ink-soft/75 transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                const catalog = document.getElementById("catalog");
                if (catalog) {
                  catalog.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  navigate("/?view=catalog#catalog");
                }
              }}
              className="text-[12px] text-ink-soft/75 transition-colors hover:text-ink"
            >
              الكتالوج
            </button>
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <div className="hidden w-44 md:block lg:w-52 xl:w-64">
              <HeaderSearch />
            </div>

            <a
              href={`tel:${settings.whatsapp}`}
              className="hidden h-10 items-center gap-2 border border-ink/15 px-3 text-[11px] text-ink-soft/75 transition-colors hover:border-ink/40 hover:text-ink sm:flex"
              aria-label={`اتصل بنا ${settings.phoneDisplay}`}
            >
              <Phone className="size-3.5 text-gold" />
              <span className="hidden xl:inline">اتصل بنا</span>
            </a>

            <Link
              to={isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"}
              className="flex h-10 items-center gap-2 border border-ink/15 px-3 text-[11px] text-ink-soft/75 transition-colors hover:border-ink/40 hover:text-ink"
              aria-label="حسابي"
            >
              <User className="size-4" />
              <span className="hidden xl:inline">
                {isLoading ? "..." : isAuthenticated ? "حسابي" : "دخول"}
              </span>
            </Link>

            <button
              type="button"
              onClick={cart.openCart}
              className="relative flex h-10 items-center gap-2 bg-gold px-3 text-[11px] font-medium text-espresso transition-opacity hover:opacity-90"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">الحقيبة</span>
              <span className="mono flex min-w-5 items-center justify-center bg-espresso px-1.5 text-[10px] text-gold">
                {cart.count}
              </span>
            </button>
          </div>
        </div>

        <div className="border-t border-ink/10 px-4 py-2 md:hidden">
          <HeaderSearch />
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-[86%] gap-0 border-ink/15 bg-paper p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-ink/10 px-5 py-5 ps-12 text-start">
            <p className="mono text-[9px] tracking-[0.24em] text-gold">
              MENU / ZOMA
            </p>
            <SheetTitle className="text-xl text-ink">إلى أين تريد الذهاب؟</SheetTitle>
            <SheetDescription className="text-[11px] leading-5 text-ink-soft/60">
              تصفح المتجر، شارك إطلالتك، أو احجز موعد قياس في الاستوديو.
            </SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col px-2">
            {[
              { label: "المتجر", to: "/?view=catalog#catalog" },
              { label: "المجتمع", to: "/lookbook" },
              { label: "المواعيد", to: "/booking" },
              {
                label: isAuthenticated ? "حسابي" : "تسجيل الدخول",
                to: isAuthenticated
                  ? "/dashboard"
                  : "/auth?returnTo=/dashboard",
              },
            ].map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-ink/10 px-3 py-4 text-[13px] text-ink transition-colors hover:text-gold"
              >
                <span>{link.label}</span>
                <span className="mono text-[9px] tracking-[0.14em] text-ink-soft/35">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </nav>

          <SheetFooter className="mt-auto gap-3 border-t border-ink/10 px-5 py-5">
            <a
              href={whatsappLink(
                "مرحباً Zoma، أحتاج مساعدة في اختيار قطعة أو حجز موعد.",
                settings.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 bg-gold text-[11px] font-medium tracking-[0.08em] text-espresso"
            >
              <Phone className="size-3.5" />
              تحدّث معنا على واتساب
            </a>
            <a
              href={`tel:${settings.whatsapp}`}
              dir="ltr"
              className="mono text-center text-[10px] tracking-[0.12em] text-ink-soft/50"
            >
              {settings.phoneDisplay}
            </a>
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="mono text-center text-[8px] tracking-[0.2em] text-ink-soft/30"
            >
              STORE ADMIN
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function AnnouncementMarquee() {
  const { settings } = useStore();

  return (
    <div
      dir="ltr"
      className="marquee overflow-hidden border-b border-ink/10 bg-espresso py-2.5"
    >
      <div
        className="marquee-track"
        style={{ "--marquee-duration": "52s" } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {settings.announcement.map((text, index) => (
              <span
                key={`${copy}-${index}`}
                dir="rtl"
                className="flex items-center gap-4 px-5 text-[10.5px] tracking-[0.02em] text-ink-soft/70"
              >
                <span className="inline-block size-1 bg-gold" />
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSearch() {
  const { products } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim() ? searchProducts(products, query).slice(0, 4) : [];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/?q=${encodeURIComponent(query.trim())}#catalog`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft/40" />
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
            goToResults();
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
        placeholder="ابحث عن بدلة، قميص، حذاء..."
        aria-label="البحث في المتجر"
        className="h-10 rounded-none border-ink/15 bg-paper-deep ps-9 pe-8 text-[11px] placeholder:text-ink-soft/40 focus-visible:border-gold focus-visible:ring-gold/20"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setIsOpen(false);
          }}
          className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-ink-soft/40 transition-colors hover:text-ink"
          aria-label="مسح البحث"
        >
          <X className="size-3" />
        </button>
      )}

      {isOpen && query.trim() && (
        <div className="absolute start-0 end-0 top-full z-50 mt-2 w-full border border-ink/15 bg-card shadow-2xl md:start-auto md:end-0 md:w-[330px]">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-ink/10">
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-paper-deep"
                    >
                      <ProductPlate
                        kind={product.kind}
                        tone={product.tone}
                        className="size-11 shrink-0 border border-ink/10"
                        plateClassName="p-1"
                        framed={false}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[12px] leading-5 text-ink">
                          {product.name}
                        </span>
                        <span className="mono text-[8px] tracking-[0.12em] text-ink-soft/40">
                          {categoryLabel(product.category)}
                        </span>
                      </span>
                      <span className="mono shrink-0 text-[10px] text-ink">
                        {formatPrice(priceOf(product))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="flex w-full items-center justify-between border-t border-ink/10 px-3 py-2.5 text-[10px] text-gold transition-colors hover:bg-paper-deep"
              >
                عرض كل النتائج في الكتالوج
                <ArrowUpLeft className="size-3" />
              </button>
            </>
          ) : (
            <div className="px-3 py-4">
              <p className="text-[11px] text-ink">لا توجد نتائج مطابقة.</p>
              <p className="mt-1 text-[10px] text-ink-soft/60">
                جرّب «بدلة»، «كتان»، «كحلي» أو «حذاء».
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
