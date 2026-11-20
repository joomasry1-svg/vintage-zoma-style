import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  DEFAULT_BANNER,
  DEFAULT_HERO_SLIDES,
  type CategoryId,
  type GarmentKind,
  type HeroSlide,
  type PromoBanner,
} from "@/data/store";
import {
  BOOKING_STATUS_LABELS,
  formatDateTime,
  formatPrice,
  ORDER_STATUS_LABELS,
  POST_STATUS_LABELS,
} from "@/lib/store-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronDown,
  LayoutGrid,
  LogOut,
  ImagePlus,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Settings,
  Tag,
  Upload,
  ShoppingBag,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";

const TOKEN_KEY = "zoma-admin-token";

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: LayoutGrid },
  { id: "products", label: "المنتجات", icon: Package },
  { id: "categories", label: "الأقسام", icon: Tag },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "bookings", label: "المواعيد", icon: CalendarDays },
  { id: "community", label: "المجتمع", icon: Users },
  { id: "reviews", label: "التعليقات", icon: MessageSquare },
  { id: "settings", label: "الإعدادات", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

const KINDS: GarmentKind[] = [
  "coat",
  "jacket",
  "suit",
  "blazer",
  "shirt",
  "polo",
  "trousers",
  "shoes",
  "watch",
  "tie",
  "belt",
];

type AdminSettings = {
  storeName: string;
  tagline: string;
  announcement: string[];
  whatsapp: string;
  phoneDisplay: string;
  email: string;
  city: string;
  paymentMethods: {
    id: string;
    label: string;
    note: string;
    enabled: boolean;
  }[];
  footerCredit: string;
  footerCreditUrl: string;
  logoUrl: string;
  heroSlides: HeroSlide[];
  banner: PromoBanner | null;
  adminEmail: string;
  updatedAt: number;
};

type ProductDraft = {
  id?: Id<"products">;
  name: string;
  category: CategoryId;
  kind: GarmentKind;
  description: string;
  fabric: string;
  price: string;
  discount: string;
  sizes: string;
  colors: string;
  tone: string;
  badge: "" | "new" | "hot";
  inStock: boolean;
  keywords: string;
  imageUrl: string;
  secondImageUrl: string;
};

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  category: "suits",
  kind: "suit",
  description: "",
  fabric: "",
  price: "",
  discount: "0",
  sizes: "S, M, L, XL, XXL",
  colors: "أسود:#2b2723",
  tone: "#2b2723",
  badge: "",
  inStock: true,
  keywords: "",
  imageUrl: "",
  secondImageUrl: "",
};

export default function Admin() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(TOKEN_KEY),
  );
  const [tab, setTab] = useState<TabId>("overview");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = useMutation(api.admin.login);
  const logout = useMutation(api.admin.logout);
  const ensureSeed = useMutation(api.store.ensureSeed);
  const data = useQuery(
    api.admin.dashboard,
    token ? { token } : "skip",
  );

  useEffect(() => {
    // Make the admin login usable even if the storefront was never opened.
    ensureSeed().catch(() => undefined);
  }, [ensureSeed]);

  useEffect(() => {
    if (token && data === null) {
      window.localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setLoginError("انتهت جلسة الإدارة. سجّل الدخول مرة أخرى.");
    }
  }, [token, data]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const result = await login({
        email: loginEmail,
        password: loginPassword,
      });
      window.localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setLoginPassword("");
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "تعذّر تسجيل الدخول. تحقق من البيانات.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await logout({ token });
      } catch {
        // Session may already be expired; clearing the client token is enough.
      }
    }
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center canvas-dark px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex flex-col items-center leading-none">
            <span className="mono text-2xl tracking-[0.24em] text-ink">ZOMA</span>
            <span className="mono mt-1 text-[7px] tracking-[0.24em] text-ink-soft/40">
              STORE / CONTROL
            </span>
          </Link>

          <div className="mt-8 border border-ink/10 bg-card p-6 sm:p-8">
            <p className="mono text-[9px] tracking-[0.18em] text-gold">
              ADMIN ACCESS
            </p>
            <h1 className="mt-2 text-2xl text-ink">لوحة تحكم المتجر</h1>
            <p className="mt-1 text-[11px] leading-6 text-ink-soft/50">
              الدخول مخصص لإدارة Zoma store. كل التغييرات تظهر مباشرة في المتجر.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-1 block text-[10px] text-ink-soft/60">
                  البريد الإلكتروني
                </span>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="owner@zoma.store"
                  dir="ltr"
                  className="h-11 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] text-ink-soft/60">
                  كلمة المرور
                </span>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="h-11 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
                  required
                />
              </label>

              {loginError && (
                <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-[10px] text-destructive">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="flex h-11 w-full items-center justify-center bg-gold text-[11px] font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoggingIn ? "جارٍ التحقق…" : "دخول لوحة التحكم"}
              </button>
            </form>

            <Link
              to="/"
              className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-ink-soft/40 transition-colors hover:text-gold"
            >
              <ArrowUpLeft className="size-3" />
              العودة إلى المتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (data === undefined || data === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="mono animate-pulse text-[10px] tracking-[0.2em] text-ink-soft/40">
          LOADING CONTROL PANEL…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex flex-col leading-none">
            <span className="mono text-xl tracking-[0.22em] text-ink">ZOMA</span>
            <span className="mono mt-1 text-[6.5px] tracking-[0.2em] text-gold">
              CONTROL
            </span>
          </Link>
          <span className="h-6 w-px bg-ink/10" />
          <p className="hidden text-[11px] text-ink-soft/50 sm:block">
            لوحة تحكم {data.settings.storeName}
          </p>
          <div className="ms-auto flex items-center gap-2">
            <Link
              to="/"
              className="flex h-9 items-center gap-1.5 border border-ink/15 px-3 text-[10px] text-ink-soft/60 transition-colors hover:border-ink/35 hover:text-ink"
            >
              المتجر
              <ArrowUpLeft className="size-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-9 items-center gap-1.5 border border-ink/15 px-3 text-[10px] text-ink-soft/60 transition-colors hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="size-3" />
              خروج
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 hide-scrollbar sm:px-6 lg:px-8">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 px-3 py-2 text-[10.5px] transition-colors",
                tab === entry.id
                  ? "bg-gold text-espresso"
                  : "text-ink-soft/55 hover:bg-paper-deep hover:text-ink",
              )}
            >
              <entry.icon className="size-3.5" />
              {entry.label}
              {entry.id === "orders" && data.stats.newOrders > 0 && (
                <span className="mono bg-signal-orange px-1 text-[8px] text-espresso">
                  {data.stats.newOrders}
                </span>
              )}
              {((entry.id === "community" && data.stats.pendingPosts > 0) ||
                (entry.id === "reviews" && data.stats.pendingReviews > 0)) && (
                <span className="mono bg-signal-blue px-1 text-[8px] text-espresso">
                  {entry.id === "community"
                    ? data.stats.pendingPosts
                    : data.stats.pendingReviews}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "overview" && (
          <OverviewPanel
            stats={data.stats}
            orders={data.orders}
            bookings={data.bookings}
            onTab={setTab}
          />
        )}

        {tab === "products" && (
          <ProductsPanel
            token={token}
            products={data.products}
            categories={data.categories}
          />
        )}

        {tab === "categories" && (
          <CategoriesPanel
            token={token}
            categories={data.categories}
            products={data.products}
          />
        )}

        {tab === "orders" && <OrdersPanel token={token} orders={data.orders} />}

        {tab === "bookings" && (
          <BookingsPanel token={token} bookings={data.bookings} />
        )}

        {tab === "community" && (
          <CommunityPanel token={token} posts={data.posts} />
        )}

        {tab === "reviews" && (
          <ReviewsPanel
            token={token}
            reviews={data.reviews}
            products={data.products}
          />
        )}

        {tab === "settings" && (
          <SettingsPanel
            token={token}
            settings={data.settings}
            products={data.products}
          />
        )}
      </main>
    </div>
  );
}

