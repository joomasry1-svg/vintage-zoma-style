import { Link } from "react-router";
import { ArrowUpLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center canvas-dark px-4">
      <div className="w-full max-w-lg border border-ink/10 bg-card p-8 text-center">
        <p className="mono text-[10px] tracking-[0.24em] text-gold">
          ERROR / 404
        </p>
        <p className="mono mt-6 text-6xl leading-none text-ink">404</p>
        <h1 className="mt-4 text-2xl text-ink">هذه الصفحة غير موجودة.</h1>
        <p className="mt-2 text-[11.5px] leading-6 text-ink-soft/55">
          ربما تغيّر الرابط أو حُذفت الصفحة. يمكنك العودة إلى المتجر أو تصفح
          المجتمع من جديد.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/"
            className="flex h-11 flex-1 items-center justify-center gap-2 bg-gold text-[10.5px] font-semibold text-espresso transition-opacity hover:opacity-90"
          >
            العودة إلى المتجر
            <ArrowUpLeft className="size-3.5" />
          </Link>
          <Link
            to="/lookbook"
            className="flex h-11 flex-1 items-center justify-center border border-ink/15 text-[10.5px] text-ink-soft/60 transition-colors hover:border-ink/40 hover:text-ink"
          >
            مجتمع Zoma
          </Link>
        </div>
      </div>
    </div>
  );
}
