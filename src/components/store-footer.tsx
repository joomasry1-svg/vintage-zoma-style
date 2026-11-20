import { Link } from "react-router";
import { CATEGORIES } from "@/data/store";
import { useStore } from "@/context/store-context";
import { whatsappLink } from "@/lib/store-helpers";
import { ArrowUpLeft, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export function StoreFooter() {
  const { settings } = useStore();
  const year = new Date().getFullYear();
  const enabledPayments = settings.paymentMethods.filter(
    (method) => method.enabled,
  );

  return (
    <footer className="relative border-t border-ink/10 bg-espresso text-ink">
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex flex-col">
              <span className="mono text-3xl tracking-[0.22em] text-ink">
                ZOMA
              </span>
              <span className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.24em] text-signal-orange">
                STORE
                <span className="inline-block size-1 bg-gold" />
                {settings.tagline}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[12px] leading-7 text-ink-soft/80">
              ملابس رجالية مختارة بقصّات دقيقة وأقمشة تدوم. نساعدك على اختيار
              القطعة المناسبة، ونوصلها إلى بابك في كل محافظات مصر.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={whatsappLink(
                  `مرحباً ${settings.storeName}، أريد الاستفسار عن المجموعة الحالية.`,
                  settings.whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gold px-4 py-2.5 text-[11px] font-medium text-espresso transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-3.5" />
                اطلب عبر واتساب
              </a>
              <a
                href={`tel:${settings.whatsapp}`}
                className="flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-[11px] text-ink transition-colors hover:border-ink/50"
              >
                <Phone className="size-3.5" />
                <span dir="ltr">{settings.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="mono text-[10px] tracking-[0.2em] text-gold">
              SHOP / المتجر
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-[12px] text-ink-soft/80 transition-colors hover:text-ink"
                >
                  كل المجموعة
                </Link>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/?cat=${category.id}#catalog`}
                    className="text-[12px] text-ink-soft/80 transition-colors hover:text-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/lookbook"
                  className="text-[12px] text-ink-soft/80 transition-colors hover:text-ink"
                >
                  مجتمع Zoma
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="mono text-[10px] tracking-[0.2em] text-gold">
              SERVICE / الخدمة
            </p>
            <ul className="mt-4 space-y-3 text-[12px] text-ink-soft/80">
              <li>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
                >
                  حجز جلسة قياس
                  <ArrowUpLeft className="size-3 text-signal-orange" />
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="transition-colors hover:text-ink"
                >
                  حسابي وطلباتي
                </Link>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink-soft/50" />
                {settings.city} — توصيل لكل المحافظات
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-ink-soft/50" />
                يومياً من ١١ صباحاً حتى ١٠ مساءً
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-3.5 shrink-0 text-ink-soft/50" />
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all transition-colors hover:text-ink"
                >
                  {settings.email}
                </a>
              </li>
            </ul>

            <p className="mono mt-6 text-[10px] tracking-[0.2em] text-gold">
              PAYMENTS / الدفع
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {enabledPayments.map((method) => (
                <span
                  key={method.id}
                  className="border border-ink/15 px-2.5 py-1.5 text-[10px] text-ink-soft/80"
                >
                  {method.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {settings.footerCredit && (
          <div className="mt-10 inline-flex items-center gap-2 border border-ink/10 px-3 py-2">
            <span className="mono text-[9px] text-ink-soft/40">DEV</span>
            <a
              href={settings.footerCreditUrl || "https://wa.me/201221736903"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-ink-soft/45 transition-colors hover:text-gold"
            >
              {settings.footerCredit}
            </a>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-[10px] tracking-[0.04em] text-ink-soft/40">
            © {year} {settings.storeName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-ink-soft/40">
            <Link to="/booking" className="transition-colors hover:text-ink">
              المواعيد
            </Link>
            <Link to="/lookbook" className="transition-colors hover:text-ink">
              المجتمع
            </Link>
            <Link
              to="/admin"
              className="mono tracking-[0.08em] transition-colors hover:text-signal-orange"
            >
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
