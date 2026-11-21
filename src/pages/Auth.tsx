import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowLeft,
  ArrowUpLeft,
  Loader2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (signInError) {
      console.error("Email sign-in error:", signInError);
      setError(
        "تعذّر إرسال رمز الدخول. تأكد من البريد الإلكتروني وحاول مرة أخرى.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (verifyError) {
      console.error("OTP verification error:", verifyError);
      setError("الرمز غير صحيح أو منتهي الصلاحية. اطلب رمزاً جديداً.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (guestError) {
      console.error("Guest login error:", guestError);
      setError("تعذّر الدخول السريع حالياً. جرّب الدخول بالبريد.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden border-e border-ink/10 canvas-dark px-10 py-12 lg:flex lg:flex-col">
          <Link to="/" className="flex flex-col leading-none">
            <span className="mono text-2xl tracking-[0.22em] text-ink">ZOMA</span>
            <span className="mono mt-1 flex items-center gap-1.5 text-[7.5px] tracking-[0.26em] text-ink-soft/45">
              STORE
              <span className="inline-block size-1 bg-gold" />
              CAIRO
            </span>
          </Link>

          <div className="my-auto max-w-sm">
            <span className="mono bg-gold px-2 py-1 text-[8px] tracking-[0.16em] text-espresso">
              MEMBER ACCESS
            </span>
            <h1 className="mt-5 text-4xl leading-[1.35]">
              حسابك في Zoma.
              <span className="block text-gold">كل تفاصيلك في مكان واحد.</span>
            </h1>
            <p className="mt-4 text-[12px] leading-7 text-ink-soft/60">
              احفظ طلباتك، وشارك إطلالتك في المجتمع. الدخول بالبريد لا يحتاج
              كلمة مرور.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                { icon: ShieldCheck, text: "طلباتك محفوظة في مكان واحد" },
                { icon: Sparkles, text: "وصول مبكر لقطع الموسم" },
                { icon: MessageCircle, text: "دعم مباشر على واتساب" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-2.5 text-[11px] text-ink-soft/60"
                >
                  <item.icon className="size-3.5 text-gold" strokeWidth={1.5} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="mono text-[8px] tracking-[0.16em] text-ink-soft/25">
            ZOMA STORE / EST. 2026
          </p>
        </aside>

        <main className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center justify-between lg:hidden">
              <Link to="/" className="flex flex-col leading-none">
                <span className="mono text-xl tracking-[0.2em] text-ink">
                  ZOMA
                </span>
                <span className="mono mt-1 text-[7px] tracking-[0.22em] text-ink-soft/40">
                  STORE / CAIRO
                </span>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-[10px] text-ink-soft/50"
              >
                المتجر
                <ArrowUpLeft className="size-3" />
              </Link>
            </div>

            <div className="mt-10 lg:mt-0">
              <p className="mono text-[9px] tracking-[0.2em] text-gold">
                {step === "signIn" ? "SIGN IN / SIGN UP" : "VERIFY CODE"}
              </p>

              {step === "signIn" ? (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-ink">
                    الدخول إلى حسابك
                  </h2>
                  <p className="mt-2 text-[12px] leading-6 text-ink-soft/55">
                    أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق من ٦ أرقام. إن لم
                    يكن لديك حساب، سننشئه تلقائياً.
                  </p>

                  <form onSubmit={handleEmailSubmit} className="mt-6">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] text-ink-soft/60">
                        البريد الإلكتروني
                      </span>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft/30" />
                        <Input
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          dir="ltr"
                          className="h-12 rounded-none border-ink/15 bg-paper-deep ps-10 text-start text-sm"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </label>

                    {error && (
                      <p className="mt-3 border border-destructive/30 bg-destructive/10 px-3 py-2 text-[10px] text-destructive">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-gold text-[11px] font-semibold tracking-[0.06em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Mail className="size-4" />
                      )}
                      إرسال رمز الدخول
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="mono text-[8px] tracking-[0.16em] text-ink-soft/30">
                      OR
                    </span>
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 border border-ink/15 text-[11px] text-ink transition-colors hover:border-ink/40 disabled:opacity-50"
                  >
                    <UserRound className="size-4 text-gold" />
                    الدخول السريع كزائر
                  </button>
                  <p className="mt-2 text-center text-[9.5px] text-ink-soft/35">
                    مناسب للتصفح والشراء السريع — يمكنك ربط البريد لاحقاً.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-ink">
                    أدخل رمز التحقق
                  </h2>
                  <p className="mt-2 text-[12px] leading-6 text-ink-soft/55">
                    أرسلنا رمزاً من ٦ أرقام إلى{" "}
                    <span className="text-ink" dir="ltr">
                      {typeof step === "object" ? step.email : ""}
                    </span>
                    . تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها.
                  </p>

                  <form onSubmit={handleOtpSubmit} className="mt-6">
                    <input
                      type="hidden"
                      name="email"
                      value={typeof step === "object" ? step.email : ""}
                    />
                    <input type="hidden" name="code" value={otp} />

                    <div className="flex justify-center" dir="ltr">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            otp.length === 6 &&
                            !isLoading
                          ) {
                            const form = (
                              event.target as HTMLElement
                            ).closest("form");
                            if (form) form.requestSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup className="gap-1.5">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-11 rounded-none border border-ink/20 bg-paper-deep text-base first:rounded-none last:rounded-none"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-[10px] text-destructive">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-gold text-[11px] font-semibold tracking-[0.06em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowLeft className="size-4" />
                      )}
                      تحقق ودخول
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("signIn");
                        setOtp("");
                        setError(null);
                      }}
                      disabled={isLoading}
                      className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 text-[10px] text-ink-soft/50 transition-colors hover:text-ink"
                    >
                      استخدام بريد آخر
                    </button>
                  </form>
                </>
              )}

              <div className="mt-8 border-t border-ink/10 pt-4">
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-[10px] text-ink-soft/40 transition-colors hover:text-gold"
                >
                  <ArrowUpLeft className="size-3" />
                  العودة إلى المتجر
                </Link>
                <p className="mt-3 text-[9px] leading-5 text-ink-soft/25">
                  نحتفظ ببيانات حسابك لتأكيد الطلبات فقط. لا نشاركها
                  مع أطراف أخرى.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
