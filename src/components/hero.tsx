import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, Product } from "@/data/store";
import { useStore } from "@/context/store-context";
import { formatPrice, priceOf, whatsappLink } from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { ArrowUpLeft, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOWCASE_IDS = ["savile-suit", "royal-suit", "torino-suit"];

export function Hero({
  onShop,
  onQuickView,
}: {
  onShop: (category: CategoryId | "all") => void;
  onQuickView: (product: Product) => void;
}) {
  const { products, settings } = useStore();
  const showcase = SHOWCASE_IDS.map((id) =>
    products.find((product) => product.id === id),
  ).filter((product): product is Product => Boolean(product));

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (showcase.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % showcase.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [showcase.length]);

  const product = showcase[index] ?? products[0];
  const floating = showcase[(index + 1) % showcase.length] ?? products[1];

  if (!product) return null;

  return (
    <section className="relative overflow-hidden canvas-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 top-6 select-none font-latin text-[24vw] leading-none tracking-[0.04em] text-ink/[0.025]"
      >
        ZOMA
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono bg-gold px-2 py-1 text-[9px] tracking-[0.18em] text-espresso">
              NEW SEASON / 26
            </span>
            <span className="mono text-[9px] tracking-[0.16em] text-ink-soft/50">
              تشكيلة محدودة — {settings.city}
            </span>
          </div>

          <h1 className="mt-6 text-[2.8rem] leading-[1.22] text-ink sm:text-[3.5rem] lg:text-[4.2rem]">
            ملابس تُلبس
            <span className="mt-1 block text-gold">بثقة.</span>
          </h1>

          <p className="mt-5 max-w-md text-[13.5px] leading-8 text-ink-soft/80">
            بدلات وقمصان وأحذية رجالية مختارة بعناية، بقصّات دقيقة وأقمشة تدوم.
            اطلب اليوم، أو احجز جلسة قياس مجانية في استوديو Zoma.
          </p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onShop("all")}
              className="group flex h-12 items-center justify-center gap-3 bg-gold px-7 text-[11px] font-semibold tracking-[0.1em] text-espresso transition-opacity hover:opacity-90"
            >
              تسوّق الكتالوج
              <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <Link
              to="/booking"
              className="flex h-12 items-center justify-center gap-2 border border-ink/20 px-6 text-[11px] text-ink transition-colors hover:border-ink/50 hover:bg-ink/5"
            >
              احجز جلسة قياس
              <span className="mono text-[9px] text-gold">30 MIN</span>
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5">
            <span className="mono text-[9px] tracking-[0.14em] text-ink-soft/45">
              {products.length} PIECES
            </span>
            <span className="mono text-[9px] tracking-[0.14em] text-ink-soft/45">
              48H DISPATCH
            </span>
            <a
              href={whatsappLink(
                `مرحباً ${settings.storeName}، أريد مساعدتكم في اختيار بدلة مناسبة.`,
                settings.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-ink-soft/60 transition-colors hover:text-gold"
            >
              <MessageCircle className="size-3.5" />
              استشارة سريعة على واتساب
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[420px]"
        >
          <div className="relative border border-ink/15 bg-card p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden bg-stage">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 46 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -46 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <ProductPlate
                    kind={product.kind}
                    tone={product.tone}
                    className="h-full w-full"
                    plateClassName="p-8"
                    framed={false}
                  />
                </motion.div>
              </AnimatePresence>

              <span className="absolute top-4 start-4 mono bg-espresso/90 px-2.5 py-1.5 text-[8px] tracking-[0.18em] text-[#efe9dc]">
                ARCHIVE / {String(index + 1).padStart(2, "0")}
              </span>
              {product.discount > 0 && (
                <span className="mono absolute top-4 end-4 border border-[#211c17]/25 bg-stage/90 px-2 py-1 text-[9px] text-[#211c17]">
                  -{product.discount}%
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-3 px-1.5 pb-1.5 pt-4">
              <div className="min-w-0">
                <p className="mono text-[8px] tracking-[0.2em] text-ink-soft/40">
                  SEASON PICK / مختارات الموسم
                </p>
                <p className="mt-1.5 truncate text-[15px] font-medium leading-6 text-ink">
                  {product.name}
                </p>
                <p className="mono mt-1 flex items-baseline gap-2 text-[11px] text-ink">
                  <span>{formatPrice(priceOf(product))}</span>
                  {product.discount > 0 && (
                    <span className="price-strike text-[9px] text-ink-soft/40">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="border border-ink/20 px-3 py-2 text-[10px] text-ink transition-colors hover:border-gold hover:text-gold"
                >
                  أضف للسلة
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="mono text-[8px] tracking-[0.1em] text-ink-soft/40 transition-colors hover:text-gold"
                >
                  VIEW DETAILS →
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-1.5 pb-1 pt-2">
              {showcase.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`عرض ${item.name}`}
                  className={cn(
                    "h-[3px] transition-all duration-300",
                    dotIndex === index
                      ? "w-7 bg-gold"
                      : "w-3 bg-ink/20 hover:bg-ink/40",
                  )}
                />
              ))}
              <span className="mono ms-auto text-[8px] tracking-[0.1em] text-ink-soft/30">
                AUTO / {String(showcase.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {floating && (
            <Link
              to={`/product/${floating.id}`}
              className="drift-slow absolute -bottom-10 -start-3 hidden w-32 rotate-[-4deg] border border-ink/15 bg-card p-1.5 shadow-2xl sm:block lg:-start-8"
              style={{ "--tilt": "-4deg" } as React.CSSProperties}
            >
              <ProductPlate
                kind={floating.kind}
                tone={floating.tone}
                className="aspect-square w-full"
                plateClassName="p-2"
                framed={false}
              />
              <span className="mono mt-1 block truncate px-0.5 text-[8px] tracking-[0.06em] text-ink-soft/60">
                NEXT DROP / {floating.name}
              </span>
            </Link>
          )}

          <div
            className="drift-slower absolute -top-4 -end-3 hidden size-[76px] flex-col items-center justify-center border border-gold/40 bg-paper text-center sm:flex"
            style={{ "--tilt": "0deg" } as React.CSSProperties}
          >
            <span className="mono text-[7px] tracking-[0.2em] text-gold">EST.</span>
            <span className="mono text-[18px] tracking-[0.1em] text-ink">ZOMA</span>
            <span className="mono mt-0.5 text-[6px] tracking-[0.2em] text-ink-soft/40">
              CAIRO / 26
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
