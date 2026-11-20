import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";

/**
 * Wraps a route that requires a signed-in user.
 *
 * Signed-out visitors used to be bounced straight to `/auth`, which left them
 * on a bare sign-in form with no idea which page they had asked for or why they
 * were moved. The block is now stated on the page they landed on, and sign-in
 * still returns them to it via `returnTo`. Pass `redirectImmediately` for a
 * route where the bounce really is the better experience.
 */
export function RequireAuth({
  children,
  title = "سجّل الدخول للمتابعة",
  description = "هذه الصفحة متاحة للحسابات المسجلة فقط.",
  redirectImmediately = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  redirectImmediately?: boolean;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="size-5 animate-spin text-gold" />
      </main>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    const signInHref = `/auth?returnTo=${encodeURIComponent(returnTo)}`;

    if (redirectImmediately) {
      return <Navigate to={signInHref} replace />;
    }

    return (
      <main className="flex min-h-screen items-center justify-center canvas-dark p-6">
        <div className="w-full max-w-md border border-ink/10 bg-card p-7 text-center">
          <div className="mx-auto flex size-11 items-center justify-center border border-gold/30 bg-gold/5">
            <Lock className="size-4 text-gold" />
          </div>
          <p className="mono mt-5 text-[9px] tracking-[0.2em] text-gold">
            ACCOUNT REQUIRED
          </p>
          <h1 className="mt-2 text-2xl text-ink">{title}</h1>
          <p className="mt-2 text-[11.5px] leading-6 text-ink-soft/55">
            {description}
          </p>
          <p className="mt-1 text-[10px] text-ink-soft/35">
            ستعود إلى هذه الصفحة مباشرة بعد الدخول.
          </p>
          <button
            type="button"
            onClick={() => navigate(signInHref)}
            className="mt-5 h-11 w-full bg-gold text-[11px] font-semibold text-espresso transition-opacity hover:opacity-90"
          >
            تسجيل الدخول
          </button>
          <Link
            to="/"
            className="mt-2 flex h-10 w-full items-center justify-center border border-ink/15 text-[10.5px] text-ink-soft/60 transition-colors hover:border-ink/40 hover:text-ink"
          >
            العودة إلى المتجر
          </Link>
        </div>
      </main>
    );
  }

  return children;
}
