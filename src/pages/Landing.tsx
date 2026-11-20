import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CategoryId, Product } from "@/data/store";
import { CATEGORIES, PRODUCTS, STORE } from "@/data/store";
import {
  filterProducts,
  SORT_OPTIONS,
  type SortId,
  whatsappLink,
} from "@/lib/store-helpers";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { ProductQuickView } from "@/components/product-quick-view";
import { CartSheet } from "@/components/cart-sheet";
import { StoreFooter } from "@/components/store-footer";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  ChevronDown,
  MessageCircle,
  Phone,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

export default function Landing() {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const cart = useCart();

  const products = useMemo(
    () => filterProducts(PRODUCTS, { category, query, sort }),
    [category, query, sort],
  );

  const scrollToCatalog = () => {
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToCategory = (nextCategory: CategoryId | "all") => {
    setCategory(nextCategory);
    setQuery("");
    scrollToCatalog();
  };

  const applySearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setCategory("all");
    scrollToCatalog();
  };

  const handleAddToCart = ({
    product,
    size,
    color,
    qty,
  }: {
    product: Product;
    size: string;
    color: string;
    qty: number;
  }) => {
    cart.addItem({ productId: product.id, size, color, qty });
    setActiveProduct(null);
    cart.openCart();
    toast.success("أُضيفت القطعة إلى الحقيبة", {
      description: `${product.name} · المقاس ${size}`,
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader
        cartCount={cart.count}
        onOpenCart={cart.openCart}
        onSelectProduct={setActiveProduct}
        onApplySearch={applySearch}
        onNavigateCategory={goToCategory}
      />

      <main>
        <Hero onShop={goToCategory} onQuickView={setActiveProduct} />

        <section className="border-y border-ink/12 bg-paper-deep/30">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-ink/10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              { icon: Scissors, title: "تفصيل يدوي", note: "لمسات خياط أخيرة على كل قطعة" },
              { icon: Sparkles, title: "أقمشة مختارة", note: "صوف، كتان وقطن من موردين موثوقين" },
              { icon: Truck, title: "توصيل لكل مصر", note: "تجهيز خلال ٢٤ ساعة من تأكيد الطلب" },
              { icon: ShieldCheck, title: "استبدال ١٤ يوماً", note: "استبدال المقاس بدون تعقيد" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 py-5 ps-4 sm:ps-6">
                <item.icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="text-[11.5px] font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[10px] leading-5 text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="catalog"
          className="scroll-mt-28 bg-paper px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold" />
                  <p className="eyebrow">المجموعة الكاملة</p>
                </div>
                <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                  خزانة الرجل الكامل
                </h2>
                <p className="mt-2 max-w-xl text-[12px] leading-7 text-muted-foreground">
                  بدلات وبليزرات وقمصان وأحذية، مقاسات من S إلى XXL، وكل قطعة
                  تحمل تفاصيلها الخاصة. اضغط على أي قطعة للمعاينة واختيار المقاس.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground tabular">
                  {products.length} قطعة
                </span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortId)}
                    aria-label="ترتيب المنتجات"
                    className="h-10 appearance-none border border-ink/20 bg-paper/70 ps-3 pe-8 text-[11px] text-ink outline-none transition-colors hover:border-ink/40 focus:border-gold"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sepia" />
                </div>
              </div>
            </motion.div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <CategoryChip
                active={category === "all"}
                label="كل القطع"
                count={PRODUCTS.length}
                onClick={() => setCategory("all")}
              />
              {CATEGORIES.map((entry) => (
                <CategoryChip
                  key={entry.id}
                  active={category === entry.id}
                  label={entry.label}
                  count={PRODUCTS.filter((product) => product.category === entry.id).length}
                  onClick={() => setCategory(entry.id)}
                />
              ))}
            </div>

            {query && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-gold/40 bg-gold/10 px-4 py-3">
                <p className="flex items-center gap-2 text-[11.5px] text-ink">
                  <Search className="size-3.5 text-sepia" />
                  نتائج البحث عن «{query}» — {products.length} قطعة
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex items-center gap-1 text-[10px] text-sepia transition-colors hover:text-ink"
                >
                  <X className="size-3" />
                  إلغاء البحث
                </button>
              </div>
            )}

            {products.length > 0 ? (
              <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.2) }}
                  >
                    <ProductCard product={product} onQuickView={setActiveProduct} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center justify-center border border-dashed border-ink/20 px-6 py-16 text-center">
                <p className="font-display text-2xl text-ink">لا توجد قطع مطابقة</p>
                <p className="mt-2 max-w-sm text-[12px] leading-6 text-muted-foreground">
                  جرّب كلمة أخرى مثل «بدلة»، «كحلي» أو «كتان»، أو تصفّح كل
                  المجموعة من جديد.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="mt-5 border border-ink/25 px-5 py-2.5 text-[11px] tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  عرض كل القطع
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-espresso">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <div className="border border-gold/30 bg-espresso p-3">
                <div className="relative overflow-hidden bg-paper/95">
                  <EditorialPlate />
                </div>
              </div>
              <div className="absolute -bottom-5 -end-2 border border-ink/15 bg-paper px-4 py-2.5 shadow-lg sm:-end-4">
                <p className="font-display text-[13px] leading-5 text-ink">
                  تويد صوف إنجليزي
                </p>
                <p className="text-[9px] tracking-[0.16em] text-sepia">
                  كمية محدودة — موسم الشتاء
                </p>
              </div>
            </motion.div>

            <div className="order-1 lg:order-2">
              <p className="eyebrow text-gold-soft">من الأرشيف</p>
              <h2 className="mt-3 font-display text-3xl leading-[1.5] text-paper sm:text-[2.6rem]">
                صُنعت لتبقى،
                <span className="block text-gold-soft">لا لتتبع الموضة.</span>
              </h2>
              <p className="mt-5 max-w-md text-[12.5px] leading-8 text-paper-deep/65">
                كل قطعة في Zoma تمرّ على يد خياط واحد يكمل حوافها ويثبّت أزرارها،
                لأن التفاصيل الصغيرة هي ما يبقى بعد أن تمرّ الصيحات. نختار
                الأقمشة الطبيعية، ونحتفظ بقصّات كلاسيكية تعود إليها كل شتاء.
              </p>

              <div className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-paper-deep/15 pt-6">
                {[
                  { value: "١٠٠٪", label: "أقمشة طبيعية" },
                  { value: "٢٤ س", label: "تجهيز الطلب" },
                  { value: "١٤ يوم", label: "للاستبدال" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-xl text-gold-soft tabular">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[9.5px] leading-4 text-paper-deep/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToCategory("blazers")}
                className="group mt-8 flex h-11 items-center gap-3 border border-gold/50 px-6 text-[11px] tracking-[0.16em] text-paper transition-colors hover:bg-gold hover:text-espresso"
              >
                تصفّح البليزرات
                <ArrowUpLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="eyebrow">كيف تطلب</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                ثلاث خطوات، وبدلتك في الطريق
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[12px] leading-7 text-muted-foreground">
                لا حاجة لحساب أو بيانات دفع إلكترونية — نكمل الطلب معك على
                واتساب ونتفق على التفاصيل والتوصيل.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  number: "٠١",
                  title: "اختر قطعتك",
                  copy: "تصفّح البدلات والقمصان، حدّد المقاس واللون من المعاينة السريعة ثم أضفها إلى الحقيبة.",
                },
                {
                  number: "٠٢",
                  title: "راجع الحقيبة",
                  copy: "عدّل الكميات أو احذف قطعة، وأدخل بيانات التوصيل واختر طريقة الدفع المناسبة لك.",
                },
                {
                  number: "٠٣",
                  title: "أكّد على واتساب",
                  copy: "تفتح رسالة الطلب كاملة على واتساب المتجر، نؤكد التوفر والموعد ونرسل القطعة.",
                },
              ].map((step) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className="relative border border-ink/12 bg-card/60 p-6"
                >
                  <span className="font-display text-3xl text-gold/70 tabular">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-[11.5px] leading-7 text-muted-foreground">
                    {step.copy}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center justify-center gap-2.5 border-t border-ink/10 pt-8 sm:flex-row">
              <button
                type="button"
                onClick={cart.openCart}
                className="flex h-11 items-center justify-center gap-2 bg-ink px-6 text-[11px] tracking-[0.16em] text-paper transition-colors hover:bg-espresso"
              >
                راجع حقيبتك ({cart.count})
              </button>
              <a
                href={whatsappLink(
                  `مرحباً ${STORE.name}، أريد المساعدة في اختيار مقاس وبدلة مناسبة.`,
                  STORE.whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 border border-ink/25 px-6 text-[11px] tracking-[0.12em] text-ink transition-colors hover:border-ink/60 hover:bg-paper-deep/30"
              >
                <MessageCircle className="size-4 text-sepia" />
                استشارة على واتساب
              </a>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter onNavigateCategory={goToCategory} />

      <div className="fixed bottom-5 start-4 z-40 flex flex-col gap-2">
        <a
          href={whatsappLink(
            `مرحباً ${STORE.name}، أريد الاستفسار عن منتجاتكم.`,
            STORE.whatsapp,
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          className="flex size-12 items-center justify-center rounded-full bg-espresso text-paper shadow-lg ring-1 ring-gold/40 transition-transform hover:scale-105"
        >
          <MessageCircle className="size-5" />
        </a>
        <a
          href={STORE.phoneHref}
          aria-label={`اتصل بنا ${STORE.phoneDisplay}`}
          className="flex size-12 items-center justify-center rounded-full border border-ink/25 bg-paper text-ink shadow-lg transition-transform hover:scale-105 hover:border-ink/50"
        >
          <Phone className="size-[18px]" />
        </a>
      </div>

      <CartSheet
        open={cart.isOpen}
        onOpenChange={(open) => (open ? cart.openCart() : cart.closeCart())}
        lines={cart.lines}
        onQty={cart.setQty}
        onRemove={cart.removeItem}
        onClear={cart.clear}
      />

      {activeProduct && (
        <ProductQuickView
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={handleAddToCart}
        />
      )}
    </div>
  );
}

function CategoryChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 border px-3.5 py-2 text-[11px] transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/20 bg-paper/50 text-ink-soft hover:border-ink/50 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "text-[9px] tabular",
          active ? "text-gold-soft" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EditorialPlate() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden paper-texture">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,252,244,0.95),transparent_65%)]" />
      <div className="absolute inset-5 border border-ink/12" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 320 320" className="h-full w-full p-10" aria-hidden="true">
          <defs>
            <linearGradient id="editorial-tweed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8a6a4b" />
              <stop offset="55%" stopColor="#6b4f3a" />
              <stop offset="100%" stopColor="#4f3928" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="296" rx="100" ry="10" fill="#211c17" opacity="0.08" />
          <path
            d="M160 40 C146 40 136 46 130 56 L80 82 L46 132 L76 156 L104 132 L104 292 L216 292 L216 132 L244 156 L274 132 L240 82 L190 56 C184 46 174 40 160 40 Z"
            fill="url(#editorial-tweed)"
            stroke="#211c17"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M160 58 L140 96 L160 150 L180 96 Z"
            fill="#efe4ce"
            stroke="#211c17"
            strokeWidth="1.4"
          />
          <path
            d="M139 58 L160 100 L151 110 L130 74 Z"
            fill="#7d5c43"
            stroke="#211c17"
            strokeWidth="1.3"
          />
          <path
            d="M181 58 L160 100 L169 110 L190 74 Z"
            fill="#7d5c43"
            stroke="#211c17"
            strokeWidth="1.3"
          />
          <path
            d="M104 132 L216 132"
            stroke="#e3d5b9"
            strokeWidth="0.8"
            opacity="0.35"
          />
          <rect x="120" y="226" width="32" height="26" fill="none" stroke="#e3d5b9" strokeWidth="1.2" opacity="0.75" />
          <rect x="168" y="226" width="32" height="26" fill="none" stroke="#e3d5b9" strokeWidth="1.2" opacity="0.75" />
          <ellipse cx="72" cy="206" rx="16" ry="22" fill="#5c4230" stroke="#211c17" strokeWidth="1.3" />
          <ellipse cx="248" cy="206" rx="16" ry="22" fill="#5c4230" stroke="#211c17" strokeWidth="1.3" />
          <circle cx="168" cy="184" r="3" fill="#a9884f" stroke="#211c17" strokeWidth="0.8" />
          <circle cx="168" cy="208" r="3" fill="#a9884f" stroke="#211c17" strokeWidth="0.8" />
          <text
            x="160"
            y="312"
            textAnchor="middle"
            fill="#8a7050"
            fontSize="7"
            letterSpacing="5"
            fontFamily="Cormorant Garamond, serif"
          >
            ZOMA · ARCHIVE PLATE N° 04
          </text>
        </svg>
      </div>
    </div>
  );
}
