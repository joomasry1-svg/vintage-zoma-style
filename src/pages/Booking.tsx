import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/context/store-context";
import { formatBookingDate, whatsappLink } from "@/lib/store-helpers";
import { SiteLayout } from "@/components/site-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Check,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
} from "lucide-react";

const SERVICES = [
  "جلسة قياس كاملة",
  "استشارة بدلة عرس",
  "تنسيق إطلالة",
  "تعديل قطعة مشتراة",
];

const TIME_SLOTS = ["11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Booking() {
  const { settings } = useStore();
  const { user, isAuthenticated } = useAuth();
  const createBooking = useMutation(api.store.createBooking);

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return toISODate(date);
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user?.name) setName((current) => current || (user.name ?? ""));
  }, [user?.name]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 3) return setError("اكتب اسمك الكامل.");
    if (!/^[+\d][\d\s()-]{8,}$/.test(phone.trim()))
      return setError("اكتب رقم هاتف صحيحاً للتواصل.");
    if (!date) return setError("اختر تاريخ الجلسة.");
    if (!time) return setError("اختر موعداً من الأوقات المتاحة.");

    setIsSubmitting(true);
    try {
      const id = await createBooking({
        name: name.trim(),
        phone: phone.trim(),
        service,
        date,
        time,
        notes: notes.trim() || undefined,
      });
      const reference = `FIT-${id.slice(-5).toUpperCase()}`;
      const message = [
        `تأكيد حجز جلسة — ${settings.storeName}`,
        `رقم الحجز: ${reference}`,
        `الخدمة: ${service}`,
        `التاريخ: ${formatBookingDate(date)}`,
        `الموعد: ${time}`,
        `الاسم: ${name.trim()}`,
        `الهاتف: ${phone.trim()}`,
        notes.trim() ? `ملاحظات: ${notes.trim()}` : "",
        "",
        "أرجو تأكيد الموعد. شكراً لكم.",
      ]
        .filter(Boolean)
        .join("\n");
      setConfirmation({ reference, message });
      window.open(
        whatsappLink(message, settings.whatsapp),
        "_blank",
        "noopener,noreferrer",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "تعذّر حجز الموعد. حاول مرة أخرى.",
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
              FITTING / 03
            </span>
            <span className="mono text-[9px] text-ink-soft/40">
              CAIRO STUDIO — 30 MIN
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
            احجز جلسة قياس.
            <span className="block text-gold">مقاسك المضبوط يبدأ هنا.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[12.5px] leading-8 text-ink-soft/65">
            نأخذ مقاساتك كاملة، نجرّب القطع التي اخترتها، ونساعدك في التنسيق.
            الجلسة مجانية ولا تلزمك بالشراء — ونحفظ مقاساتك لطلبك القادم.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-ink/10 bg-card p-5 sm:p-7">
            {confirmation ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center border border-gold/40 bg-gold/10">
                  <Check className="size-5 text-gold" />
                </span>
                <p className="mono mt-5 text-[10px] tracking-[0.2em] text-gold">
                  {confirmation.reference}
                </p>
                <h2 className="mt-2 text-3xl text-ink">وصلنا حجزك.</h2>
                <p className="mt-3 max-w-sm text-[12px] leading-7 text-ink-soft/60">
                  سيتواصل معك فريقنا على {phone} لتأكيد الموعد. إذا لم يفتح
                  واتساب تلقائياً، أرسل رسالة التأكيد من الزر بالأسفل.
                </p>
                <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
                  <a
                    href={whatsappLink(confirmation.message, settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 bg-gold text-[10.5px] font-semibold text-espresso transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="size-4" />
                    إرسال رسالة التأكيد
                  </a>
                  <Link
                    to="/lookbook"
                    className="flex h-10 items-center justify-center border border-ink/15 text-[10.5px] text-ink-soft/70 transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    تصفح المجتمع أثناء الانتظار
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="mono text-[9px] tracking-[0.18em] text-gold">
                  BOOK A SLOT
                </p>
                <h2 className="mt-2 text-2xl text-ink">احجز موعدك</h2>
                <p className="mt-1 text-[11px] text-ink-soft/50">
                  الحقول المميزة إلزامية. الحجز مجاني بالكامل.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="الاسم الكامل">
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="مثال: أحمد محمود"
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                  <Field label="رقم الهاتف">
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="01xxxxxxxxx"
                      inputMode="tel"
                      dir="ltr"
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="نوع الجلسة">
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setService(option)}
                          className={cn(
                            "border px-3 py-2 text-[10.5px] transition-colors",
                            service === option
                              ? "border-gold bg-gold text-espresso"
                              : "border-ink/15 text-ink-soft/70 hover:border-ink/35 hover:text-ink",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="التاريخ">
                    <Input
                      type="date"
                      value={date}
                      min={toISODate(new Date())}
                      onChange={(event) => setDate(event.target.value)}
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                  <Field label="الموعد">
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={cn(
                            "mono border px-1 py-2.5 text-[10px] transition-colors",
                            time === slot
                              ? "border-gold bg-gold text-espresso"
                              : "border-ink/15 text-ink-soft/65 hover:border-ink/35 hover:text-ink",
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="ملاحظات (اختياري)">
                    <Textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="مقاسك الحالي، المناسبة، أو أي قطعة تريد تجربتها."
                      rows={3}
                      className="resize-none rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                </div>

                {error && (
                  <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-[10.5px] text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-gold text-[11px] font-semibold tracking-[0.08em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  تأكيد الحجز
                </button>
                <p className="mt-2 text-center text-[9px] text-ink-soft/35">
                  {isAuthenticated
                    ? "سيظهر الحجز في لوحة حسابك."
                    : "يمكنك الحجز كزائر، أو تسجيل الدخول لمتابعة مواعيدك."}
                </p>
              </form>
            )}
          </div>

          <aside className="space-y-3">
            <div className="border border-ink/10 bg-card p-5">
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                WHAT TO EXPECT
              </p>
              <h3 className="mt-2 text-xl text-ink">ثلاثون دقيقة، كل التفاصيل.</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "قياس كامل: صدر، كتف، طول، وأكمام.",
                  "تجربة البدلات والبليزرات المتوفرة في مقاسك.",
                  "استشارة تنسيق للقميص والحذاء المناسب.",
                  "ملخص مقاساتك يُحفظ في حسابك إن سجّلت الدخول.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mono mt-0.5 text-[9px] text-gold">＋</span>
                    <span className="text-[11.5px] leading-6 text-ink-soft/65">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink/10 bg-card p-5">
              <p className="mono text-[9px] tracking-[0.18em] text-gold">
                STUDIO
              </p>
              <ul className="mt-3 space-y-3 text-[11px] text-ink-soft/65">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink-soft/35" />
                  استوديو Zoma — الزمالك، القاهرة
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-3.5 shrink-0 text-ink-soft/35" />
                  يومياً من ١١ صباحاً حتى ١٠ مساءً
                </li>
                <li className="flex items-start gap-2.5">
                  <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-ink-soft/35" />
                  {date && time
                    ? `${formatBookingDate(date)} — ${time}`
                    : "اختر موعداً من النموذج"}
                </li>
              </ul>
              <a
                href={whatsappLink(
                  `مرحباً ${settings.storeName}، أريد الاستفسار عن جلسة القياس.`,
                  settings.whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-10 items-center justify-center gap-2 border border-ink/15 text-[10px] text-ink-soft/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <MessageCircle className="size-3.5" />
                اسأل قبل الحجز
              </a>
            </div>

            <div className="border border-gold/25 bg-gold/5 p-5">
              <p className="mono text-[9px] tracking-[0.16em] text-gold">
                GOOD TO KNOW
              </p>
              <p className="mt-2 text-[11px] leading-6 text-ink-soft/65">
                تغيير الموعد متاح حتى ٤ ساعات قبل الجلسة عبر واتساب. الحجز لا
                يتطلب أي دفع مقدم.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.06em] text-ink-soft/60">
        {label}
      </span>
      {children}
    </label>
  );
}
