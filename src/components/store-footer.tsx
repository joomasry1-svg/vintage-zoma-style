import { Link } from "react-router";
import { useStore } from "@/context/store-context";
import { whatsappLink } from "@/lib/store-helpers";
import {
  ArrowUpLeft,
  Clock,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

export function StoreFooter() {
  const { settings, categories } = useStore();
  const year = new Date().getFullYear();
  const enabledPayments = settings.paymentMethods.filter(
    (method) => method.enabled,
  );

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-espresso text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-16 -top-16 size-64 rounded-full bg-gold/[0.06] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex flex-col">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="h-10 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <span className="mono text-3xl tracking-[0.22em] text-ink">
                  ZOMA
                </span>
              )}
              <span className="mt-2 flex items-center gap-2 text-[9px] tracking-[0.24em] text-gold">
                <span
                  className="inline-block size-1 bg-gold"
                  aria-hidden="true"
                />
                {settings.storeName}
                <span className="text-ink-soft/30">/</span>
                {settings.city}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[12px] leading-7 text-ink-soft/70">
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
                className="shimmer-sweep flex items-center gap-2 bg-gold px-4 py-2.5 text-[11px] font-semibold text-espresso transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-3.5" />
                اطلب عبر واتساب
              </a>
              <a
                href={`tel:${settings.whatsapp}`}
                className="flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-[11px] text-ink transition-colors hover:border-gold hover:text-gold"
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
                  to="/#catalog"
                  className="text-[12px] text-ink-soft/75 transition-colors hover:text-gold"
                >
                  كل المجموعة
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/?cat=${category.id}#catalog`}
                    className="text-[12px] text-ink-soft/75 transition-colors hover:text-gold"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/lookbook"
                  className="text-[12px] text-ink-soft/75 transition-colors hover:text-gold"
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
            <ul className="mt-4 space-y-3 text-[12px] text-ink-soft/75">
              <li>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
                >
                  حجز جلسة قياس
                  <ArrowUpLeft className="size-3 text-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="transition-colors hover:text-gold"
                >
                  حسابي وطلباتي
                </Link>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold/50" />
                {settings.city} — توصيل لكل المحافظات
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-gold/50" />
                يومياً من ١١ صباحاً حتى ١٠ مساءً
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-3.5 shrink-0 text-gold/50" />
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all transition-colors hover:text-gold"
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
                  className="border border-gold/20 px-2.5 py-1.5 text-[10px] text-ink-soft/75"
                >
                  {method.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {settings.footerCredit && (
          <div className="mt-10 inline-flex items-center gap-2 border border-ink/10 px-3 py-2">
            <span className="mono text-[9px] text-ink-soft/35">DEV</span>
            <a
              href={settings.footerCreditUrl || "https://wa.me/201221736903"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-ink-soft/40 transition-colors hover:text-gold"
            >
              {settings.footerCredit}
            </a>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-[10px] tracking-[0.04em] text-ink-soft/35">
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
              className="mono group inline-flex items-center gap-1.5 text-[9.5px] tracking-[0.04em] text-ink-soft/30 transition-colors hover:text-gold"
              aria-label="دخول لصاحب المتجر"
            >
              <Lock className="size-2.5 opacity-70" />
              دخول لصاحب المتجر
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
