import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useSearchParams } from "react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { CategoryId, Product } from "@/data/store";
import { useStore } from "@/context/store-context";
import {
  filterProducts,
  formatDate,
  SORT_OPTIONS,
  type SortId,
} from "@/lib/store-helpers";
import { Hero } from "@/components/hero";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { TiltProductCard } from "@/components/tilt-product-card";
import { ProductQuickView } from "@/components/product-quick-view";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  ChevronDown,
  CreditCard,
  Crown,
  MessageCircle,
  Ruler,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

const WINTER_IDS = [
  "kensington-overcoat",
  "camel-crest-coat",
  "rider-leather-jacket",
  "orbital-puffer",
];

const PILLARS = [
  {
    icon: Scissors,
    index: "01",
    title: "قصّات مدروسة",
    note: "أكتاف مضبوطة وأطوال تُختبر على أكثر من جسم.",
  },
  {
    icon: Sparkles,
    index: "02",
    title: "أقمشة تدوم",
    note: "صوف وكشمير وجلد طبيعي من موردين نعرفهم بالاسم.",
  },
  {
    icon: Truck,
    index: "03",
    title: "توصيل لكل مصر",
    note: "تجهيز خلال ٢٤ ساعة وتسليم خلال ٢–٤ أيام عمل.",
  },
  {
    icon: MessageCircle,
    index: "04",
    title: "استشارة حقيقية",
    note: "فريق يرد على واتساب ويحجز جلسة قياس مجانية.",
  },
];

