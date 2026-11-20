import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { StoreFooter } from "@/components/store-footer";
import { useStore } from "@/context/store-context";
import { whatsappLink } from "@/lib/store-helpers";
import { MessageCircle, Phone } from "lucide-react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <FloatingContact />
    </div>
  );
}

function FloatingContact() {
  const { settings } = useStore();

  return (
    <div className="fixed bottom-5 end-4 z-40 flex flex-col gap-2">
      <a
        href={whatsappLink(
          `مرحباً ${settings.storeName}، أريد الاستفسار عن منتجاتكم.`,
          settings.whatsapp,
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="flex size-12 items-center justify-center rounded-full bg-gold text-espresso shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="size-5" />
      </a>
      <a
        href={`tel:${settings.whatsapp}`}
        aria-label={`اتصل بنا ${settings.phoneDisplay}`}
        className="flex size-12 items-center justify-center rounded-full border border-ink/20 bg-card text-ink shadow-lg transition-transform hover:scale-105"
      >
        <Phone className="size-[18px]" />
      </a>
    </div>
  );
}
