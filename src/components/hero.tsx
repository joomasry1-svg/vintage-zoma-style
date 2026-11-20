import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, Product } from "@/data/store";
import { PRODUCTS, STORE } from "@/data/store";
import { formatPrice, priceOf, whatsappLink } from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import { ArrowUpLeft, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOWCASE_IDS = ["savile-suit", "royal-suit", "torino-suit"];

export function Hero({
  onShop,
  onQuickView,
}: {
  onShop: (category: CategoryId | "all") => void;
  onQuickView: (product: Product) => void;
}) {
  const showcase = SHOWCASE_IDS.map((id) =>
    PRODUCTS.find((product) => product.id === id),
  ).filter((product): product is Product => Boolean(product));

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (showcase.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % showcase.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [showcase.length]);

  const product = showcase[index] ?? PRODUCTS[0];
  const floating = showcase[(index + 1) % showcase.length] ?? PRODUCTS[1];

  return (
    <section className="relative overflow-hidden paper-texture">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 top-10 select-none font-latin text-[26vw] leading-none tracking-[0.05em] text-ink/[0.035]"
      >
        ZOMA
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-[46%] hidden w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-20 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-gold" />
            <p className="eyebrow">أرشيف الخياطة الرجالية · موسم الشتاء</p>
          </div>

          <h1 className="mt-5 font-display text-[2.65rem] leading-[1.28] text-ink sm:text-[3.4rem] lg:text-[4.1rem]">
            أناقةٌ تُروى
            <span className="mt-1 block text-sepia">بالتفصيل.</span>
          </h1>

          <p className="mt-5 max-w-md text-[13px] leading-8 text-ink-soft sm:text-sm">
            بدلات صوفية، بليزرات تويد وقمصان كتان بأقمشة مختارة بعناية وقصّات
            كلاسيكية صُنعت لتبقى. من {STORE.name} في {STORE.city} — إلى بابك.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onShop("suits")}
              className="group flex h-12 items-center justify-center gap-3 bg-ink px-7 text-[11px] font-medium tracking-[0.2em] text-paper transition-colors hover:bg-espresso"
            >
              تسوّق مجموعة البدلات
              <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href={whatsappLink(
                `مرحباً ${STORE.name}، أريد مساعدتكم في اختيار بدلة مناسبة.`,
                STORE.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 border border-ink/25 px-6 text-[11px] tracking-[0.14em] text-ink transition-colors hover:border-ink/60 hover:bg-paper-deep/40"
            >
              <MessageCircle className="size-4 text-sepia" />
              استفسر على واتساب
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/12 pt-4 text-[10.5px] text-ink-soft">
            {["أقمشة مستوردة", "تفصيل يدوي", "الدفع عند الاستلام"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="size-3 text-gold" strokeWidth={2.5} />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[420px] lg:mt-0"
        >
          <div className="relative border border-ink/20 bg-card p-3 shadow-[0_50px_90px_-70px_rgba(33,28,23,0.9)]">
            <div className="absolute inset-1.5 border border-gold/20" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 46 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -46 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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

              <span className="absolute top-4 start-4 bg-espresso px-2.5 py-1.5 text-[8px] tracking-[0.26em] text-paper-deep">
                مقتنيات الأرشيف
              </span>
            </div>

            <div className="relative flex items-end justify-between gap-3 px-2 pb-1 pt-4">
              <div className="min-w-0">
                <p className="text-[9px] tracking-[0.28em] text-sepia">
                  مختارات الموسم
                </p>
                <p className="mt-1 truncate font-display text-lg leading-6 text-ink">
                  {product.name}
                </p>
                <p className="mt-1 flex items-baseline gap-2 text-[12px] text-ink">
                  <span className="tabular">{formatPrice(priceOf(product))}</span>
                  {product.discount > 0 && (
                    <span className="price-strike text-[10px] text-muted-foreground tabular">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="shrink-0 border border-ink/25 px-3 py-2 text-[10px] tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                عرض القطعة
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pb-2 pt-1">
              {showcase.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`عرض ${item.name}`}
                  className={cn(
                    "h-1 transition-all duration-300",
                    dotIndex === index
                      ? "w-6 bg-gold"
                      : "w-2.5 bg-ink/20 hover:bg-ink/40",
                  )}
                />
              ))}
            </div>
          </div>

          {floating && (
            <button
              type="button"
              onClick={() => onQuickView(floating)}
              className="drift-slow absolute -bottom-12 -start-4 hidden w-32 rotate-[-4deg] border border-ink/20 bg-paper p-1.5 text-start shadow-[0_24px_40px_-30px_rgba(33,28,23,0.8)] sm:block lg:-start-10"
              style={{ "--tilt": "-4deg" } as React.CSSProperties}
            >
              <ProductPlate
                kind={floating.kind}
                tone={floating.tone}
                className="aspect-square w-full"
                plateClassName="p-2"
                framed={false}
              />
              <span className="mt-1 block truncate px-0.5 font-display text-[11px] text-ink">
                {floating.name}
              </span>
            </button>
          )}

          <div
            className="drift-slower absolute -top-5 -end-3 flex size-[74px] flex-col items-center justify-center rounded-full border border-gold/60 bg-paper/95 text-center shadow-sm lg:-end-5"
            style={{ "--tilt": "0deg" } as React.CSSProperties}
          >
            <span className="text-[6.5px] tracking-[0.28em] text-sepia">EST.</span>
            <span className="font-latin text-[17px] tracking-[0.12em] text-ink">
              ZOMA
            </span>
            <span className="mt-0.5 text-[6px] tracking-[0.24em] text-sepia">
              CAIRO
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