/* ---------------------------------- Overview --------------------------------- */

function OverviewPanel({
  stats,
  orders,
  bookings,
  onTab,
}: {
  stats: {
    orders: number;
    revenue: number;
    newOrders: number;
    pendingBookings: number;
    pendingReviews: number;
    pendingPosts: number;
  };
  orders: Doc<"orders">[];
  bookings: Doc<"bookings">[];
  onTab: (tab: TabId) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono text-[9px] tracking-[0.18em] text-gold">
            OVERVIEW
          </p>
          <h1 className="mt-2 text-3xl">ملخص المتجر</h1>
        </div>
        <p className="mono text-[8px] text-ink-soft/30">
          LIVE DATA / CONVEX
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {[
          { label: "إجمالي الطلبات", value: String(stats.orders), note: "ORDER COUNT" },
          { label: "إيرادات غير ملغاة", value: formatPrice(stats.revenue), note: "REVENUE" },
          { label: "طلبات جديدة", value: String(stats.newOrders), note: "AWAITING ACTION" },
          { label: "مواعيد معلقة", value: String(stats.pendingBookings), note: "BOOKINGS" },
          { label: "مشاركات للمراجعة", value: String(stats.pendingPosts), note: "COMMUNITY" },
          { label: "تعليقات للمراجعة", value: String(stats.pendingReviews), note: "REVIEWS" },
        ].map((card) => (
          <div key={card.label} className="border border-ink/10 bg-card p-4">
            <p className="mono text-[8px] tracking-[0.12em] text-ink-soft/30">
              {card.note}
            </p>
            <p className="mono mt-2 truncate text-xl text-ink">{card.value}</p>
            <p className="mt-1 text-[10px] text-ink-soft/45">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "مراجعة الطلبات", tab: "orders" as TabId, note: `${stats.newOrders} جديد` },
          { label: "مراجعة المجتمع", tab: "community" as TabId, note: `${stats.pendingPosts} مشاركة` },
          { label: "إدارة المواعيد", tab: "bookings" as TabId, note: `${stats.pendingBookings} معلق` },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onTab(action.tab)}
            className="flex items-center justify-between border border-ink/10 bg-card px-4 py-3 text-start transition-colors hover:border-gold/40"
          >
            <span>
              <span className="block text-[11px] text-ink">{action.label}</span>
              <span className="mono mt-0.5 block text-[8px] text-ink-soft/30">
                {action.note}
              </span>
            </span>
            <ArrowUpLeft className="size-3.5 text-ink-soft/25" />
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="border border-ink/10 bg-card">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-[12px] text-ink">أحدث الطلبات</p>
            <button
              type="button"
              onClick={() => onTab("orders")}
              className="mono text-[8px] text-gold"
            >
              VIEW ALL
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="px-4 py-6 text-[10.5px] text-ink-soft/40">
              لا توجد طلبات بعد.
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order._id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="mono text-[10px] text-gold">{order.code}</p>
                    <p className="mt-0.5 truncate text-[10.5px] text-ink-soft/55">
                      {order.customerName} · {order.items.length} قطع
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <p className="mono text-[10px] text-ink">
                      {formatPrice(order.total)}
                    </p>
                    <p className="mono mt-0.5 text-[8px] text-ink-soft/30">
                      {ORDER_STATUS_LABELS[order.status]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-ink/10 bg-card">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-[12px] text-ink">أحدث المواعيد</p>
            <button
              type="button"
              onClick={() => onTab("bookings")}
              className="mono text-[8px] text-gold"
            >
              VIEW ALL
            </button>
          </div>
          {bookings.length === 0 ? (
            <p className="px-4 py-6 text-[10.5px] text-ink-soft/40">
              لا توجد مواعيد بعد.
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {bookings.slice(0, 5).map((booking) => (
                <li
                  key={booking._id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[10.5px] text-ink">
                      {booking.name}
                    </p>
                    <p className="mono mt-0.5 text-[8px] text-ink-soft/35">
                      {booking.date} · {booking.time}
                    </p>
                  </div>
                  <span className="mono shrink-0 border border-ink/15 px-1.5 py-0.5 text-[8px] text-ink-soft/50">
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Products -------------------------------- */

function ProductsPanel({
  token,
  products,
  categories,
}: {
  token: string;
  products: Doc<"products">[];
  categories: Doc<"categories">[];
}) {
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const saveProduct = useMutation(api.admin.saveProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (product: Doc<"products">) => {
    setDraft({
      id: product._id,
      name: product.name,
      category: product.category,
      kind: product.kind,
      description: product.description,
      fabric: product.fabric,
      price: String(product.price),
      discount: String(product.discount),
      sizes: product.sizes.join(", "),
      colors: product.colors
        .map((color) => `${color.name}:${color.hex}`)
        .join("\n"),
      tone: product.tone,
      badge: product.badge ?? "",
      inStock: product.inStock,
      keywords: product.keywords.join(", "),
      imageUrl: product.imageUrl ?? "",
      secondImageUrl: product.secondImageUrl ?? "",
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setIsSaving(true);
    try {
      const price = Number(draft.price);
      const discount = Number(draft.discount || 0);
      if (!draft.name.trim() || !Number.isFinite(price) || price <= 0) {
        throw new Error("اكتب اسماً وسعراً صحيحاً للمنتج.");
      }
      const colors = draft.colors
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, hex] = line.split(":");
          return { name: name.trim(), hex: (hex || draft.tone).trim() };
        })
        .filter((color) => color.name);

      await saveProduct({
        token,
        id: draft.id,
        product: {
          name: draft.name.trim(),
          category: draft.category,
          kind: draft.kind,
          description: draft.description.trim(),
          fabric: draft.fabric.trim(),
          price,
          discount,
          sizes: draft.sizes.split(/[,،\n]/).map((size) => size.trim()),
          colors,
          tone: draft.tone,
          badge: draft.badge || undefined,
          inStock: draft.inStock,
          keywords: draft.keywords.split(/[,،\n]/),
          imageUrl: draft.imageUrl.trim() || undefined,
          secondImageUrl: draft.secondImageUrl.trim() || undefined,
        },
      });
      toast.success(draft.id ? "تم تحديث المنتج" : "تمت إضافة المنتج");
      setDraft(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذّر حفظ المنتج.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Doc<"products">) => {
    if (!window.confirm(`حذف ${product.name} نهائياً من المتجر؟`)) return;
    try {
      await deleteProduct({ token, id: product._id });
      toast.success("تم حذف المنتج");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الحذف.");
    }
  };

  const draftPrice = Number(draft?.price ?? 0);
  const draftDiscount = Number(draft?.discount ?? 0);
  const draftFinal =
    Math.round((draftPrice * (1 - draftDiscount / 100)) / 5) * 5;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono text-[9px] tracking-[0.18em] text-gold">PRODUCTS</p>
          <h1 className="mt-2 text-3xl">المنتجات</h1>
        </div>
        <button
          type="button"
          onClick={() =>
            setDraft({
              ...EMPTY_DRAFT,
              category: categories[0]?.slug ?? "outerwear",
            })
          }
          className="flex h-10 items-center gap-2 bg-gold px-4 text-[10.5px] font-semibold text-espresso"
        >
          <Plus className="size-3.5" />
          منتج جديد
        </button>
      </div>

      {draft && (
        <form
          onSubmit={handleSave}
          className="mt-5 border border-gold/30 bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <p className="mono text-[9px] tracking-[0.16em] text-gold">
              {draft.id ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </p>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="p-1 text-ink-soft/40 hover:text-ink"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="اسم المنتج">
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                placeholder='بدلة "سافيلي" الصوفية'
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="القسم">
                <SelectInput
                  value={draft.category}
                  onChange={(value) =>
                    setDraft({ ...draft, category: value as CategoryId })
                  }
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="نوع القطعة">
                <SelectInput
                  value={draft.kind}
                  onChange={(value) =>
                    setDraft({ ...draft, kind: value as GarmentKind })
                  }
                >
                  {KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ImageUpload
              token={token}
              value={draft.imageUrl}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
              label="الصورة الأساسية للمنتج"
            />
            <ImageUpload
              token={token}
              value={draft.secondImageUrl}
              onChange={(secondImageUrl) =>
                setDraft({ ...draft, secondImageUrl })
              }
              label="زاوية ثانية (تظهر عند المرور)"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Field label="السعر قبل الخصم">
              <Input
                type="number"
                min={1}
                value={draft.price}
                onChange={(event) =>
                  setDraft({ ...draft, price: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
                required
              />
            </Field>
            <Field label="نسبة الخصم %">
              <Input
                type="number"
                min={0}
                max={95}
                value={draft.discount}
                onChange={(event) =>
                  setDraft({ ...draft, discount: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
            <div className="sm:col-span-2">
              <span className="mb-1 block text-[10px] text-ink-soft/60">
                السعر النهائي (تلقائي)
              </span>
              <div className="flex h-10 items-center justify-between border border-gold/30 bg-gold/5 px-3">
                <span className="mono text-[12px] text-gold">
                  {formatPrice(Number.isFinite(draftFinal) ? draftFinal : 0)}
                </span>
                <span className="mono text-[8px] text-ink-soft/35">
                  {draftDiscount > 0
                    ? `-${draftDiscount}% · بدلاً من ${formatPrice(draftPrice)}`
                    : "بدون خصم"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="المقاسات (مفصولة بفاصلة)">
              <Input
                value={draft.sizes}
                onChange={(event) =>
                  setDraft({ ...draft, sizes: event.target.value })
                }
                placeholder="S, M, L, XL"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
            <Field label="الكلمات البحثية (مفصولة بفاصلة)">
              <Input
                value={draft.keywords}
                onChange={(event) =>
                  setDraft({ ...draft, keywords: event.target.value })
                }
                placeholder="بدلة, زفاف, كحلي"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="الألوان — كل لون في سطر: الاسم:#اللون">
              <Textarea
                value={draft.colors}
                onChange={(event) =>
                  setDraft({ ...draft, colors: event.target.value })
                }
                rows={3}
                className="resize-none rounded-none border-ink/15 bg-paper-deep font-mono text-[11px]"
                dir="ltr"
              />
            </Field>
            <Field label="لون القطعة">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.tone}
                  onChange={(event) =>
                    setDraft({ ...draft, tone: event.target.value })
                  }
                  className="h-10 w-12 cursor-pointer border border-ink/15 bg-paper-deep p-1"
                  aria-label="لون القطعة"
                />
                <Input
                  value={draft.tone}
                  onChange={(event) =>
                    setDraft({ ...draft, tone: event.target.value })
                  }
                  className="h-10 w-24 rounded-none border-ink/15 bg-paper-deep font-mono text-[11px]"
                  dir="ltr"
                />
              </div>
            </Field>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="الوصف بالعربية">
              <Textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                rows={3}
                className="resize-none rounded-none border-ink/15 bg-paper-deep text-[12px]"
              />
            </Field>
            <Field label="القماش والتفاصيل">
              <Textarea
                value={draft.fabric}
                onChange={(event) =>
                  setDraft({ ...draft, fabric: event.target.value })
                }
                rows={3}
                className="resize-none rounded-none border-ink/15 bg-paper-deep text-[12px]"
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-[10.5px] text-ink-soft/65">
              <input
                type="checkbox"
                checked={draft.inStock}
                onChange={(event) =>
                  setDraft({ ...draft, inStock: event.target.checked })
                }
                className="size-3.5 accent-[#c5a059]"
              />
              متوفر في المخزون
            </label>
            <label className="flex items-center gap-2 text-[10.5px] text-ink-soft/65">
              شارة:
              <SelectInput
                value={draft.badge}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    badge: value as ProductDraft["badge"],
                  })
                }
                className="w-32"
              >
                <option value="">بدون</option>
                <option value="new">جديد</option>
                <option value="hot">الأكثر طلباً</option>
              </SelectInput>
            </label>
            <div className="ms-auto flex gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="h-10 border border-ink/15 px-4 text-[10px] text-ink-soft/60 transition-colors hover:border-ink/40 hover:text-ink"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="h-10 bg-gold px-5 text-[10.5px] font-semibold text-espresso disabled:opacity-50"
              >
                {isSaving ? "جارٍ الحفظ…" : "حفظ المنتج"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-2">
        {products.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-4 py-8 text-center text-[11px] text-ink-soft/40">
            لا توجد منتجات. أضف أول منتج ليظهر في الكتالوج.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex flex-wrap items-center gap-3 border border-ink/10 bg-card p-3"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt=""
                  className="size-11 shrink-0 border border-ink/10 object-cover"
                />
              ) : (
                <div
                  className="size-11 shrink-0 border border-ink/10"
                  style={{ backgroundColor: product.tone }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] text-ink">{product.name}</p>
                <p className="mono mt-0.5 text-[8px] text-ink-soft/35">
                  {categories.find((entry) => entry.slug === product.category)
                    ?.label ?? product.category}{" "}
                  / {product.kind.toUpperCase()} · {product.sizes.length} SIZES ·{" "}
                  {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                </p>
              </div>
              <div className="text-end">
                <p className="mono text-[11px] text-ink">
                  {formatPrice(
                    Math.round(
                      (product.price * (1 - product.discount / 100)) / 5,
                    ) * 5,
                  )}
                </p>
                {product.discount > 0 && (
                  <p className="mono text-[8px] text-signal-orange">
                    -{product.discount}%
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="flex size-8 items-center justify-center border border-ink/15 text-ink-soft/60 transition-colors hover:border-gold hover:text-gold"
                  aria-label={`تعديل ${product.name}`}
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="flex size-8 items-center justify-center border border-ink/15 text-ink-soft/50 transition-colors hover:border-destructive/50 hover:text-destructive"
                  aria-label={`حذف ${product.name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Categories -------------------------------- */

type CategoryDraft = {
  id?: Id<"categories">;
  label: string;
  note: string;
  imageUrl: string;
};

function CategoriesPanel({
  token,
  categories,
  products,
}: {
  token: string;
  categories: Doc<"categories">[];
  products: Doc<"products">[];
}) {
  const saveCategory = useMutation(api.admin.saveCategory);
  const removeCategory = useMutation(api.admin.deleteCategory);
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setIsSaving(true);
    try {
      await saveCategory({
        token,
        id: draft.id,
        category: {
          label: draft.label.trim(),
          note: draft.note.trim(),
          imageUrl: draft.imageUrl.trim() || undefined,
        },
      });
      toast.success(draft.id ? "تم تحديث القسم" : "تمت إضافة القسم");
      setDraft(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذّر حفظ القسم.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Doc<"categories">) => {
    if (!window.confirm(`حذف قسم «${category.label}» نهائياً؟`)) return;
    try {
      await removeCategory({ token, id: category._id });
      toast.success("تم حذف القسم");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذّر حذف القسم.",
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono text-[9px] tracking-[0.18em] text-gold">
            SECTIONS
          </p>
          <h1 className="mt-2 text-3xl">الأقسام والمجموعات</h1>
          <p className="mt-1 text-[11px] text-ink-soft/45">
            أي قسم تضيفه هنا يظهر فوراً في الصفحة الرئيسية والكتالوج والتذييل.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setDraft({ label: "", note: "", imageUrl: "" })
          }
          className="flex h-10 items-center gap-2 bg-gold px-4 text-[10.5px] font-semibold text-espresso"
        >
          <Plus className="size-3.5" />
          قسم جديد
        </button>
      </div>

      {draft && (
        <form
          onSubmit={handleSave}
          className="mt-5 border border-gold/30 bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <p className="mono text-[9px] tracking-[0.16em] text-gold">
              {draft.id ? "EDIT SECTION" : "NEW SECTION"}
            </p>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="p-1 text-ink-soft/40 hover:text-ink"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="اسم القسم — مثال: عبايات نسائية">
              <Input
                value={draft.label}
                onChange={(event) =>
                  setDraft({ ...draft, label: event.target.value })
                }
                placeholder="عبايات نسائية"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
                required
              />
            </Field>
            <Field label="وصف قصير يظهر تحت الاسم">
              <Input
                value={draft.note}
                onChange={(event) =>
                  setDraft({ ...draft, note: event.target.value })
                }
                placeholder="قصّات خفيفة تتحرك معك"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
          </div>

          <div className="mt-3">
            <ImageUpload
              token={token}
              value={draft.imageUrl}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
              label="صورة غلاف القسم"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="h-10 border border-ink/15 px-4 text-[10px] text-ink-soft/60 transition-colors hover:border-ink/40 hover:text-ink"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 bg-gold px-5 text-[10.5px] font-semibold text-espresso disabled:opacity-50"
            >
              {isSaving ? "جارٍ الحفظ…" : "حفظ القسم"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = products.filter(
            (product) => product.category === category.slug,
          ).length;
          return (
            <div
              key={category._id}
              className="group overflow-hidden border border-ink/10 bg-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-paper-deep">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Tag className="size-6 text-ink-soft/25" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                  <div>
                    <p className="text-[13px] font-medium text-white">
                      {category.label}
                    </p>
                    <p className="mono text-[7.5px] text-white/40">
                      {category.slug.toUpperCase()} · {count} PIECES
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          id: category._id,
                          label: category.label,
                          note: category.note,
                          imageUrl: category.imageUrl ?? "",
                        })
                      }
                      className="flex size-7 items-center justify-center border border-white/20 bg-black/30 text-white/70 backdrop-blur transition-colors hover:border-gold hover:text-gold"
                      aria-label={`تعديل ${category.label}`}
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="flex size-7 items-center justify-center border border-white/20 bg-black/30 text-white/60 backdrop-blur transition-colors hover:border-destructive/60 hover:text-destructive"
                      aria-label={`حذف ${category.label}`}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="line-clamp-2 px-3 py-2 text-[10px] leading-5 text-ink-soft/45">
                {category.note || "بدون وصف"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------- Orders --------------------------------- */

function OrdersPanel({
  token,
  orders,
}: {
  token: string;
  orders: Doc<"orders">[];
}) {
  const updateOrderStatus = useMutation(api.admin.updateOrderStatus);
  const deleteOrder = useMutation(api.admin.deleteOrder);

  const changeStatus = async (
    id: Id<"orders">,
    status: Doc<"orders">["status"],
  ) => {
    try {
      await updateOrderStatus({ token, id, status });
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر التحديث.");
    }
  };

  const removeOrder = async (id: Id<"orders">) => {
    if (!window.confirm("حذف هذا الطلب نهائياً؟")) return;
    try {
      await deleteOrder({ token, id });
      toast.success("تم حذف الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الحذف.");
    }
  };

  return (
    <div>
      <p className="mono text-[9px] tracking-[0.18em] text-gold">ORDERS</p>
      <h1 className="mt-2 text-3xl">الطلبات</h1>
      <p className="mt-1 text-[11px] text-ink-soft/45">
        الطلبات المحفوظة من إتمام الشراء عبر واتساب. حدّث الحالة ليتابعها العميل
        من حسابه.
      </p>

      <div className="mt-5 space-y-3">
        {orders.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-4 py-10 text-center text-[11px] text-ink-soft/40">
            لا توجد طلبات بعد.
          </p>
        ) : (
          orders.map((order) => (
            <article key={order._id} className="border border-ink/10 bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-[11px] text-gold">{order.code}</span>
                  <span className="mono text-[8px] text-ink-soft/30">
                    {formatDateTime(order.createdAt)}
                  </span>
                  <span className="mono text-[8px] text-ink-soft/40">
                    {order.payment}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        changeStatus(
                          order._id,
                          event.target.value as Doc<"orders">["status"],
                        )
                      }
                      className="h-8 appearance-none border border-ink/15 bg-paper-deep ps-2 pe-7 text-[10px] text-ink outline-none focus:border-gold"
                    >
                      {Object.entries(ORDER_STATUS_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown className="pointer-events-none absolute end-1.5 top-1/2 size-3 -translate-y-1/2 text-ink-soft/40" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOrder(order._id)}
                    aria-label={`حذف الطلب ${order.code}`}
                    className="flex size-8 items-center justify-center border border-ink/15 text-ink-soft/35 transition-colors hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 px-4 py-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[11px] font-medium text-ink">
                    {order.customerName}
                    <span className="mono ms-2 text-[9px] text-ink-soft/40" dir="ltr">
                      {order.phone}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[10px] leading-5 text-ink-soft/45">
                    {order.address}
                    {order.notes ? ` — ${order.notes}` : ""}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {order.items.map((item, index) => (
                      <li
                        key={`${order._id}-${index}`}
                        className="text-[10px] text-ink-soft/60"
                      >
                        {item.name}
                        <span className="mono text-[8px] text-ink-soft/30">
                          {" "}
                          / {item.size} · {item.color} × {item.qty} —{" "}
                          {formatPrice(item.unitPrice * item.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mono self-start text-[13px] text-ink">
                  {formatPrice(order.total)}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Bookings -------------------------------- */

function BookingsPanel({
  token,
  bookings,
}: {
  token: string;
  bookings: Doc<"bookings">[];
}) {
  const updateBookingStatus = useMutation(api.admin.updateBookingStatus);
  const deleteBooking = useMutation(api.admin.deleteBooking);

  const changeStatus = async (
    id: Id<"bookings">,
    status: Doc<"bookings">["status"],
  ) => {
    try {
      await updateBookingStatus({ token, id, status });
      toast.success("تم تحديث حالة الموعد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر التحديث.");
    }
  };

  const removeBooking = async (id: Id<"bookings">) => {
    if (!window.confirm("حذف هذا الموعد نهائياً؟")) return;
    try {
      await deleteBooking({ token, id });
      toast.success("تم حذف الموعد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الحذف.");
    }
  };

  return (
    <div>
      <p className="mono text-[9px] tracking-[0.18em] text-gold">FITTINGS</p>
      <h1 className="mt-2 text-3xl">مواعيد القياس</h1>
      <p className="mt-1 text-[11px] text-ink-soft/45">
        الحجوزات القادمة من صفحة المواعيد. أكّد الموعد أو ألغِه ليتحدّث في حساب
        العميل.
      </p>

      <div className="mt-5 space-y-3">
        {bookings.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-4 py-10 text-center text-[11px] text-ink-soft/40">
            لا توجد مواعيد بعد.
          </p>
        ) : (
          bookings.map((booking) => (
            <article
              key={booking._id}
              className="grid gap-3 border border-ink/10 bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[12px] font-medium text-ink">
                    {booking.name}
                  </p>
                  <span className="mono text-[9px] text-ink-soft/40" dir="ltr">
                    {booking.phone}
                  </span>
                  <span className="mono border border-ink/15 px-1.5 py-0.5 text-[8px] text-ink-soft/45">
                    {booking.service}
                  </span>
                </div>
                <p className="mono mt-1.5 text-[9px] text-gold">
                  {booking.date} · {booking.time}
                </p>
                {booking.notes && (
                  <p className="mt-1 text-[10px] text-ink-soft/45">
                    {booking.notes}
                  </p>
                )}
                <p className="mono mt-1 text-[8px] text-ink-soft/25">
                  BOOKED {formatDateTime(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <select
                    value={booking.status}
                    onChange={(event) =>
                      changeStatus(
                        booking._id,
                        event.target.value as Doc<"bookings">["status"],
                      )
                    }
                    className="h-8 w-40 appearance-none border border-ink/15 bg-paper-deep ps-2 pe-7 text-[10px] text-ink outline-none focus:border-gold"
                  >
                    {Object.entries(BOOKING_STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-1.5 top-1/2 size-3 -translate-y-1/2 text-ink-soft/40" />
                </div>
                <button
                  type="button"
                  onClick={() => removeBooking(booking._id)}
                  aria-label={`حذف موعد ${booking.name}`}
                  className="flex size-8 items-center justify-center border border-ink/15 text-ink-soft/35 transition-colors hover:border-destructive/40 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Community -------------------------------- */

function CommunityPanel({
  token,
  posts,
}: {
  token: string;
  posts: (Omit<Doc<"posts">, "imageUrl"> & { imageUrl?: string | null })[];
}) {
  const moderatePost = useMutation(api.admin.moderatePost);
  const deletePost = useMutation(api.admin.deletePost);

  const moderate = async (
    id: Id<"posts">,
    status: Doc<"posts">["status"],
  ) => {
    try {
      await moderatePost({ token, id, status });
      toast.success("تم تحديث المشاركة");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر التحديث.");
    }
  };

  const remove = async (id: Id<"posts">) => {
    if (!window.confirm("حذف هذه المشاركة نهائياً؟")) return;
    try {
      await deletePost({ token, id });
      toast.success("تم حذف المشاركة");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الحذف.");
    }
  };

  return (
    <div>
      <p className="mono text-[9px] tracking-[0.18em] text-gold">COMMUNITY</p>
      <h1 className="mt-2 text-3xl">مشاركات المجتمع</h1>
      <p className="mt-1 text-[11px] text-ink-soft/45">
        راجع الصور والنصوص قبل نشرها في صفحة المجتمع.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-4 py-10 text-center text-[11px] text-ink-soft/40 sm:col-span-2 lg:col-span-3">
            لا توجد مشاركات بعد.
          </p>
        ) : (
          posts.map((post) => (
            <article key={post._id} className="border border-ink/10 bg-card p-2">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center border border-ink/10 bg-paper px-4 text-center">
                  <p className="line-clamp-4 text-[11px] leading-6 text-ink-soft/60">
                    {post.caption}
                  </p>
                </div>
              )}
              <div className="px-1 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-ink">{post.authorName}</span>
                  <span
                    className={cn(
                      "mono border px-1.5 py-0.5 text-[8px]",
                      post.status === "approved"
                        ? "border-gold/40 text-gold"
                        : post.status === "rejected"
                          ? "border-destructive/40 text-destructive"
                          : "border-signal-orange/40 text-signal-orange",
                    )}
                  >
                    {POST_STATUS_LABELS[post.status]}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-ink-soft/45">
                  {post.caption}
                </p>
                <p className="mono mt-1 text-[8px] text-ink-soft/25">
                  {formatDateTime(post.createdAt)}
                </p>
                <div className="mt-2 flex items-center gap-1.5 border-t border-ink/10 pt-2">
                  {post.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => moderate(post._id, "approved")}
                      className="flex h-7 flex-1 items-center justify-center gap-1 bg-gold text-[9px] font-medium text-espresso"
                    >
                      <Check className="size-3" />
                      نشر
                    </button>
                  )}
                  {post.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => moderate(post._id, "rejected")}
                      className="flex h-7 flex-1 items-center justify-center gap-1 border border-ink/15 text-[9px] text-ink-soft/60 hover:border-destructive/40 hover:text-destructive"
                    >
                      <X className="size-3" />
                      رفض
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(post._id)}
                    aria-label="حذف المشاركة"
                    className="flex size-7 items-center justify-center border border-ink/15 text-ink-soft/40 hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Reviews --------------------------------- */

function ReviewsPanel({
  token,
  reviews,
  products,
}: {
  token: string;
  reviews: Doc<"reviews">[];
  products: Doc<"products">[];
}) {
  const moderateReview = useMutation(api.admin.moderateReview);
  const deleteReview = useMutation(api.admin.deleteReview);

  const toggle = async (id: Id<"reviews">, approved: boolean) => {
    try {
      await moderateReview({ token, id, approved });
      toast.success(approved ? "تم نشر التعليق" : "تم إخفاء التعليق");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر التحديث.");
    }
  };

  const remove = async (id: Id<"reviews">) => {
    if (!window.confirm("حذف هذا التعليق نهائياً؟")) return;
    try {
      await deleteReview({ token, id });
      toast.success("تم حذف التعليق");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الحذف.");
    }
  };

  return (
    <div>
      <p className="mono text-[9px] tracking-[0.18em] text-gold">REVIEWS</p>
      <h1 className="mt-2 text-3xl">التعليقات</h1>
      <p className="mt-1 text-[11px] text-ink-soft/45">
        تعليقات العملاء على صفحات المنتجات. انشرها أو أخفها للحفاظ على جودة
        المحتوى.
      </p>

      <div className="mt-5 space-y-2">
        {reviews.length === 0 ? (
          <p className="border border-dashed border-ink/15 px-4 py-10 text-center text-[11px] text-ink-soft/40">
            لا توجد تعليقات بعد.
          </p>
        ) : (
          reviews.map((review) => {
            const product = products.find(
              (item) => item.slug === review.productSlug,
            );
            return (
              <article
                key={review._id}
                className="border border-ink/10 bg-card px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium text-ink">
                      {review.authorName}
                    </span>
                    <span className="mono text-[8px] text-ink-soft/35">
                      {product?.name ?? review.productSlug}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={cn(
                            "size-2.5",
                            value <= review.rating
                              ? "fill-gold text-gold"
                              : "text-ink-soft/15",
                          )}
                        />
                      ))}
                    </span>
                  </div>
                  <span className="mono text-[8px] text-ink-soft/25">
                    {formatDateTime(review.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-6 text-ink-soft/60">
                  {review.text}
                </p>
                <div className="mt-2 flex items-center gap-2 border-t border-ink/10 pt-2">
                  <span
                    className={cn(
                      "mono text-[8px]",
                      review.approved ? "text-gold" : "text-signal-orange",
                    )}
                  >
                    {review.approved ? "منشور" : "قيد المراجعة"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(review._id, !review.approved)}
                    className="ms-auto h-7 border border-ink/15 px-3 text-[9px] text-ink-soft/60 transition-colors hover:border-gold hover:text-gold"
                  >
                    {review.approved ? "إخفاء" : "نشر"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(review._id)}
                    className="flex size-7 items-center justify-center border border-ink/15 text-ink-soft/40 hover:border-destructive/40 hover:text-destructive"
                    aria-label="حذف التعليق"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Settings -------------------------------- */

function SettingsPanel({
  token,
  settings,
  products,
}: {
  token: string;
  settings: AdminSettings;
  products: Doc<"products">[];
}) {
  const updateSettings = useMutation(api.admin.updateSettings);
  const updateCredentials = useMutation(api.admin.updateCredentials);

  const [form, setForm] = useState({
    storeName: settings.storeName,
    tagline: settings.tagline,
    announcement: settings.announcement.join("\n"),
    whatsapp: settings.whatsapp,
    phoneDisplay: settings.phoneDisplay,
    email: settings.email,
    city: settings.city,
    footerCredit: settings.footerCredit,
    footerCreditUrl: settings.footerCreditUrl,
    logoUrl: settings.logoUrl ?? "",
  });
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    settings.heroSlides.length > 0
      ? settings.heroSlides
      : DEFAULT_HERO_SLIDES,
  );
  const [banner, setBanner] = useState<PromoBanner>(
    settings.banner ?? DEFAULT_BANNER,
  );
  const [methods, setMethods] = useState(settings.paymentMethods);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [adminPassword, setAdminPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        token,
        settings: {
          ...form,
          announcement: form.announcement.split("\n"),
          paymentMethods: methods,
          heroSlides,
          banner,
        },
      });
      toast.success("تم تحديث إعدادات المتجر");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذّر حفظ الإعدادات.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingCredentials(true);
    try {
      await updateCredentials({
        token,
        email: adminEmail,
        password: adminPassword,
      });
      toast.success("تم تحديث بيانات دخول الإدارة");
      setAdminPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذّر تحديث البيانات.",
      );
    } finally {
      setIsSavingCredentials(false);
    }
  };

  return (
    <div>
      <p className="mono text-[9px] tracking-[0.18em] text-gold">SETTINGS</p>
      <h1 className="mt-2 text-3xl">إعدادات المتجر</h1>
      <p className="mt-1 text-[11px] text-ink-soft/45">
        كل ما تكتبه هنا يظهر فوراً في الواجهة والصفحات.
      </p>

      <form onSubmit={handleSave} className="mt-5 space-y-4">
        <div className="border border-ink/10 bg-card p-5">
          <p className="mono text-[9px] tracking-[0.16em] text-gold">
            BRAND / الهوية
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="اسم المتجر">
              <Input
                value={form.storeName}
                onChange={(event) =>
                  setForm({ ...form, storeName: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
            <Field label="الوصف المختصر">
              <Input
                value={form.tagline}
                onChange={(event) =>
                  setForm({ ...form, tagline: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="شريط الإعلانات المتحرك — سطر لكل رسالة">
              <Textarea
                value={form.announcement}
                onChange={(event) =>
                  setForm({ ...form, announcement: event.target.value })
                }
                rows={3}
                className="resize-none rounded-none border-ink/15 bg-paper-deep text-[12px]"
              />
            </Field>
            <ImageUpload
              token={token}
              value={form.logoUrl}
              onChange={(logoUrl) => setForm({ ...form, logoUrl })}
              label="شعار المتجر (يظهر في الهيدر والتذييل)"
            />
          </div>
        </div>

        <div className="border border-ink/10 bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="mono text-[9px] tracking-[0.16em] text-gold">
                HERO / الصفحة الرئيسية
              </p>
              <p className="mt-1 text-[10px] text-ink-soft/40">
                صور الكاروسيل ثلاثي الأبعاد. ارفع صورة، واكتب عنوانها، واختر
                المنتج المرتبط بها.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setHeroSlides([
                  ...heroSlides,
                  {
                    imageUrl: "",
                    kicker: `WINTER / ${String(heroSlides.length + 1).padStart(2, "0")}`,
                    title: "شريحة جديدة",
                    subtitle: "اكتب وصفاً قصيراً للقطعة.",
                    productId: products[0]?.slug,
                  },
                ])
              }
              className="flex h-8 items-center gap-1 border border-ink/15 px-2.5 text-[9px] text-ink-soft/60 transition-colors hover:border-gold hover:text-gold"
            >
              <Plus className="size-3" />
              إضافة شريحة
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {heroSlides.map((slide, index) => (
              <div
                key={`hero-slide-${index}`}
                className="border border-ink/10 bg-paper-deep/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[8px] tracking-[0.14em] text-gold">
                    SLIDE {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroSlides(
                        heroSlides.filter((_, i) => i !== index),
                      )
                    }
                    className="flex size-7 items-center justify-center border border-ink/15 text-ink-soft/40 transition-colors hover:border-destructive/40 hover:text-destructive"
                    aria-label={`حذف الشريحة ${index + 1}`}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ImageUpload
                    token={token}
                    value={slide.imageUrl}
                    onChange={(imageUrl) => {
                      const next = [...heroSlides];
                      next[index] = { ...slide, imageUrl };
                      setHeroSlides(next);
                    }}
                    label="صورة الشريحة"
                  />
                  <div className="grid gap-2">
                    <Field label="السطر الصغير / Kicker">
                      <Input
                        value={slide.kicker}
                        onChange={(event) => {
                          const next = [...heroSlides];
                          next[index] = {
                            ...slide,
                            kicker: event.target.value,
                          };
                          setHeroSlides(next);
                        }}
                        className="h-9 rounded-none border-ink/15 bg-card text-[11px]"
                        dir="ltr"
                      />
                    </Field>
                    <Field label="المنتج المرتبط">
                      <SelectInput
                        value={slide.productId ?? ""}
                        onChange={(productId) => {
                          const next = [...heroSlides];
                          next[index] = { ...slide, productId };
                          setHeroSlides(next);
                        }}
                        className="h-9 text-[11px]"
                      >
                        <option value="">بدون منتج</option>
                        {products.map((product) => (
                          <option key={product._id} value={product.slug}>
                            {product.name}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                  </div>
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Field label="رابط فيديو الشريحة (اختياري — MP4)">
                    <Input
                      value={slide.videoUrl ?? ""}
                      onChange={(event) => {
                        const next = [...heroSlides];
                        next[index] = {
                          ...slide,
                          videoUrl: event.target.value,
                        };
                        setHeroSlides(next);
                      }}
                      placeholder="https://…/look.mp4"
                      className="h-9 rounded-none border-ink/15 bg-card text-[10px]"
                      dir="ltr"
                    />
                  </Field>
                  <Field label="العنوان">
                    <Input
                      value={slide.title}
                      onChange={(event) => {
                        const next = [...heroSlides];
                        next[index] = { ...slide, title: event.target.value };
                        setHeroSlides(next);
                      }}
                      className="h-9 rounded-none border-ink/15 bg-card text-[11px]"
                    />
                  </Field>
                  <Field label="الوصف">
                    <Input
                      value={slide.subtitle}
                      onChange={(event) => {
                        const next = [...heroSlides];
                        next[index] = {
                          ...slide,
                          subtitle: event.target.value,
                        };
                        setHeroSlides(next);
                      }}
                      className="h-9 rounded-none border-ink/15 bg-card text-[11px]"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="mono text-[9px] tracking-[0.16em] text-gold">
                CAMPAIGN BANNER / البانر الإعلاني
              </p>
              <p className="mt-1 text-[10px] text-ink-soft/40">
                يظهر بين الأقسام والكتالوج. يمكنك تعطيله أو تغيير صورته ونصه.
              </p>
            </div>
            <label className="flex items-center gap-2 text-[10px] text-ink-soft/55">
              <input
                type="checkbox"
                checked={banner.enabled}
                onChange={(event) =>
                  setBanner({ ...banner, enabled: event.target.checked })
                }
                className="size-3.5 accent-[#c5a059]"
              />
              مفعّل
            </label>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ImageUpload
              token={token}
              value={banner.imageUrl}
              onChange={(imageUrl) => setBanner({ ...banner, imageUrl })}
              label="صورة البانر"
            />
            <div className="grid gap-2">
              <Field label="السطر العلوي / Eyebrow">
                <Input
                  value={banner.eyebrow}
                  onChange={(event) =>
                    setBanner({ ...banner, eyebrow: event.target.value })
                  }
                  className="h-9 rounded-none border-ink/15 bg-paper-deep text-[11px]"
                  dir="ltr"
                />
              </Field>
              <Field label="العنوان">
                <Input
                  value={banner.title}
                  onChange={(event) =>
                    setBanner({ ...banner, title: event.target.value })
                  }
                  className="h-9 rounded-none border-ink/15 bg-paper-deep text-[11px]"
                />
              </Field>
            </div>
          </div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <Field label="النص الفرعي">
              <Input
                value={banner.subtitle}
                onChange={(event) =>
                  setBanner({ ...banner, subtitle: event.target.value })
                }
                className="h-9 rounded-none border-ink/15 bg-paper-deep text-[11px]"
              />
            </Field>
            <Field label="نص الزر">
              <Input
                value={banner.ctaLabel}
                onChange={(event) =>
                  setBanner({ ...banner, ctaLabel: event.target.value })
                }
                className="h-9 rounded-none border-ink/15 bg-paper-deep text-[11px]"
              />
            </Field>
            <Field label="رابط الزر">
              <Input
                value={banner.ctaHref}
                onChange={(event) =>
                  setBanner({ ...banner, ctaHref: event.target.value })
                }
                className="h-9 rounded-none border-ink/15 bg-paper-deep text-start text-[11px]"
                dir="ltr"
              />
            </Field>
          </div>
        </div>

        <div className="border border-ink/10 bg-card p-5">
          <p className="mono text-[9px] tracking-[0.16em] text-gold">
            CONTACT / التواصل
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="رقم واتساب (بدون +)">
              <Input
                value={form.whatsapp}
                onChange={(event) =>
                  setForm({ ...form, whatsapp: event.target.value })
                }
                dir="ltr"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
              />
            </Field>
            <Field label="رقم الهاتف المعروض">
              <Input
                value={form.phoneDisplay}
                onChange={(event) =>
                  setForm({ ...form, phoneDisplay: event.target.value })
                }
                dir="ltr"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
              />
            </Field>
            <Field label="البريد الإلكتروني للعملاء">
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                dir="ltr"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
              />
            </Field>
            <Field label="المدينة">
              <Input
                value={form.city}
                onChange={(event) =>
                  setForm({ ...form, city: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
          </div>
        </div>

        <div className="border border-ink/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="mono text-[9px] tracking-[0.16em] text-gold">
              PAYMENTS / الدفع
            </p>
            <button
              type="button"
              onClick={() =>
                setMethods([
                  ...methods,
                  {
                    id: `method-${Date.now()}`,
                    label: "طريقة جديدة",
                    note: "اكتب تعليمات الدفع هنا.",
                    enabled: true,
                  },
                ])
              }
              className="flex h-7 items-center gap-1 border border-ink/15 px-2 text-[9px] text-ink-soft/60 transition-colors hover:border-gold hover:text-gold"
            >
              <Plus className="size-3" />
              إضافة
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {methods.map((method, index) => (
              <div
                key={method.id}
                className="grid gap-2 border border-ink/10 bg-paper-deep/50 p-3 sm:grid-cols-[auto_1fr_1.4fr_auto]"
              >
                <label className="flex items-center gap-2 text-[9px] text-ink-soft/55">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(event) => {
                      const next = [...methods];
                      next[index] = {
                        ...method,
                        enabled: event.target.checked,
                      };
                      setMethods(next);
                    }}
                    className="size-3.5 accent-[#c5a059]"
                  />
                  مفعّل
                </label>
                <Input
                  value={method.label}
                  onChange={(event) => {
                    const next = [...methods];
                    next[index] = { ...method, label: event.target.value };
                    setMethods(next);
                  }}
                  placeholder="اسم الطريقة"
                  className="h-9 rounded-none border-ink/15 bg-card text-[11px]"
                />
                <Input
                  value={method.note}
                  onChange={(event) => {
                    const next = [...methods];
                    next[index] = { ...method, note: event.target.value };
                    setMethods(next);
                  }}
                  placeholder="تعليمات الدفع"
                  className="h-9 rounded-none border-ink/15 bg-card text-[11px]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMethods(methods.filter((item) => item.id !== method.id))
                  }
                  className="flex size-9 items-center justify-center border border-ink/15 text-ink-soft/40 transition-colors hover:border-destructive/40 hover:text-destructive"
                  aria-label="حذف طريقة الدفع"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 bg-card p-5">
          <p className="mono text-[9px] tracking-[0.16em] text-gold">
            FOOTER / التذييل
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="نص حقوق التصميم (اتركه فارغاً لإخفائه)">
              <Input
                value={form.footerCredit}
                onChange={(event) =>
                  setForm({ ...form, footerCredit: event.target.value })
                }
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              />
            </Field>
            <Field label="رابط حقوق التصميم">
              <Input
                value={form.footerCreditUrl}
                onChange={(event) =>
                  setForm({ ...form, footerCreditUrl: event.target.value })
                }
                dir="ltr"
                className="h-10 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 bg-gold px-6 text-[10.5px] font-semibold text-espresso disabled:opacity-50"
          >
            {isSaving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handleCredentials}
        className="mt-6 border border-ink/10 bg-card p-5"
      >
        <p className="mono text-[9px] tracking-[0.16em] text-gold">
          ADMIN LOGIN / بيانات الإدارة
        </p>
        <h2 className="mt-2 text-lg text-ink">تغيير بيانات الدخول</h2>
        <p className="mt-1 text-[10px] text-ink-soft/40">
          كلمة المرور الجديدة يجب ألا تقل عن ٨ أحرف. ستبقى جلستك الحالية فعالة.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="البريد الإلكتروني للإدارة">
            <Input
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              dir="ltr"
              className="h-10 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
              required
            />
          </Field>
          <Field label="كلمة المرور الجديدة">
            <Input
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="٨ أحرف على الأقل"
              className="h-10 rounded-none border-ink/15 bg-paper-deep text-sm"
              required
            />
          </Field>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSavingCredentials}
            className="h-9 border border-gold/50 px-5 text-[10px] text-gold transition-colors hover:bg-gold hover:text-espresso disabled:opacity-50"
          >
            {isSavingCredentials ? "جارٍ التحديث…" : "تحديث بيانات الدخول"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------------- Inputs --------------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] text-ink-soft/55">{label}</span>
      {children}
    </label>
  );
}

function ImageUpload({
  token,
  value,
  onChange,
  label,
}: {
  token: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.admin.generateMediaUploadUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("اختر ملف صورة فقط.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("حجم الصورة أكبر من ٨ ميجابايت.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({ token });
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("تعذّر رفع الصورة.");
      const payload = (await response.json()) as { storageId?: string };
      if (!payload.storageId) throw new Error("لم يصل معرّف الصورة.");
      const url = await convex.query(api.admin.mediaUrl, {
        token,
        storageId: payload.storageId as Id<"_storage">,
      });
      if (!url) throw new Error("تعذّر تجهيز رابط الصورة.");
      onChange(url);
      toast.success("تم رفع الصورة");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "تعذّر رفع الصورة.",
      );
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] text-ink-soft/55">{label}</span>
      <div className="grid grid-cols-[88px_1fr] gap-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-ink/15 bg-paper-deep">
          {value ? (
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="size-5 text-ink-soft/25" />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://… أو ارفع صورة"
            className="h-9 min-w-0 rounded-none border-ink/15 bg-paper-deep text-[10px]"
            dir="ltr"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="flex h-8 items-center gap-1.5 border border-gold/40 px-3 text-[9px] text-gold transition-colors hover:bg-gold hover:text-espresso disabled:opacity-50"
            >
              <Upload className="size-3" />
              {isUploading ? "جارٍ الرفع…" : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[9px] text-ink-soft/35 transition-colors hover:text-destructive"
              >
                إزالة
              </button>
            )}
          </div>
          {error && (
            <p className="text-[9px] leading-4 text-destructive">{error}</p>
          )}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 w-full appearance-none border border-ink/15 bg-paper-deep ps-2.5 pe-7 text-[11px] text-ink outline-none focus:border-gold",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2 top-1/2 size-3 -translate-y-1/2 text-ink-soft/40" />
    </div>
  );
}
