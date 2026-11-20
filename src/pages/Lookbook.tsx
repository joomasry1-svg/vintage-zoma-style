import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/context/store-context";
import { formatDate, POST_STATUS_LABELS, whatsappLink } from "@/lib/store-helpers";
import { SiteLayout } from "@/components/site-layout";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  MessageCircle,
  Upload,
  X,
} from "lucide-react";

export default function Lookbook() {
  const posts = useQuery(api.store.listPosts) ?? [];
  const { isAuthenticated } = useAuth();
  const { settings } = useStore();
  const myPosts = useQuery(api.store.myPosts) ?? [];
  const generateUploadUrl = useMutation(api.store.generatePostUploadUrl);
  const createPost = useMutation(api.store.createPost);

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (window.location.hash !== "#share") return;
    const timer = window.setTimeout(() => {
      document
        .getElementById("share")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const handleFile = (nextFile: File | undefined) => {
    setError(null);
    if (!nextFile) return setFile(null);
    if (!nextFile.type.startsWith("image/")) {
      setError("اختر صورة بصيغة JPG أو PNG.");
      return;
    }
    if (nextFile.size > 6 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من ٦ ميجابايت.");
      return;
    }
    setFile(nextFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (caption.trim().length < 3) {
      setError("اكتب وصفاً قصيراً للإطلالة.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageId: Id<"_storage"> | undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!response.ok) throw new Error("تعذّر رفع الصورة. حاول مرة أخرى.");
        const result = (await response.json()) as { storageId: string };
        imageId = result.storageId as Id<"_storage">;
      }

      await createPost({ caption: caption.trim(), imageId });
      setCaption("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPublished(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "تعذّر نشر المشاركة. حاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="border-b border-ink/10 canvas-dark px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono bg-gold px-2 py-1 text-[8px] tracking-[0.16em] text-espresso">
              COMMUNITY / 02
            </span>
            <span className="mono text-[9px] text-ink-soft/40">
              CUSTOMER LOOKS — CURATED
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
            إطلالات حقيقية.
            <span className="block text-gold">من ناس يلبسون Zoma.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[12.5px] leading-8 text-ink-soft/65">
            شارك صورتك بإطلالة من المتجر، اكتب اسم القطعة أو المناسبة، وسنعرضها
            هنا بعد مراجعة سريعة. مساحة للذوق، لا للإعلانات.
          </p>
        </div>
      </section>

      <section
        id="share"
        className="scroll-mt-24 border-b border-ink/10 bg-paper-deep/30 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-ink/10 bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                SHARE YOUR LOOK
              </p>
              <Camera className="size-4 text-ink-soft/25" />
            </div>
            <h2 className="mt-2 text-2xl text-ink">ارفع إطلالتك</h2>
            <p className="mt-1 text-[11px] text-ink-soft/50">
              الصورة اختيارية — يمكنك مشاركة نص قصير عن تجربتك مع القطعة.
            </p>

            {!isAuthenticated ? (
              <div className="mt-5 border border-ink/10 bg-paper px-4 py-5">
                <p className="text-[12px] leading-6 text-ink-soft/65">
                  سجّل الدخول أولاً لرفع صورة أو نشر مشاركة. يمكنك الدخول بالبريد
                  أو كزائر في خطوة واحدة.
                </p>
                <Link
                  to="/auth?returnTo=/lookbook%23share"
                  className="mt-4 flex h-10 w-full items-center justify-center bg-gold text-[10.5px] font-semibold text-espresso"
                >
                  الدخول للمشاركة
                </Link>
              </div>
            ) : published ? (
              <div className="mt-5 flex flex-col items-center justify-center border border-gold/25 bg-gold/5 px-5 py-8 text-center">
                <span className="flex size-10 items-center justify-center border border-gold/40">
                  <Check className="size-4 text-gold" />
                </span>
                <p className="mt-3 text-lg text-ink">وصلت مشاركتك.</p>
                <p className="mt-1 max-w-xs text-[11px] leading-6 text-ink-soft/55">
                  ستظهر في المجتمع بعد مراجعة الفريق. يمكنك متابعة حالتها من
                  لوحة حسابك.
                </p>
                <button
                  type="button"
                  onClick={() => setPublished(false)}
                  className="mt-4 border border-ink/20 px-4 py-2 text-[10px] text-ink transition-colors hover:border-gold hover:text-gold"
                >
                  مشاركة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-dashed border-ink/20 bg-paper sm:w-44">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft/40 transition-colors hover:text-gold"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="معاينة الصورة"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <ImagePlus className="size-5" />
                          <span className="text-[9px]">إضافة صورة</span>
                        </>
                      )}
                    </button>
                    {preview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        aria-label="إزالة الصورة"
                        className="absolute end-1.5 top-1.5 bg-espresso/90 p-1 text-ink"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <Textarea
                      value={caption}
                      onChange={(event) => setCaption(event.target.value)}
                      placeholder="مثال: بدلة سافيلي الكحلية في حفل تخرج صديقي — المقاس ٥٠ مضبوط تماماً."
                      rows={5}
                      className="h-full min-h-28 resize-none rounded-none border-ink/15 bg-paper-deep text-[12px]"
                    />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  className="hidden"
                />

                {error && (
                  <p className="mt-3 border border-destructive/30 bg-destructive/10 px-3 py-2 text-[10px] text-destructive">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[9px] text-ink-soft/35">
                    JPG / PNG — بحد أقصى ٦ ميجابايت
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-10 items-center gap-2 bg-gold px-5 text-[10.5px] font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    نشر المشاركة
                  </button>
                </div>
              </form>
            )}

            {myPosts.length > 0 && (
              <div className="mt-6 border-t border-ink/10 pt-4">
                <p className="mono text-[8px] tracking-[0.14em] text-ink-soft/35">
                  YOUR SUBMISSIONS
                </p>
                <ul className="mt-2 space-y-2">
                  {myPosts.slice(0, 3).map((post) => (
                    <li
                      key={post._id}
                      className="flex items-center justify-between gap-2 border border-ink/10 px-3 py-2"
                    >
                      <span className="line-clamp-1 text-[10px] text-ink-soft/65">
                        {post.caption}
                      </span>
                      <span
                        className={cn(
                          "mono shrink-0 text-[8px]",
                          post.status === "approved"
                            ? "text-gold"
                            : post.status === "rejected"
                              ? "text-destructive"
                              : "text-ink-soft/35",
                        )}
                      >
                        {POST_STATUS_LABELS[post.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="border border-ink/10 bg-card p-5 sm:p-6">
            <p className="mono text-[9px] tracking-[0.18em] text-gold">
              HOUSE RULES
            </p>
            <h3 className="mt-2 text-xl text-ink">قبل أن تنشر</h3>
            <ul className="mt-4 space-y-3">
              {[
                "صورة واضحة لك أو للإطلالة، ويفضل إضاءة طبيعية.",
                "اذكر اسم القطعة أو المناسبة في الوصف.",
                "لا تضع أرقاماً أو روابط دعائية في المشاركة.",
                "نحتفظ بحق رفض أي محتوى غير مناسب.",
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2.5">
                  <span className="mono mt-0.5 text-[9px] text-gold">＋</span>
                  <span className="text-[11.5px] leading-6 text-ink-soft/65">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink(
                `مرحباً ${settings.storeName}، عندي سؤال عن المجتمع.`,
                settings.whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex h-10 items-center justify-center gap-2 border border-ink/15 text-[10px] text-ink-soft/65 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <MessageCircle className="size-3.5" />
              عندك سؤال؟ كلّمنا
            </a>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                THE FEED
              </p>
              <h2 className="mt-2 text-2xl text-ink">أحدث المشاركات</h2>
            </div>
            <span className="mono text-[9px] text-ink-soft/35">
              {posts.length} POSTS
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center border border-dashed border-ink/15 px-6 py-16 text-center">
              <Camera className="size-6 text-ink-soft/25" />
              <p className="mt-4 text-xl text-ink">المجتمع ينتظر أول إطلالة.</p>
              <p className="mt-2 max-w-sm text-[11.5px] leading-6 text-ink-soft/50">
                بعد أول عملية شراء، شارك صورتك مع القطعة وسننشرها هنا.
              </p>
              <Link
                to="/#catalog"
                className="mt-5 border border-ink/20 px-5 py-2.5 text-[10.5px] text-ink transition-colors hover:border-gold hover:text-gold"
              >
                تصفح الكتالوج
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="border border-ink/10 bg-card p-2"
                >
                  {post.imageUrl ? (
                    <div className="aspect-[4/5] overflow-hidden bg-stage">
                      <img
                        src={post.imageUrl}
                        alt={post.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center bg-paper px-6 text-center">
                      <p className="text-[14px] leading-8 text-ink-soft/75">
                        {post.caption}
                      </p>
                    </div>
                  )}
                  <div className="px-2 pb-1 pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10.5px] font-medium text-ink">
                        {post.authorName}
                      </span>
                      <span className="mono text-[8px] text-ink-soft/30">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    {post.imageUrl && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-ink-soft/55">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
