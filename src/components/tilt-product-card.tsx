import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Product } from "@/data/store";
import { useStore } from "@/context/store-context";
import {
  categoryLabel,
  formatPrice,
  priceOf,
} from "@/lib/store-helpers";
import { ArrowUpLeft, Plus } from "lucide-react";

export function TiltProductCard({
  product,
  index,
  onQuickView,
}: {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
}) {
  const { categories } = useStore();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useSpring(0, { stiffness: 160, damping: 18, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 18, mass: 0.4 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(197,160,89,0.22), transparent 65%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 12);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  const finalPrice = priceOf(product);

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
      className="group relative [perspective:1200px]"
    >
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={resetTilt}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex h-full flex-col border border-white/12 bg-[#141414] transition-colors duration-500 hover:border-gold/55"
      >
        <motion.div
          aria-hidden="true"
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

          <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
            {product.imageUrl ? (
              <>
                <motion.img
                  src={product.imageUrl}
                  alt={product.name}
                  loading={index < 2 ? "eager" : "lazy"}
                  animate={
                    reduceMotion
                      ? undefined
                      : { y: hovered ? -4 : [0, -7, 0] }
                  }
                  transition={
                    hovered
                      ? { duration: 0.5, ease: "easeOut" }
                      : {
                          duration: 7 + index * 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="h-full w-full scale-[1.04] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.09]"
                />
                {product.secondImageUrl && (
                  <img
                    src={product.secondImageUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-white/30">
                Zoma archive
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/25" />
            <div className="pointer-events-none absolute inset-3 z-10 border border-white/10 opacity-70 transition-colors duration-500 group-hover:border-gold/30" />

            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3.5">
              <span className="mono border border-gold/35 bg-black/50 px-2 py-1 text-[7.5px] tracking-[0.16em] text-gold backdrop-blur">
                {categoryLabel(product.category, categories)}
              </span>
              {product.discount > 0 && (
                <span className="shimmer-sweep mono bg-gold px-2 py-1 text-[8px] font-bold tracking-[0.06em] text-black">
                  VIP −{product.discount}%
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-[15px] font-semibold leading-6 text-white transition-colors hover:text-gold"
                  >
                    {product.name}
                  </Link>
                  <p className="mono mt-1 line-clamp-1 text-[7.5px] tracking-[0.12em] text-white/40">
                    {product.fabric}
                  </p>
                </div>
                <span className="mono shrink-0 text-[11px] text-gold">
                  {formatPrice(finalPrice)}
                </span>
              </div>

              <div className="mt-3 grid max-h-0 grid-cols-[1fr_auto] gap-2 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="flex h-9 items-center justify-center gap-1.5 border border-gold/45 bg-gold/10 text-[9px] text-gold backdrop-blur transition-colors hover:bg-gold hover:text-black"
                >
                  <Plus className="size-3" />
                  اختر المقاس
                </button>
                <Link
                  to={`/product/${product.id}`}
                  aria-label={`تفاصيل ${product.name}`}
                  className="flex size-9 items-center justify-center bg-gold text-black transition-colors hover:bg-gold-soft"
                >
                  <ArrowUpLeft className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
          <span className="mono text-[7.5px] tracking-[0.18em] text-white/25">
            LOOK / 0{index + 1}
          </span>
          <div className="flex items-center gap-2">
            {product.discount > 0 && (
              <span className="price-strike mono text-[8px] text-white/30">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="mono text-[8px] tracking-[0.12em] text-white/55">
              {product.sizes.length} SIZES
            </span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