export default function Landing() {
  const { products, categories, cart } = useStore();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const posts = useQuery(api.store.listPosts) ?? [];

  const catParam = searchParams.get("cat");
  const qParam = searchParams.get("q");
  const viewParam = searchParams.get("view");

  useEffect(() => {
    if (qParam) {
      setQuery(qParam);
      setCategory("all");
    } else if (catParam && categories.some((item) => item.id === catParam)) {
      setCategory(catParam as CategoryId);
      setQuery("");
    }

    if (qParam || catParam || viewParam === "catalog") {
      const timer = window.setTimeout(() => {
        document
          .getElementById("catalog")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
      return () => window.clearTimeout(timer);
    }
  }, [catParam, qParam, viewParam, categories]);

  const filtered = useMemo(
    () => filterProducts(products, { category, query, sort, categories }),
    [products, category, query, sort, categories],
  );

  const featured = useMemo(() => {
    const picks = WINTER_IDS.map((id) =>
      products.find((product) => product.id === id),
    ).filter((product): product is Product => Boolean(product));
    if (picks.length >= 4) return picks;
    const fallback = products.filter(
      (product) => product.imageUrl && !picks.some((p) => p.id === product.id),
    );
    return [...picks, ...fallback].slice(0, 4);
  }, [products]);

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
    <SiteLayout>
      <Hero onShop={goToCategory} onQuickView={setActiveProduct} />

      <section className="border-y border-gold/15 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.index} className="flex flex-col gap-2 py-6 ps-4 sm:ps-6">
              <div className="flex items-center justify-between">
                <pillar.icon className="size-4 text-gold" strokeWidth={1.4} />
                <span className="mono text-[8px] text-white/20">
                  {pillar.index}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] font-medium text-white">
                {pillar.title}
              </p>
              <p className="text-[10px] leading-5 text-white/45">
                {pillar.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0d0d0d] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-24 top-0 size-[420px] rounded-full bg-gold/[0.07] blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="01" english="THE WINTER EDIT" arabic="مختارات الشتاء" />
              <h2 className="mt-4 max-w-2xl text-3xl leading-snug text-white sm:text-4xl lg:text-[2.9rem]">
                طبقات تُلبس
                <span className="text-gold-gradient"> مرة واحدة،</span>
                <span className="block">وتُذكر طويلاً.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[12px] leading-7 text-white/50">
                أربع قطع أساسية لهذا الشتاء: معطف صوف أسود، كاميل كشمير، جاكيت
                جلد طبيعي، وبافر خفيف للسفر. كل قطعة بعدد محدود.
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToCategory("outerwear")}
              className="group flex h-11 shrink-0 items-center gap-2 border border-gold/40 px-5 text-[10.5px] text-gold transition-colors hover:bg-gold hover:text-black"
            >
              كل تشكيلة الشتاء
              <ArrowUpLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, index) => (
              <TiltProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={setActiveProduct}
              />
            ))}
          </div>

          <div className="mono mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[8px] tracking-[0.16em] text-white/30">
            <span className="flex items-center gap-2">
              <Crown className="size-3 text-gold" />
              VIP EARLY ACCESS · WINTER 26
            </span>
            <span>LIMITED UNITS / NO RESTOCK</span>
          </div>
        </div>
      </section>

      <HomeMarquee />

      <section className="relative border-y border-white/10 bg-[#111111] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel index="02" english="CHOOSE YOUR LAYER" arabic="اختر قسمك" />
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">
                ابدأ من الطبقة الصحيحة.
              </h2>
            </div>
            <p className="max-w-sm text-[11px] leading-6 text-white/40">
              أقسام المتجر تُدار من لوحة المالك، وأي قسم جديد يظهر هنا فوراً.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
            {categories.map((entry, index) => {
              const count = products.filter(
                (product) => product.category === entry.id,
              ).length;
              const fallback =
                products.find(
                  (product) =>
                    product.category === entry.id && product.imageUrl,
                )?.imageUrl ?? null;
              return (
                <motion.button
                  key={entry.id}
                  type="button"
                  onClick={() => goToCategory(entry.id)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                  className="group relative aspect-[3/4] overflow-hidden border border-white/10 text-start transition-colors duration-500 hover:border-gold/50 md:aspect-[4/5]"
                >
                  {entry.imageUrl || fallback ? (
                    <img
                      src={entry.imageUrl ?? fallback ?? ""}
                      alt={entry.label}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#2a2a2a,#111)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
                  <div className="absolute inset-3 border border-white/10 transition-colors duration-500 group-hover:border-gold/30" />
                  <span className="mono absolute end-4 top-4 text-[8px] tracking-[0.16em] text-white/40">
                    {String(count).padStart(2, "0")} PIECES
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[15px] font-semibold leading-6 text-white">
                      {entry.label}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[9.5px] leading-5 text-white/45">
                      {entry.note}
                    </p>
                    <span className="mt-3 flex items-center gap-1.5 text-[9px] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      استعرض القسم
                      <ArrowUpLeft className="size-3" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <CampaignBanner />

      <section
        id="catalog"
        className="catalog-light scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="mono bg-[#15130f] px-2 py-1 text-[8px] tracking-[0.16em] text-gold">
                  CATALOG / 03
                </span>
                <span className="h-px w-8 bg-ink/15" />
                <p className="text-[10px] text-ink-soft/55">
                  الأسعار والخصومات محدّثة الآن
                </p>
              </div>
              <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
                اختر قطعتك الأساسية.
              </h2>
              <p className="mt-2 max-w-xl text-[12px] leading-7 text-ink-soft/70">
                كل قطعة معروضة بمقاساتها وألوانها. اضغط على القطعة لعرضها
                بالحجم الكامل، أو أضفها من العرض السريع بعد اختيار المقاس.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="mono text-[9px] tracking-[0.1em] text-ink-soft/45">
                {filtered.length} ITEMS
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortId)}
                  aria-label="ترتيب المنتجات"
                  className="h-10 appearance-none border border-ink/20 bg-paper-deep ps-3 pe-8 text-[11px] text-ink outline-none transition-colors hover:border-ink/40 focus:border-gold"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft/50" />
              </div>
            </div>
          </motion.div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <CategoryChip
              active={category === "all"}
              label="كل القطع"
              count={products.length}
              onClick={() => setCategory("all")}
            />
            {categories.map((entry) => (
              <CategoryChip
                key={entry.id}
                active={category === entry.id}
                label={entry.label}
                count={
                  products.filter((product) => product.category === entry.id)
                    .length
                }
                onClick={() => setCategory(entry.id)}
              />
            ))}
          </div>

          {query && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-gold/40 bg-gold/10 px-4 py-3">
              <p className="flex items-center gap-2 text-[11.5px] text-ink">
                <Search className="size-3.5 text-gold" />
                نتائج البحث عن «{query}» —{" "}
                <span className="mono">{filtered.length} ITEMS</span>
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex items-center gap-1 text-[10px] text-ink-soft/65 transition-colors hover:text-ink"
              >
                <X className="size-3" />
                إلغاء البحث
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.03, 0.18),
                  }}
                >
                  <ProductCard
                    product={product}
                    onQuickView={setActiveProduct}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-ink/20 px-6 py-16 text-center">
              <p className="text-2xl text-ink">لا توجد قطع مطابقة</p>
              <p className="mt-2 max-w-sm text-[12px] leading-6 text-ink-soft/65">
                جرّب كلمة أخرى مثل «معطف»، «بدلة»، «كاميل» أو «جلد»، أو تصفّح
                كل المجموعة من جديد.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="mt-5 border border-ink/25 px-5 py-2.5 text-[11px] text-ink transition-colors hover:border-gold hover:text-gold"
              >
                عرض كل القطع
              </button>
            </div>
          )}

          <div className="mono mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink/15 pt-5 text-[8.5px] tracking-[0.08em] text-ink-soft/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-gold" /> استبدال ١٤ يوم
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 text-gold" /> توصيل كل المحافظات
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-gold" /> دفع عند الاستلام
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler className="size-3.5 text-gold" /> مقاسات ٤٨–٥٦
            </span>
          </div>
        </div>
      </section>

      <BookingBreak />

      <section className="relative overflow-hidden border-t border-white/10 bg-[#0d0d0d] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel index="05" english="THE COMMUNITY" arabic="مجتمع Zoma" />
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">
                إطلالات من عملائنا.
              </h2>
              <p className="mt-2 max-w-lg text-[12px] leading-7 text-white/45">
                مساحة يشارك فيها عملاء Zoma إطلالاتهم. ارفع صورتك بالقطعة التي
                اخترتها، وسننشرها هنا بعد مراجعة سريعة.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/lookbook"
                className="flex h-10 items-center gap-2 border border-white/20 px-4 text-[10px] text-white/70 transition-colors hover:border-gold hover:text-gold"
              >
                استعرض المجتمع
                <ArrowUpLeft className="size-3.5" />
              </Link>
              <Link
                to="/lookbook#share"
                className="shimmer-sweep flex h-10 items-center gap-2 bg-gold px-4 text-[10px] font-semibold text-black transition-opacity hover:opacity-90"
              >
                شارك إطلالتك
              </Link>
            </div>
          </Reveal>

          {posts.length > 0 ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post._id}
                  to="/lookbook"
                  className="group border border-white/10 bg-[#161616] p-2 transition-colors hover:border-gold/40"
                >
                  {post.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden bg-[#1d1d1d]">
                      <img
                        src={post.imageUrl}
                        alt={post.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#1a1a1a] px-5 text-center">
                      <p className="text-[13px] leading-6 text-white/60">
                        {post.caption}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 px-1 pt-2">
                    <span className="text-[10px] text-white/50">
                      {post.authorName}
                    </span>
                    <span className="mono text-[8px] text-white/25">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 grid gap-3 border border-white/10 bg-[#151515] p-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="mono text-[9px] tracking-[0.16em] text-gold">
                  OPEN CALL
                </p>
                <p className="mt-2 text-xl text-white">
                  كن أول من يشارك إطلالته هنا.
                </p>
                <p className="mt-1 text-[11px] text-white/40">
                  ارفع صورة واضحة، واكتب اسم القطعة أو المناسبة في الوصف.
                </p>
              </div>
              <Link
                to="/lookbook#share"
                className="flex h-10 items-center justify-center border border-gold/50 px-4 text-[10px] text-gold transition-colors hover:bg-gold hover:text-black"
              >
                ابدأ المشاركة
              </Link>
            </div>
          )}
        </div>
      </section>

      <StorySection />

      <section className="border-t border-white/10 bg-[#101010] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel index="07" english="HOW IT WORKS" arabic="كيف يعمل" />
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">
                من الاختيار إلى الباب.
              </h2>
            </div>
            <span className="mono text-[8px] tracking-[0.16em] text-white/25">
              04 STEPS / NO FRICTION
            </span>
          </Reveal>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "اختر قطعتك",
                copy: "تصفّح الكتالوج وحدّد المقاس واللون. وإن احترت، اسألنا على واتساب قبل الطلب.",
              },
              {
                number: "02",
                title: "أكمل الطلب",
                copy: "أضف القطع إلى الحقيبة، اختر الدفع، وأرسل الطلب عبر واتساب. نحجز القطعة باسمك.",
              },
              {
                number: "03",
                title: "استلم وادفع",
                copy: "نجهّز الطلب خلال ٢٤ ساعة ونوصله لبابك. الدفع عند الاستلام أو بتحويل إنستاباي.",
              },
              {
                number: "04",
                title: "ارجع بثقة",
                copy: "مقاس غير مناسب؟ استبدله خلال ١٤ يوماً. ونحفظ مقاساتك للطلب القادم.",
              },
            ].map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="group border border-white/10 bg-[#151515] p-6 transition-colors hover:border-gold/35"
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-gold">
                    {step.number}
                  </span>
                  <span className="h-px w-8 bg-white/10 transition-colors group-hover:bg-gold/50" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-[11.5px] leading-7 text-white/45">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-gold/25 bg-gold/[0.04] px-5 py-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="mono text-[9px] text-white/30">BAG</span>
              <p className="text-[12px] text-white/75">
                {cart.count > 0
                  ? `لديك ${cart.count} قطعة في الحقيبة — متوسط الإتمام دقيقة واحدة.`
                  : "حقيبتك فارغة. ابدأ بمعطف شتوي، أو احجز جلسة قياس أولاً."}
              </p>
            </div>
            <button
              type="button"
              onClick={cart.openCart}
              className="shimmer-sweep flex h-10 items-center gap-2 bg-gold px-4 text-[10px] font-semibold text-black transition-opacity hover:opacity-90"
            >
              راجع الحقيبة ({cart.count})
              <ArrowUpLeft className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

      {activeProduct && (
        <ProductQuickView
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={handleAddToCart}
        />
      )}
    </SiteLayout>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  index,
  english,
  arabic,
}: {
  index: string;
  english: string;
  arabic: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mono border border-gold/30 px-2 py-1 text-[8px] tracking-[0.18em] text-gold">
        {index}
      </span>
      <span className="mono text-[8px] tracking-[0.2em] text-white/30">
        {english}
      </span>
      <span className="h-px w-8 bg-gold/30" />
      <span className="text-[10px] text-white/45">{arabic}</span>
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
        "flex shrink-0 items-center gap-2 border px-3.5 py-2 text-[10.5px] transition-colors",
        active
          ? "border-gold bg-[#15130f] text-gold"
          : "border-ink/20 text-ink-soft/75 hover:border-ink/45 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "mono text-[8px]",
          active ? "text-gold/60" : "text-ink-soft/40",
        )}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

