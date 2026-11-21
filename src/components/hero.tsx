import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { CategoryId, Product } from "@/data/store";
import { DEFAULT_HERO_SLIDES } from "@/data/store";
import { useStore } from "@/context/store-context";
import { formatPrice, priceOf, whatsappLink } from "@/lib/store-helpers";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ChevronDown,
  MessageCircle,
  Play,
  Star,
} from "lucide-react";

const AUTOPLAY_MS = 5200;

export function Hero({
  onShop,
  onQuickView,
}: {
  onShop: (category: CategoryId | "all") => void;
  onQuickView: (product: Product) => void;
}) {
  const { products, settings } = useStore();
  const reduceMotion = useReducedMotion();

  const slides = useMemo(() => {
    const configured =
      settings.heroSlides && settings.heroSlides.length > 0
        ? settings.heroSlides
        : DEFAULT_HERO_SLIDES;

    return configured.map((slide, index) => {
      const product = products.find((item) => item.id === slide.productId);
      return {
        ...slide,
        key: `${slide.imageUrl}-${index}`,
        product,
      };
    });
  }, [settings.heroSlides, products]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = slides[index % Math.max(slides.length, 1)] ?? slides[0];

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  if (!active) return null;

  const go = (direction: number) =>
    setIndex((current) => (current + direction + slides.length) % slides.length);

  return (
    <section
      className="relative isolate overflow-hidden bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${active.key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <img
            src={active.imageUrl}
            alt=""
            className="h-full w-full scale-110 object-cover object-[60%_20%] opacity-[0.18] blur-3xl"
          />
          <div className="hero-image-fade absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      <div className="hero-atmosphere pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden="true"
        className="noise-soft pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-soft-light"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-8 top-24 z-0 select-none font-latin text-[22vw] leading-none tracking-[0.06em] text-ink/[0.03]"
      >
        ZOMA
      </div>

      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono border border-gold/35 bg-gold/10 px-2.5 py-1.5 text-[8.5px] tracking-[0.22em] text-gold">
              WINTER EDITION / 2026
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-ink-soft/70">
              <Star className="size-3 fill-gold text-gold" />
              <span className="mono tracking-[0.08em]">4.9 / 5</span>
              <span className="text-ink-soft/30">·</span>
              CAIRO — MILANO
            </span>
          </div>

          <h1 className="mt-7 text-[3.1rem] font-semibold leading-[1.12] text-ink sm:text-[4rem] lg:text-[4.7rem]">
            الشتاء
            <span className="mt-1 block">
              بلون
              <span className="text-gold-gradient"> الحضور.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[13.5px] leading-8 text-ink-soft/80">
            معاطف صوف وجلد طبيعي وبدلات مقصوصة بكتف مضبوط. قطع محدودة من
            استوديو Zoma، تصل إلى بابك في كل محافظات مصر.
          </p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onShop("outerwear")}
              className="hero-primary-cta shimmer-sweep group flex h-12 items-center justify-center gap-3 bg-gold px-7 text-[11px] font-bold tracking-[0.08em] text-espresso transition-all hover:bg-gold-soft"
            >
              تسوّق تشكيلة الشتاء
              <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={() => onShop("all")}
              className="group flex h-12 items-center justify-center gap-2.5 border border-ink/20 px-6 text-[11px] text-ink/85 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
            >
              استعرض كل القطع
              <span className="mono text-[8px] tracking-[0.12em] text-gold">
                ALL
              </span>
            </button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-ink/10 pt-5">
            <span className="mono text-[9px] tracking-[0.16em] text-ink-soft/55">
              {products.length} PIECES
            </span>
            <span className="mono text-[9px] tracking-[0.16em] text-ink-soft/55">
              HAND-FINISHED
            </span>
            <a
              href={whatsappLink(
                `مرحباً ${settings.storeName}، أريد مساعدة في اختيار قطعة شتوية.`,
                settings.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-ink-soft/70 transition-colors hover:text-gold"
            >
              <MessageCircle className="size-3.5" />
              استشارة خاصة على واتساب
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2 space-x-reverse">
              {slides.slice(0, 4).map((slide, slideIndex) => (
                <span
                  key={slide.key}
                  className={cn(
                    "size-7 overflow-hidden rounded-full border-2 bg-paper-deep",
                    slideIndex === index ? "border-gold" : "border-ink/20",
                  )}
                >
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
            </div>
            <p className="text-[10px] leading-5 text-ink-soft/60">
              <span className="text-ink/80">{slides.length} إطلالات</span>{" "}
              مختارة لهذا الموسم
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 mx-auto w-full max-w-[560px] lg:pe-4"
        >
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="mono flex items-center gap-2 text-[8px] tracking-[0.22em] text-gold">
              <span className="inline-block size-1 animate-pulse bg-gold" />
              THE WINTER CAROUSEL
            </p>
            <span className="mono text-[8px] tracking-[0.18em] text-ink-soft/50">
              AUTO / {paused ? "PAUSED" : "03D"}
            </span>
          </div>

          <motion.div
            className="hero-perspective relative flex h-[420px] items-center justify-center sm:h-[500px] lg:h-[560px]"
            onPanEnd={(_event, info) => {
              if (info.offset.x < -40) go(1);
              if (info.offset.x > 40) go(-1);
            }}
          >
            <div className="pointer-events-none absolute inset-x-8 bottom-8 top-12 rounded-[999px] bg-gold/10 blur-3xl" />
            <div
              aria-hidden="true"
              className="absolute inset-x-10 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />
            <div className="relative h-full w-[min(78vw,330px)] sm:w-[360px]">
              {slides.map((slide, slideIndex) => {
                const length = slides.length;
                const relative =
                  (slideIndex - index + length) % Math.max(length, 1);
                const signed =
                  relative > length / 2 ? relative - length : relative;
                const depth = Math.abs(signed);
                const isActive = depth === 0;
                const slidePrice = slide.product
                  ? priceOf(slide.product)
                  : 0;

                return (
                  <motion.div
                    key={slide.key}
                    initial={false}
                    animate={{
                      x: `${signed * 52}%`,
                      z: -depth * 150,
                      rotateY: signed * -38,
                      rotateZ: signed * 1.4,
                      scale: 1 - depth * 0.1,
                      opacity: depth > 1 ? 0 : 1,
                      filter: isActive
                        ? "brightness(1) saturate(1)"
                        : "brightness(0.52) saturate(0.8)",
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.95,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "absolute inset-0",
                      isActive ? "z-30" : depth === 1 ? "z-20" : "z-10",
                    )}
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      willChange: "transform, opacity, filter",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div
                      className={cn(
                        "group relative h-full w-full overflow-hidden border bg-stage transition-colors duration-700",
                        isActive
                          ? "gold-rim border-gold/60"
                          : "border-ink/10",
                      )}
                    >
                      <motion.div
                        animate={
                          reduceMotion ? undefined : { y: [0, -9, 0] }
                        }
                        transition={{
                          duration: 7 + slideIndex * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="h-full w-full"
                      >
                        {slide.videoUrl ? (
                          <video
                            src={slide.videoUrl}
                            poster={slide.imageUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label={slide.title}
                            className="h-[104%] w-full scale-[1.02] object-cover"
                          />
                        ) : (
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            loading={slideIndex === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-[104%] w-full scale-[1.02] object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                          />
                        )}
                      </motion.div>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
                      <div className="pointer-events-none absolute inset-3 border border-white/10" />

                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                        <span className="mono border border-gold/35 bg-black/45 px-2 py-1 text-[7.5px] tracking-[0.18em] text-gold backdrop-blur">
                          {slide.kicker}
                        </span>
                        {slide.product && slide.product.discount > 0 && (
                          <span className="shimmer-sweep mono bg-gold px-2 py-1 text-[8px] font-bold tracking-[0.08em] text-espresso">
                            VIP −{slide.product.discount}%
                          </span>
                        )}
                      </div>

                      <span className="mono absolute end-4 top-1/2 hidden -translate-y-1/2 rotate-90 text-[7px] tracking-[0.35em] text-white/45 sm:block">
                        ZOMA / {String(slideIndex + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <p className="text-[15px] font-semibold leading-6 text-white sm:text-base">
                          {slide.title}
                        </p>
                        <p className="mt-1 line-clamp-2 max-w-[280px] text-[10px] leading-5 text-white/55">
                          {slide.subtitle}
                        </p>
                        {slide.product && (
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
                            <div>
                              <p className="mono text-[13px] text-gold">
                                {formatPrice(slidePrice)}
                              </p>
                              {slide.product.discount > 0 && (
                                <p className="price-strike mono text-[8px] text-white/35">
                                  {formatPrice(slide.product.price)}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (slide.product) onQuickView(slide.product);
                                }}
                                className="flex h-8 items-center gap-1.5 border border-white/25 bg-black/30 px-2.5 text-[9px] text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                              >
                                أضف سريعاً
                              </button>
                              <Link
                                to={`/product/${slide.product.id}`}
                                aria-label={`تفاصيل ${slide.product.name}`}
                                className="flex size-8 items-center justify-center bg-gold text-espresso transition-colors hover:bg-gold-soft"
                              >
                                <ArrowUpLeft className="size-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute inset-x-0 -bottom-3 flex justify-center">
              <div className="flex items-center gap-2 border border-white/15 bg-black/55 px-2 py-1.5 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="القطعة السابقة"
                  className="flex size-7 items-center justify-center border border-white/10 text-white/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <ArrowRight className="size-3.5" />
                </button>
                <span className="mono min-w-12 text-center text-[8px] tracking-[0.12em] text-white/45">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(slides.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="القطعة التالية"
                  className="flex size-7 items-center justify-center border border-white/10 text-white/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <ArrowLeft className="size-3.5" />
                </button>
                <span className="mx-1 h-4 w-px bg-white/15" />
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? "تشغيل العرض" : "إيقاف العرض"}
                  className="flex size-7 items-center justify-center text-gold transition-colors hover:text-gold-soft"
                >
                  {paused ? (
                    <Play className="size-3 fill-current" />
                  ) : (
                    <span className="flex gap-[2px]">
                      <span className="h-2.5 w-[2px] bg-current" />
                      <span className="h-2.5 w-[2px] bg-current" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`عرض ${slide.title}`}
                aria-current={slideIndex === index}
                className={cn(
                  "group relative h-14 w-11 overflow-hidden border bg-paper-deep transition-all duration-300 sm:h-16 sm:w-14",
                  slideIndex === index
                    ? "border-gold opacity-100"
                    : "border-ink/15 opacity-50 hover:opacity-85",
                )}
              >
                <img
                  src={slide.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {slideIndex === index && (
                  <motion.span
                    key={`progress-${index}-${paused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused || reduceMotion ? 0.45 : 1 }}
                    transition={{
                      duration: paused || reduceMotion ? 0.3 : AUTOPLAY_MS / 1000,
                      ease: "linear",
                    }}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 hidden items-center justify-between gap-3 border-t border-ink/10 pt-3 sm:flex">
            <span className="mono flex items-center gap-1.5 text-[7.5px] tracking-[0.16em] text-ink-soft/45">
              <span className="inline-block size-1 bg-gold/70" />
              DRAG TO EXPLORE
            </span>
            <span className="mono flex items-center gap-1 text-[7.5px] tracking-[0.16em] text-ink-soft/45">
              SCROLL
              <ChevronDown className="size-3 text-gold/60" />
            </span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-paper to-transparent" />
    </section>
  );
}
