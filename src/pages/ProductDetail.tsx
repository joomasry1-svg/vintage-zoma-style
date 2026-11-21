import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/hooks/use-auth";
import {
  categoryLabel,
  formatDate,
  formatPrice,
  priceOf,
  whatsappLink,
} from "@/lib/store-helpers";
import { SiteLayout } from "@/components/site-layout";
import { ProductVisual } from "@/components/product-visual";
import { SizeGuide } from "@/components/size-guide";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  Loader2,
  Maximize2,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, categories, settings, cart } = useStore();
  const { isAuthenticated } = useAuth();
  const product = products.find((item) => item.id === slug);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const reviews =
    useQuery(
      api.store.listReviews,
      slug ? { productSlug: slug } : "skip",
    ) ?? [];
  const createReview = useMutation(api.store.createReview);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0]?.name ?? "");
    setQty(1);
    setZoom(false);
  }, [product?.id]);

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
          <p className="mono text-[10px] tracking-[0.24em] text-gold">
            404 / PRODUCT
          </p>
          <h1 className="mt-4 text-3xl text-ink">هذه القطعة غير موجودة.</h1>
          <p className="mt-3 text-[12px] text-ink-soft/60">
            ربما تغيّر الرابط أو انتهت الكمية. تصفّح الكتالوج الحالي للعثور على
            بديل.
          </p>
          <Link
            to="/#catalog"
            className="mt-6 bg-gold px-5 py-3 text-[11px] font-medium text-espresso"
          >
            العودة إلى الكتالوج
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const finalPrice = priceOf(product);
  const activeColor = product.colors.find((entry) => entry.name === color);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const related = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);

  const addToCart = () => {
    if (!size || !color) return;
    cart.addItem({ productId: product.id, size, color, qty });
    cart.openCart();
    toast.success("أُضيفت القطعة إلى الحقيبة", {
      description: `${product.name} · المقاس ${size}`,
    });
  };

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!slug) return;
    setReviewError(null);
    setIsSubmittingReview(true);
    try {
      await createReview({ productSlug: slug, rating, text: reviewText });
      setReviewText("");
      setRating(5);
      toast.success("تم إرسال تعليقك", {
        description: "سيظهر بعد مراجعة فريق المتجر.",
      });
    } catch (error) {
      setReviewError(
        error instanceof Error ? error.message : "تعذّر إرسال التعليق.",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <SiteLayout>
      <div className="border-b border-ink/10 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mono mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-[9px] tracking-[0.06em] text-ink-soft/40">
          <Link to="/" className="transition-colors hover:text-gold">
            HOME
          </Link>
          <span>/</span>
          <Link to="/#catalog" className="transition-colors hover:text-gold">
            CATALOG
          </Link>
          <span>/</span>
          <span>{categoryLabel(product.category, categories)}</span>
          <span>/</span>
          <span className="text-ink-soft/70">{product.name}</span>
        </div>
      </div>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="relative border border-ink/10 bg-card p-2.5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <ProductVisual
                  product={product}
                  className="h-full w-full"
                  imageClassName={cn(
                    "transition-transform duration-700 ease-out",
                    zoom && "scale-[1.6]",
                  )}
                  plateClassName={cn(
                    "p-8 transition-transform duration-700 ease-out",
                    zoom && "scale-[1.6]",
                  )}
                  eager
                >
                  <span className="mono absolute top-4 start-4 z-10 bg-black/55 px-2 py-1 text-[7px] tracking-[0.18em] text-white/80 backdrop-blur">
                    ZOMA EDIT / {product.kind.toUpperCase()}
                  </span>
                  {product.discount > 0 && (
                    <span className="shimmer-sweep mono absolute top-4 end-4 z-10 border border-gold/40 bg-black/55 px-2 py-1 text-[9px] text-gold backdrop-blur">
                      -{product.discount}%
                    </span>
                  )}
                </ProductVisual>
                <button
                  type="button"
                  onClick={() => setZoom((current) => !current)}
                  className="absolute bottom-3 end-3 z-10 flex items-center gap-1.5 border border-white/25 bg-black/55 px-2.5 py-1.5 text-[9px] text-white backdrop-blur transition-colors hover:bg-gold hover:text-espresso"
                >
                  <Maximize2 className="size-3" />
                  {zoom ? "تصغير" : "تكبير"}
                </button>

              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "القماش", value: product.fabric.split("—")[0] },
                { label: "الموسم", value: "خريف / شتاء ٢٦" },
                { label: "الصناعة", value: "مخيط يدوياً" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-ink/10 bg-card px-3 py-2.5"
                >
                  <p className="mono text-[7.5px] tracking-[0.12em] text-ink-soft/35">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[10px] text-ink-soft/75">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                {categoryLabel(product.category, categories).toUpperCase()} /{" "}
                {product.kind.toUpperCase()}
              </p>
              <div className="flex items-center gap-2">
                {reviews.length > 0 && <Stars rating={averageRating} />}
                <span className="mono text-[9px] text-ink-soft/40">
                  {reviews.length > 0
                    ? `${averageRating.toFixed(1)} · ${reviews.length} REVIEWS`
                    : "NEW — NO REVIEWS YET"}
                </span>
              </div>
            </div>

            <h1 className="mt-3 text-3xl leading-snug text-ink sm:text-[2.5rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-b border-ink/10 pb-5">
              <span className="mono text-2xl text-ink">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="price-strike mono pb-1 text-[11px] text-ink-soft/40">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mono mb-1 bg-gold px-2 py-0.5 text-[9px] font-medium text-espresso">
                    وفّر {product.discount}%
                  </span>
                </>
              )}
              <span className="ms-auto flex items-center gap-1.5 text-[10px] text-ink-soft/50">
                <span
                  className={cn(
                    "inline-block size-1.5",
                    product.inStock ? "bg-gold" : "bg-destructive",
                  )}
                />
                {product.inStock ? "متوفر الآن" : "نفدت الكمية"}
              </span>
            </div>

            <p className="mt-5 text-[13px] leading-8 text-ink-soft/75">
              {product.description}
            </p>
            <p className="mt-3 text-[10.5px] text-ink-soft/50">
              <span className="text-gold">القماش:</span> {product.fabric}
            </p>

            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-medium text-ink">المقاس</p>
                <span className="text-[9px] text-ink-soft/45">
                  القياسات تظهر فور اختيار المقاس
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      "mono min-w-12 border px-3 py-2.5 text-[11px] transition-colors",
                      size === option
                        ? "border-gold bg-gold text-espresso"
                        : "border-ink/15 text-ink hover:border-ink/40",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {size && <SizeGuide product={product} size={size} />}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-medium text-ink">
                اللون {activeColor ? `— ${activeColor.name}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-label={option.name}
                    aria-pressed={color === option.name}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border transition-all",
                      color === option.name
                        ? "border-gold ring-1 ring-gold ring-offset-2 ring-offset-paper"
                        : "border-ink/20 hover:border-ink/45",
                    )}
                    style={{ backgroundColor: option.hex }}
                  >
                    {color === option.name && (
                      <Check
                        className="size-3.5"
                        style={{
                          color:
                            option.hex.toLowerCase() === "#f2ebdc"
                              ? "#211c17"
                              : "#f4f3ec",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center justify-between border border-ink/15 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  className="px-3 py-3 text-ink transition-colors hover:bg-ink/5"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="mono w-8 text-center text-[12px]">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.min(9, current + 1))}
                  className="px-3 py-3 text-ink transition-colors hover:bg-ink/5"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={!product.inStock}
                className="h-12 flex-1 bg-gold px-6 text-[11px] font-semibold tracking-[0.08em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                أضف إلى الحقيبة — {formatPrice(finalPrice * qty)}
              </button>
            </div>

            <a
              href={whatsappLink(
                `مرحباً ${settings.storeName}، أريد طلب: ${product.name} — المقاس ${size} — اللون ${color} — الكمية ${qty}.`,
                settings.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex h-11 items-center justify-center gap-2 border border-ink/15 text-[10.5px] text-ink transition-colors hover:border-gold/60 hover:text-gold"
            >
              <MessageCircle className="size-4" />
              اطلبها مباشرة على واتساب
            </a>

            <div className="mt-6 grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-3">
              {[
                { icon: Truck, title: "توصيل ٢–٤ أيام", note: "لكل محافظات مصر" },
                { icon: ShieldCheck, title: "استبدال ١٤ يوماً", note: "بدون تعقيد" },
                { icon: CalendarDays, title: "جلسة قياس", note: "٣٠ دقيقة مجاناً" },
              ].map((service) => (
                <div key={service.title} className="flex items-start gap-2.5">
                  <service.icon
                    className="mt-0.5 size-4 shrink-0 text-gold"
                    strokeWidth={1.4}
                  />
                  <div>
                    <p className="text-[10px] font-medium text-ink">
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-[9px] text-ink-soft/40">
                      {service.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-deep/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                REVIEWS / COMMENTS
              </p>
              <h2 className="mt-2 text-2xl text-ink">آراء العملاء</h2>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 border border-ink/10 bg-card px-4 py-2.5">
                <span className="mono text-2xl text-gold">
                  {averageRating.toFixed(1)}
                </span>
                <div>
                  <Stars rating={averageRating} />
                  <p className="mt-1 text-[9px] text-ink-soft/40">
                    {reviews.length} تعليق منشور
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="border border-ink/10 bg-card px-5 py-8">
                  <p className="text-[13px] text-ink">
                    لا توجد تعليقات منشورة على هذه القطعة بعد.
                  </p>
                  <p className="mt-1 text-[11px] text-ink-soft/45">
                    اشترِ القطعة وشاركنا تجربتك مع المقاس والخامة.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-ink/10 bg-card px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center border border-ink/15 text-[10px] text-gold">
                          {review.authorName.slice(0, 1)}
                        </span>
                        <span className="text-[11px] font-medium text-ink">
                          {review.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="mono text-[8px] text-ink-soft/30">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] leading-7 text-ink-soft/70">
                      {review.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border border-ink/10 bg-card p-5">
              <p className="text-[13px] font-medium text-ink">أضف تعليقك</p>
              <p className="mt-1 text-[10px] leading-5 text-ink-soft/45">
                تُنشر التعليقات بعد مراجعة سريعة لضمان مصداقيتها.
              </p>

              {isAuthenticated ? (
                <form onSubmit={submitReview} className="mt-4 space-y-3">
                  <div>
                    <span className="mb-1.5 block text-[10px] text-ink-soft/60">
                      تقييمك
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          aria-label={`${value} من ٥`}
                          className="p-1"
                        >
                          <Star
                            className={cn(
                              "size-4",
                              value <= rating
                                ? "fill-gold text-gold"
                                : "text-ink-soft/25",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder="كيف كانت الخامة والمقاس؟ ساعد غيرك بتجربتك."
                    rows={4}
                    className="resize-none rounded-none border-ink/15 bg-paper-deep text-[12px]"
                  />
                  {reviewError && (
                    <p className="text-[10px] text-destructive">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmittingReview || reviewText.trim().length < 3}
                    className="flex h-10 w-full items-center justify-center gap-2 bg-gold text-[10.5px] font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {isSubmittingReview && (
                      <Loader2 className="size-3.5 animate-spin" />
                    )}
                    إرسال التعليق
                  </button>
                </form>
              ) : (
                <div className="mt-4">
                  <p className="text-[11px] leading-6 text-ink-soft/55">
                    سجّل الدخول بحسابك لتتمكن من إضافة تعليق ومتابعة طلباتك من
                    لوحة الحساب.
                  </p>
                  <Link
                    to={`/auth?returnTo=/product/${product.id}`}
                    className="mt-3 flex h-10 items-center justify-center bg-gold text-[10.5px] font-medium text-espresso"
                  >
                    الدخول وإضافة تعليق
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="mono text-[9px] tracking-[0.18em] text-gold">
                  PAIRS WITH
                </p>
                <h2 className="mt-2 text-2xl text-ink">يُنسّق معها</h2>
              </div>
              <Link
                to="/#catalog"
                className="flex items-center gap-2 text-[10px] text-ink-soft/50 transition-colors hover:text-gold"
              >
                كل المجموعة
                <ArrowUpLeft className="size-3.5" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group border border-ink/10 bg-card p-2 transition-colors hover:border-gold/40"
                >
                  <ProductVisual
                    product={item}
                    className="aspect-[4/5] w-full"
                    imageClassName="transition-transform duration-700 group-hover:scale-[1.05]"
                    plateClassName="p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                    framed={false}
                  />
                  <div className="px-1 pt-2.5">
                    <p className="truncate text-[11px] text-ink group-hover:text-gold">
                      {item.name}
                    </p>
                    <p className="mono mt-1 text-[10px] text-ink-soft/50">
                      {formatPrice(priceOf(item))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            "size-3",
            value <= Math.round(rating)
              ? "fill-gold text-gold"
              : "text-ink-soft/20",
          )}
        />
      ))}
    </span>
  );
}