function HomeMarquee() {
  const items = [
    "FREE PERSONAL FITTING",
    "WINTER 26 — LIMITED DROP",
    "CAIRO / MILANO TAILORING",
    "48H DISPATCH",
    "VIP GOLD MEMBERS",
  ];
  return (
    <div className="marquee overflow-hidden border-y border-black/20 bg-gold py-2.5" dir="ltr">
      <div
        className="marquee-track"
        style={{ "--marquee-duration": "38s" } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="mono flex items-center gap-4 px-6 text-[9px] font-semibold tracking-[0.22em] text-black/80"
              >
                <Crown className="size-3 opacity-60" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignBanner() {
  const { settings } = useStore();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const banner = settings.banner;

  if (!banner?.enabled) return null;

  const external = /^https?:\/\//i.test(banner.ctaHref);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-y border-gold/20 bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={banner.imageUrl}
          alt=""
          aria-hidden="true"
          style={reduceMotion ? undefined : { y: imageY }}
          className="h-[116%] w-full object-cover object-[50%_35%] opacity-45"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_80%_50%,rgba(197,160,89,0.18),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-20 sm:px-6 lg:min-h-[420px] lg:flex-row lg:items-end lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3">
            <span className="shimmer-sweep mono bg-gold px-2.5 py-1.5 text-[8px] font-bold tracking-[0.16em] text-black">
              {banner.eyebrow}
            </span>
            <span className="mono text-[8px] tracking-[0.18em] text-white/35">
              LIMITED INVITATION
            </span>
          </div>
          <h2 className="mt-5 text-[2.2rem] leading-[1.25] text-white sm:text-[3rem]">
            {banner.title}
          </h2>
          <p className="mt-3 max-w-lg text-[12px] leading-7 text-white/55">
            {banner.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {external ? (
              <a
                href={banner.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shimmer-sweep flex h-11 items-center gap-2 bg-gold px-5 text-[10.5px] font-semibold text-black transition-colors hover:bg-gold-soft"
              >
                {banner.ctaLabel}
                <ArrowUpLeft className="size-3.5" />
              </a>
            ) : (
              <Link
                to={banner.ctaHref}
                className="shimmer-sweep flex h-11 items-center gap-2 bg-gold px-5 text-[10.5px] font-semibold text-black transition-colors hover:bg-gold-soft"
              >
                {banner.ctaLabel}
                <ArrowUpLeft className="size-3.5" />
              </Link>
            )}
            <span className="mono flex items-center gap-2 text-[8px] tracking-[0.12em] text-white/35">
              <Crown className="size-3 text-gold" /> VIP MEMBERS FIRST
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden w-52 shrink-0 border border-gold/40 bg-black/35 p-4 backdrop-blur-md lg:block"
        >
          <p className="mono text-[7.5px] tracking-[0.2em] text-gold">
            THE GOLD CARD
          </p>
          <p className="mt-2 text-2xl leading-8 text-white">
            خصومات
            <span className="block text-gold">لا تُنشر.</span>
          </p>
          <div className="mt-4 border-t border-white/15 pt-3">
            <p className="text-[9.5px] leading-5 text-white/45">
              للعملاء المسجلين فقط. سجّل دخولك قبل نهاية الموسم.
            </p>
            <Link
              to="/auth?returnTo=/dashboard"
              className="mt-3 flex items-center gap-1.5 text-[9px] text-gold transition-colors hover:text-gold-soft"
            >
              انضم إلى القائمة
              <ArrowUpLeft className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BookingBreak() {
  return (
    <section className="relative overflow-hidden border-y border-black/20 bg-gold px-4 py-14 text-[#0d0d0d] sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-20 -top-28 size-72 rounded-full border border-black/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-8 top-1/2 size-40 -translate-y-1/2 rounded-full border border-black/10"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="mono text-[9px] tracking-[0.2em] text-black/55">
            FITTING ROOM / 04
          </p>
          <h2 className="mt-3 max-w-xl text-3xl leading-snug sm:text-4xl">
            مقاسك الصح، من أول مرة.
          </h2>
          <p className="mt-3 max-w-xl text-[12.5px] leading-7 text-black/65">
            احجز ٣٠ دقيقة في استوديو Zoma. نأخذ مقاساتك، نجرّب القطع، ونرسل لك
            ملخصاً بمقاساتك لطلبك القادم.
          </p>
          <ul className="mono mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-medium tracking-[0.06em]">
            <li>— قياس كامل</li>
            <li>— استشارة تنسيق</li>
            <li>— بدون أي رسوم</li>
          </ul>
        </div>
        <Link
          to="/booking"
          className="shimmer-sweep group flex h-12 shrink-0 items-center justify-center gap-3 bg-[#0d0d0d] px-7 text-[11px] font-semibold tracking-[0.1em] text-gold transition-colors hover:bg-[#1a1a1a]"
        >
          احجز موعدك
          <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}

function StorySection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const { products } = useStore();

  return (
    <section ref={ref} className="canvas-dark overflow-hidden border-t border-white/10">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative overflow-hidden border border-gold/30 p-2">
            <div className="relative aspect-[5/4] overflow-hidden">
              <motion.img
                src="/images/editorial/milan-rain.jpg"
                alt="معطف شتوي من تشكيلة Zoma في ميلانو"
                loading="lazy"
                style={reduceMotion ? undefined : { y: imageY }}
                className="h-[112%] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="mono absolute bottom-4 start-4 border border-gold/40 bg-black/50 px-2 py-1 text-[7px] tracking-[0.18em] text-gold backdrop-blur">
                MILANO / FIELD NOTES
              </span>
            </div>
          </div>
          <div className="absolute -bottom-5 -end-2 border border-gold/30 bg-[#111] px-4 py-2.5 sm:-end-4">
            <p className="mono text-[8px] tracking-[0.16em] text-gold">
              IN THE STUDIO
            </p>
            <p className="mt-1 text-[11px] text-white">
              صوف كشمير — موسم ٢٦
            </p>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <SectionLabel index="06" english="THE STORE" arabic="عن Zoma" />
          <h2 className="mt-4 text-3xl leading-[1.4] text-white sm:text-[2.5rem]">
            لا نتبع الموضة.
            <span className="block text-gold-gradient">نختار ما يبقى.</span>
          </h2>
          <p className="mt-5 max-w-md text-[12.5px] leading-8 text-white/55">
            نعمل مع عدد محدود من الموردين، ونعيد ضبط القصّات لتناسب أجساماً
            حقيقية. كل قطعة تمر على خياط واحد قبل أن تصل إليك، ونحتفظ بملف
            مقاساتك لتصبح الطلبات القادمة أسهل.
          </p>

          <div className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              { value: String(products.length), label: "قطعة في التحرير" },
              { value: "24H", label: "تجهيز الطلب" },
              { value: "14", label: "يوم للاستبدال" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="mono text-xl text-gold">{stat.value}</p>
                <p className="mt-1 text-[9.5px] leading-4 text-white/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/booking"
              className="flex h-11 items-center gap-2 border border-gold/40 px-5 text-[10.5px] text-gold transition-colors hover:bg-gold hover:text-black"
            >
              احجز جلسة قياس
              <ArrowUpLeft className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex h-11 items-center gap-2 border border-white/15 px-5 text-[10.5px] text-white/75 transition-colors hover:border-white/40 hover:text-white"
            >
              تصفّح الكتالوج
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
