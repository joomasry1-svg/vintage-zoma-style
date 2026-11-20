import { CATEGORIES, STORE, type CategoryId } from "@/data/store";
import { whatsappLink } from "@/lib/store-helpers";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

export function StoreFooter({
  onNavigateCategory,
}: {
  onNavigateCategory: (category: CategoryId | "all") => void;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gold/25 bg-espresso text-paper-deep">
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-latin text-3xl tracking-[0.22em] text-paper">ZOMA</p>
            <p className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.34em] text-gold-soft/80">
              STORE
              <span className="inline-block size-1 rotate-45 bg-gold" />
              {STORE.tagline}
            </p>
            <p className="mt-5 max-w-sm text-[12px] leading-7 text-paper-deep/70">
              بدلات وقمصان وأحذية رجالية مختارة بعناية من أجود الأقمشة، بقصّات
              كلاسيكية صُنعت لتبقى. نجهّز قطعتك ونتابع معك الطلب حتى بابك.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={whatsappLink(
                  `مرحباً ${STORE.name}، أريد الاستفسار عن المجموعة الشتوية.`,
                  STORE.whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gold/50 px-4 py-2.5 text-[11px] text-paper transition-colors hover:bg-gold hover:text-espresso"
              >
                <MessageCircle className="size-3.5" />
                اطلب عبر واتساب
              </a>
              <a
                href={STORE.phoneHref}
                className="flex items-center gap-2 border border-paper-deep/25 px-4 py-2.5 text-[11px] text-paper-deep/90 transition-colors hover:border-paper-deep/70 hover:text-paper"
              >
                <Phone className="size-3.5" />
                <span dir="ltr">{STORE.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] tracking-[0.26em] text-gold-soft">المجموعة</p>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateCategory(category.id);
                      document
                        .getElementById("catalog")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="text-[12px] text-paper-deep/70 transition-colors hover:text-paper"
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] tracking-[0.26em] text-gold-soft">
              خدمة العملاء
            </p>
            <ul className="mt-4 space-y-3 text-[12px] text-paper-deep/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold/80" />
                {STORE.city} — التوصيل لكل المحافظات
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-gold/80" />
                يومياً من ١١ صباحاً حتى ١١ مساءً
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-gold/80" />
                <a
                  href={whatsappLink("مرحباً، أريد المساعدة في اختيار مقاسي.", STORE.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-paper"
                >
                  استشارة مقاسات وأقمشة على واتساب
                </a>
              </li>
            </ul>

            <p className="mt-6 text-[10px] tracking-[0.26em] text-gold-soft">
              طرق الدفع
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["الدفع عند الاستلام", "إنستاباي"].map((method) => (
                <span
                  key={method}
                  className="border border-paper-deep/25 px-2.5 py-1.5 text-[10px] text-paper-deep/80"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-5 text-paper-deep/50">
              عند التحويل عبر إنستاباي أرسل صورة الإيصال على واتساب{" "}
              {STORE.phoneDisplay}.
            </p>
          </div>
        </div>

        <div className="mt-12 gold-rule" />

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] tracking-[0.06em] text-paper-deep/50">
            © {year} {STORE.name}. جميع الحقوق محفوظة.
          </p>
          <a
            href={`https://wa.me/${STORE.developerCredit.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.02em] text-paper-deep/45 transition-colors hover:text-gold-soft"
          >
            {STORE.developerCredit.text}
          </a>
        </div>
      </div>
    </footer>
  );
}
