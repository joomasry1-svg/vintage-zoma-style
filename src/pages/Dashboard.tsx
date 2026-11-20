import { Link, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/context/store-context";
import {
  BOOKING_STATUS_LABELS,
  formatBookingDate,
  formatDate,
  formatDateTime,
  formatPrice,
  ORDER_STATUS_LABELS,
  POST_STATUS_LABELS,
  whatsappLink,
} from "@/lib/store-helpers";
import { SiteLayout } from "@/components/site-layout";
import { cn } from "@/lib/utils";
import {
  ArrowUpLeft,
  CalendarDays,
  Camera,
  LogOut,
  MessageCircle,
  Package,
  Star,
  Store,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  new: "border-signal-blue/40 bg-signal-blue/10 text-signal-blue",
  confirmed: "border-gold/40 bg-gold/10 text-gold",
  shipped: "border-signal-blue/40 bg-signal-blue/10 text-signal-blue",
  delivered: "border-gold/50 bg-gold/15 text-gold",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  pending: "border-signal-orange/40 bg-signal-orange/10 text-signal-orange",
  completed: "border-gold/40 bg-gold/10 text-gold",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const orders = useQuery(api.store.myOrders) ?? [];
  const bookings = useQuery(api.store.myBookings) ?? [];
  const posts = useQuery(api.store.myPosts) ?? [];
  const reviews = useQuery(api.store.myReviews) ?? [];

  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "عضو Zoma";
  const initials = displayName.slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SiteLayout>
      <section className="border-b border-ink/10 canvas-dark px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mono text-[9px] tracking-[0.2em] text-gold">
              ACCOUNT / DASHBOARD
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="mono flex size-10 items-center justify-center border border-gold/40 bg-gold/10 text-[13px] text-gold">
                {initials}
              </span>
              <div>
                <h1 className="text-3xl text-ink sm:text-4xl">
                  أهلاً، {displayName}.
                </h1>
                <p className="mt-1 text-[10.5px] text-ink-soft/45">
                  {user?.email ??
                    "حساب زائر — يمكنك متابعة الطلبات والمواعيد من هنا."}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-10 items-center gap-2 self-start border border-ink/15 px-4 text-[10px] text-ink-soft/60 transition-colors hover:border-ink/40 hover:text-ink"
          >
            <LogOut className="size-3.5" />
            تسجيل الخروج
          </button>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "الطلبات", value: String(orders.length).padStart(2, "0") },
              { label: "إجمالي المشتريات", value: formatPrice(totalSpent) },
              { label: "المواعيد", value: String(bookings.length).padStart(2, "0") },
              { label: "مشاركات المجتمع", value: String(posts.length).padStart(2, "0") },
            ].map((stat) => (
              <div key={stat.label} className="border border-ink/10 bg-card p-4">
                <p className="mono text-[8px] tracking-[0.14em] text-ink-soft/35">
                  {stat.label}
                </p>
                <p className="mono mt-2 truncate text-lg text-ink">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { to: "/#catalog", label: "تصفح الكتالوج", icon: Store },
              { to: "/booking", label: "احجز جلسة قياس", icon: CalendarDays },
              { to: "/lookbook#share", label: "شارك إطلالتك", icon: Camera },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex items-center justify-between border border-ink/10 bg-card px-4 py-3.5 transition-colors hover:border-gold/40"
              >
                <span className="flex items-center gap-2.5 text-[11px] text-ink-soft/70">
                  <action.icon className="size-4 text-gold" strokeWidth={1.4} />
                  {action.label}
                </span>
                <ArrowUpLeft className="size-3.5 text-ink-soft/25 transition-colors group-hover:text-gold" />
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="mono text-[9px] tracking-[0.18em] text-gold">
                    ORDERS
                  </p>
                  <h2 className="mt-2 text-2xl text-ink">طلباتك</h2>
                </div>
                <span className="mono text-[8px] text-ink-soft/30">
                  {orders.length} TOTAL
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {orders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="لا توجد طلبات بعد"
                    copy="ابدأ من الكتالوج، وأضف أول قطعة إلى الحقيبة. نرسل لك تأكيد الطلب على واتساب."
                    action={
                      <Link
                        to="/#catalog"
                        className="bg-gold px-4 py-2.5 text-[10px] font-medium text-espresso"
                      >
                        تصفح الكتالوج
                      </Link>
                    }
                  />
                ) : (
                  orders.map((order) => (
                    <article
                      key={order._id}
                      className="border border-ink/10 bg-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="mono text-[10px] text-gold">
                            {order.code}
                          </span>
                          <span className="mono text-[8px] text-ink-soft/30">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "mono border px-2 py-1 text-[8px]",
                            STATUS_STYLES[order.status] ??
                              "border-ink/15 text-ink-soft/50",
                          )}
                        >
                          {ORDER_STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                      <div className="px-4 py-3">
                        <ul className="space-y-1.5">
                          {order.items.map((item, index) => (
                            <li
                              key={`${order._id}-${index}`}
                              className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]"
                            >
                              <span className="text-ink-soft/70">
                                {item.name}
                                <span className="mono text-[9px] text-ink-soft/35">
                                  {" "}
                                  / {item.size} · {item.color} × {item.qty}
                                </span>
                              </span>
                              <span className="mono text-[10px] text-ink-soft/60">
                                {formatPrice(item.unitPrice * item.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2.5">
                          <span className="text-[9px] text-ink-soft/40">
                            {order.payment}
                          </span>
                          <span className="mono text-[12px] text-ink">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="mono text-[9px] tracking-[0.18em] text-gold">
                      APPOINTMENTS
                    </p>
                    <h2 className="mt-2 text-2xl text-ink">مواعيدك</h2>
                  </div>
                  <Link
                    to="/booking"
                    className="text-[10px] text-ink-soft/45 transition-colors hover:text-gold"
                  >
                    حجز موعد جديد
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {bookings.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="لا توجد مواعيد قياس"
                      copy="احجز ٣٠ دقيقة في الاستوديو لضبط مقاسك وتجربة القطع قبل الشراء."
                      action={
                        <Link
                          to="/booking"
                          className="bg-gold px-4 py-2.5 text-[10px] font-medium text-espresso"
                        >
                          احجز جلسة
                        </Link>
                      }
                    />
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-wrap items-center justify-between gap-3 border border-ink/10 bg-card px-4 py-3"
                      >
                        <div>
                          <p className="text-[12px] font-medium text-ink">
                            {booking.service}
                          </p>
                          <p className="mono mt-1 text-[9px] text-ink-soft/40">
                            {formatBookingDate(booking.date)} · {booking.time}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "mono border px-2 py-1 text-[8px]",
                            STATUS_STYLES[booking.status] ??
                              "border-ink/15 text-ink-soft/50",
                          )}
                        >
                          {BOOKING_STATUS_LABELS[booking.status] ??
                            booking.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="border border-ink/10 bg-card p-5">
                <p className="mono text-[9px] tracking-[0.18em] text-gold">
                  PROFILE
                </p>
                <h3 className="mt-2 text-lg text-ink">بيانات الحساب</h3>
                <dl className="mt-4 space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft/40">الاسم</dt>
                    <dd className="text-ink">{user?.name || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft/40">البريد</dt>
                    <dd className="truncate text-ink" dir="ltr">
                      {user?.email || "زائر"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft/40">العضوية</dt>
                    <dd className="mono text-[9px] text-gold">ZOMA MEMBER</dd>
                  </div>
                </dl>
                <a
                  href={whatsappLink(
                    `مرحباً ${settings.storeName}، أريد تحديث بيانات حسابي.`,
                    settings.whatsapp,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-10 items-center justify-center gap-2 border border-ink/15 text-[10px] text-ink-soft/65 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <MessageCircle className="size-3.5" />
                  تحديث بياناتي عبر واتساب
                </a>
              </div>

              <div className="border border-ink/10 bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="mono text-[9px] tracking-[0.18em] text-gold">
                    COMMUNITY
                  </p>
                  <Link
                    to="/lookbook"
                    className="text-[9px] text-ink-soft/40 transition-colors hover:text-gold"
                  >
                    الكل
                  </Link>
                </div>
                <h3 className="mt-2 text-lg text-ink">مشاركاتك</h3>
                {posts.length === 0 ? (
                  <p className="mt-2 text-[10.5px] leading-6 text-ink-soft/45">
                    لم تشارك إطلالة بعد. صوّر قطعتك وارفع الصورة في المجتمع.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {posts.slice(0, 4).map((post) => (
                      <li
                        key={post._id}
                        className="flex items-center justify-between gap-2 border border-ink/10 px-2.5 py-2"
                      >
                        <span className="line-clamp-1 text-[10px] text-ink-soft/60">
                          {post.caption}
                        </span>
                        <span className="mono shrink-0 text-[8px] text-ink-soft/35">
                          {POST_STATUS_LABELS[post.status] ?? post.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border border-ink/10 bg-card p-5">
                <div className="flex items-center gap-2">
                  <Star className="size-3.5 text-gold" />
                  <p className="mono text-[9px] tracking-[0.18em] text-gold">
                    REVIEWS
                  </p>
                </div>
                <h3 className="mt-2 text-lg text-ink">تعليقاتك</h3>
                {reviews.length === 0 ? (
                  <p className="mt-2 text-[10.5px] leading-6 text-ink-soft/45">
                    لا توجد تعليقات. افتح صفحة أي قطعة وشارك تجربتك معها.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {reviews.slice(0, 4).map((review) => (
                      <li
                        key={review._id}
                        className="border border-ink/10 px-2.5 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                className={cn(
                                  "size-2.5",
                                  value <= review.rating
                                    ? "fill-gold text-gold"
                                    : "text-ink-soft/20",
                                )}
                              />
                            ))}
                          </span>
                          <span className="mono text-[8px] text-ink-soft/30">
                            {review.approved ? "منشور" : "قيد المراجعة"}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-ink-soft/55">
                          {review.text}
                        </p>
                        <p className="mono mt-1 text-[8px] text-ink-soft/25">
                          {formatDate(review.createdAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyState({
  icon: Icon,
  title,
  copy,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 border border-ink/10 bg-card px-4 py-6">
      <Icon className="size-5 text-ink-soft/25" />
      <div>
        <p className="text-[13px] text-ink">{title}</p>
        <p className="mt-1 max-w-sm text-[10.5px] leading-6 text-ink-soft/45">
          {copy}
        </p>
      </div>
      {action}
    </div>
  );
}
