import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { CategoryId, Product } from "@/data/store";
import { CATEGORIES } from "@/data/store";
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
import { ProductQuickView } from "@/components/product-quick-view";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  ChevronDown,
  MessageCircle,
  Scissors,
  Search,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

const PILLARS = [
  {
    icon: Scissors,
    index: "01",
    title: "قصّات مدروسة",
    note: "أكتاف مضبوطة وأطوال مقاسات تُختبر على أكثر من جسم.",
  },
  {
    icon: Sparkles,
    index: "02",
    title: "أقمشة تدوم",
    note: "صوف وكتان وقطن من موردين نعرفهم بالاسم.",
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
    note: "فريق يرد على واتساب ويحجز لك جلسة قياس مجانية.",
  },
];

export default function Landing() {
  const { products, cart } = useStore();
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
    } else if (catParam && CATEGORIES.some((item) => item.id === catParam)) {
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
  }, [catParam, qParam, viewParam]);

  const filtered = useMemo(
    () => filterProducts(products, { category, query, sort }),
    [products, category, query, sort],
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

      <section className="border-y border-ink/10 bg-paper-deep/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-ink/10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.index}
              className="flex flex-col gap-2 py-6 ps-4 sm:ps-6"
            >
              <div className="flex items-center justify-between">
                <pillar.icon
                  className="size-4 text-gold"
                  strokeWidth={1.4}
                />
                <span className="mono text-[8px] text-ink-soft/25">
                  {pillar.index}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] font-medium text-ink">
                {pillar.title}
              </p>
              <p className="text-[10px] leading-5 text-ink-soft/50">
                {pillar.note}
              </p>
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
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="mono bg-gold px-2 py-1 text-[8px] tracking-[0.16em] text-espresso">
                  CATALOG / 01
                </span>
                <span className="h-px w-8 bg-ink/15" />
                <p className="text-[10px] text-ink-soft/45">
                  كل القطع المعروضة الآن
                </p>
              </div>
              <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
                اختر قطعتك الأساسية.
              </h2>
              <p className="mt-2 max-w-xl text-[12px] leading-7 text-ink-soft/60">
                كل قطعة معروضة بمقاساتها وألوانها. اضغط على القطعة لعرضها
                بالحجم الكامل، أو أضفها من العرض السريع بعد اختيار المقاس.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="mono text-[9px] tracking-[0.1em] text-ink-soft/40">
                {filtered.length} ITEMS
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortId)}
                  aria-label="ترتيب المنتجات"
                  className="h-10 appearance-none border border-ink/15 bg-paper-deep ps-3 pe-8 text-[11px] text-ink outline-none transition-colors hover:border-ink/35 focus:border-gold"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft/40" />
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
            {CATEGORIES.map((entry) => (
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
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-gold/30 bg-gold/5 px-4 py-3">
              <p className="flex items-center gap-2 text-[11.5px] text-ink">
                <Search className="size-3.5 text-gold" />
                نتائج البحث عن «{query}» —{" "}
                <span className="mono">{filtered.length} ITEMS</span>
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex items-center gap-1 text-[10px] text-ink-soft/60 transition-colors hover:text-ink"
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
            <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-ink/15 px-6 py-16 text-center">
              <p className="text-2xl text-ink">لا توجد قطع مطابقة</p>
              <p className="mt-2 max-w-sm text-[12px] leading-6 text-ink-soft/55">
                جرّب كلمة أخرى مثل «بدلة»، «كحلي» أو «كتان»، أو تصفّح كل
                المجموعة من جديد.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="mt-5 border border-ink/20 px-5 py-2.5 text-[11px] text-ink transition-colors hover:border-gold hover:text-gold"
              >
                عرض كل القطع
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-deep/40 px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="mono text-[8px] tracking-[0.18em] text-gold">
                  COMMUNITY / 02
                </span>
                <span className="h-px w-8 bg-ink/15" />
              </div>
              <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
                إطلالات من عملائنا.
              </h2>
              <p className="mt-2 max-w-lg text-[12px] leading-7 text-ink-soft/60">
                مساحة يشارك فيها عملاء Zoma إطلالاتهم. ارفع صورتك بالقطعة التي
                اخترتها، وسننشرها هنا بعد مراجعة سريعة.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/lookbook"
                className="flex h-10 items-center gap-2 border border-ink/20 px-4 text-[10px] text-ink transition-colors hover:border-gold hover:text-gold"
              >
                استعرض المجتمع
                <ArrowUpLeft className="size-3.5" />
              </Link>
              <Link
                to="/lookbook#share"
                className="flex h-10 items-center gap-2 bg-gold px-4 text-[10px] font-medium text-espresso transition-opacity hover:opacity-90"
              >
                شارك إطلالتك
              </Link>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post._id}
                  to="/lookbook"
                  className="group border border-ink/10 bg-card p-2 transition-colors hover:border-gold/40"
                >
                  {post.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden bg-stage">
                      <img
                        src={post.imageUrl}
                        alt={post.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center border border-ink/10 bg-paper px-5 text-center">
                      <p className="text-[13px] leading-6 text-ink-soft/70">
                        {post.caption}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 px-1 pt-2">
                    <span className="text-[10px] text-ink-soft/55">
                      {post.authorName}
                    </span>
                    <span className="mono text-[8px] text-ink-soft/30">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 grid gap-3 border border-ink/10 bg-card p-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="mono text-[9px] tracking-[0.16em] text-gold">
                  OPEN CALL
                </p>
                <p className="mt-2 text-xl text-ink">
                  كن أول من يشارك إطلالته هنا.
                </p>
                <p className="mt-1 text-[11px] text-ink-soft/50">
                  ارفع صورة واضحة، واكتب اسم القطعة أو المناسبة في الوصف.
                </p>
              </div>
              <Link
                to="/lookbook#share"
                className="flex h-10 items-center justify-center border border-gold/50 px-4 text-[10px] text-gold transition-colors hover:bg-gold hover:text-espresso"
              >
                ابدأ المشاركة
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-espresso/30 bg-gold px-4 py-14 text-espresso sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="mono text-[9px] tracking-[0.2em] text-espresso/60">
              FITTING ROOM / 03
            </p>
            <h2 className="mt-3 max-w-xl text-3xl leading-snug sm:text-4xl">
              مقاسك الصح، من أول مرة.
            </h2>
            <p className="mt-3 max-w-xl text-[12.5px] leading-7 text-espresso/70">
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
            className="group flex h-12 shrink-0 items-center justify-center gap-3 bg-espresso px-7 text-[11px] font-semibold tracking-[0.1em] text-gold transition-colors hover:bg-ink hover:text-espresso"
          >
            احجز موعدك
            <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <section className="canvas-dark border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="border border-ink/10 bg-card p-3">
              <div className="relative overflow-hidden bg-paper">
                <EditorialPlate />
              </div>
            </div>
            <div className="absolute -bottom-5 -end-2 border border-ink/10 bg-card px-4 py-2.5 sm:-end-4">
              <p className="mono text-[8px] tracking-[0.16em] text-gold">
                IN THE STUDIO
              </p>
              <p className="mt-1 text-[11px] text-ink">
                تويد صوف — موسم ٢٦
              </p>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <p className="mono text-[9px] tracking-[0.2em] text-gold">
              THE STORE / 04
            </p>
            <h2 className="mt-3 text-3xl leading-[1.45] text-ink sm:text-[2.5rem]">
              لا نتبع الموضة.
              <span className="block text-gold-soft">نختار ما يبقى.</span>
            </h2>
            <p className="mt-5 max-w-md text-[12.5px] leading-8 text-ink-soft/65">
              نعمل مع عدد محدود من الموردين، ونعيد ضبط القصّات لتناسب أجساماً
              حقيقية. كل قطعة تمر على خياط واحد قبل أن تصل إليك، ونحتفظ بملف
              مقاساتك لتصبح الطلبات القادمة أسهل.
            </p>

            <div className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-ink/10 pt-6">
              {[
                { value: "100%", label: "أقمشة طبيعية" },
                { value: "24H", label: "تجهيز الطلب" },
                { value: "14", label: "يوم للاستبدال" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="mono text-xl text-gold">{stat.value}</p>
                  <p className="mt-1 text-[9.5px] leading-4 text-ink-soft/45">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                to="/booking"
                className="flex h-11 items-center gap-2 border border-gold/40 px-5 text-[10.5px] text-gold transition-colors hover:bg-gold hover:text-espresso"
              >
                احجز جلسة قياس
                <ArrowUpLeft className="size-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => goToCategory("suits")}
                className="flex h-11 items-center gap-2 border border-ink/15 px-5 text-[10.5px] text-ink transition-colors hover:border-ink/40"
              >
                تصفّح البدلات
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="mono text-[8px] tracking-[0.18em] text-gold">
              HOW IT WORKS / 05
            </span>
            <span className="h-px w-8 bg-ink/15" />
          </div>
          <h2 className="mt-3 text-3xl text-ink sm:text-4xl">
            من الاختيار إلى الباب.
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
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
                className="border border-ink/10 bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-gold">
                    {step.number}
                  </span>
                  <span className="h-px w-8 bg-ink/10" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[11.5px] leading-7 text-ink-soft/55">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-ink/10 bg-paper-deep/50 px-5 py-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="mono text-[9px] text-ink-soft/35">BAG</span>
              <p className="text-[12px] text-ink">
                {cart.count > 0
                  ? `لديك ${cart.count} قطعة في الحقيبة — متوسط الإتمام دقيقة واحدة.`
                  : "حقيبتك فارغة. ابدأ ببدلة، أو احجز جلسة قياس أولاً."}
              </p>
            </div>
            <button
              type="button"
              onClick={cart.openCart}
              className="flex h-10 items-center gap-2 bg-gold px-4 text-[10px] font-medium text-espresso transition-opacity hover:opacity-90"
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
          ? "border-gold bg-gold text-espresso"
          : "border-ink/15 text-ink-soft/70 hover:border-ink/35 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "mono text-[8px]",
          active ? "text-espresso/50" : "text-ink-soft/30",
        )}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

function EditorialPlate() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden paper-texture">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,252,244,0.9),transparent_65%)]" />
      <div className="absolute inset-4 border border-[#211c17]/12" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 320 320"
          className="h-full w-full p-10"
          aria-hidden="true"
        >
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
          <rect
            x="120"
            y="226"
            width="32"
            height="26"
            fill="none"
            stroke="#e3d5b9"
            strokeWidth="1.2"
            opacity="0.75"
          />
          <rect
            x="168"
            y="226"
            width="32"
            height="26"
            fill="none"
            stroke="#e3d5b9"
            strokeWidth="1.2"
            opacity="0.75"
          />
          <ellipse cx="72" cy="206" rx="16" ry="22" fill="#5c4230" stroke="#211c17" strokeWidth="1.3" />
          <ellipse cx="248" cy="206" rx="16" ry="22" fill="#5c4230" stroke="#211c17" strokeWidth="1.3" />
          <circle cx="168" cy="184" r="3" fill="#a9884f" stroke="#211c17" strokeWidth="0.8" />
          <circle cx="168" cy="208" r="3" fill="#a9884f" stroke="#211c17" strokeWidth="0.8" />
          <text
            x="160"
            y="312"
            textAnchor="middle"
            fill="#6b5a42"
            fontSize="7"
            letterSpacing="5"
            fontFamily="monospace"
          >
            ZOMA STUDIO / 2026
          </text>
        </svg>
      </div>
    </div>
  );
}
