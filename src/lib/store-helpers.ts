import {
  CATEGORIES,
  type CategoryId,
  type Product,
} from "@/data/store";
import type { CartLine } from "@/hooks/use-cart";

export const SORT_OPTIONS = [
  { id: "featured", label: "مختارات المتجر" },
  { id: "discount", label: "أعلى خصم" },
  { id: "price-asc", label: "السعر: من الأقل" },
  { id: "price-desc", label: "السعر: من الأعلى" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export function priceOf(product: Product) {
  const raw = product.price * (1 - product.discount / 100);
  return Math.round(raw / 5) * 5;
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("en-US")} ج.م`;
}

export function categoryLabel(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? "";
}

const ARABIC_DIACRITICS = /[\u064B-\u0652\u0670\u0640]/g;

export function normalizeArabic(input: string) {
  return input
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchScore(product: Product, tokens: string[]) {
  const name = normalizeArabic(product.name);
  const keywords = normalizeArabic(product.keywords.join(" "));
  const category = normalizeArabic(categoryLabel(product.category));
  const description = normalizeArabic(product.description);
  const fabric = normalizeArabic(product.fabric);

  let score = 0;
  for (const token of tokens) {
    if (!token) continue;
    if (name.includes(token)) score += 6;
    if (keywords.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
    if (fabric.includes(token)) score += 2;
    if (description.includes(token)) score += 1;
    if (score === 0) return 0;
  }
  return score;
}

export function searchProducts(products: Product[], query: string) {
  const tokens = normalizeArabic(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  return products
    .map((product) => ({ product, score: searchScore(product, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}

export function filterProducts(
  products: Product[],
  options: {
    category?: CategoryId | "all";
    query?: string;
    sort?: SortId;
    maxPrice?: number;
  } = {},
) {
  const { category = "all", query = "", sort = "featured", maxPrice } = options;

  let result = products.filter((product) =>
    category === "all" ? true : product.category === category,
  );

  if (query.trim()) {
    const ranked = searchProducts(products, query);
    const order = new Map(ranked.map((product, index) => [product.id, index]));
    result = result
      .filter((product) => order.has(product.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    return result;
  }

  if (maxPrice) {
    result = result.filter((product) => priceOf(product) <= maxPrice);
  }

  switch (sort) {
    case "price-asc":
      return [...result].sort((a, b) => priceOf(a) - priceOf(b));
    case "price-desc":
      return [...result].sort((a, b) => priceOf(b) - priceOf(a));
    case "discount":
      return [...result].sort((a, b) => b.discount - a.discount);
    default:
      return [...result].sort((a, b) => {
        const weight = (product: Product) =>
          product.badge === "hot" ? 2 : product.badge === "new" ? 1 : 0;
        return weight(b) - weight(a);
      });
  }
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.qty, 0);
}

export function cartTotal(lines: CartLine[], products: Product[]) {
  return lines.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? total + priceOf(product) * line.qty : total;
  }, 0);
}

export function whatsappLink(message: string, phone: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "طلب جديد",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "بانتظار التأكيد",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const POST_STATUS_LABELS: Record<string, string> = {
  pending: "بانتظار المراجعة",
  approved: "منشور",
  rejected: "مرفوض",
};

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatBookingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parsed);
}

export type Customer = {
  name: string;
  phone: string;
  address: string;
  payment: string;
  notes: string;
};

export function buildOrderMessage({
  lines,
  products,
  customer,
  storeName,
  code,
}: {
  lines: CartLine[];
  products: Product[];
  customer: Customer;
  storeName: string;
  code?: string;
}) {
  const rows = lines.map((line, index) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return "";
    return `${index + 1}. ${product.name} | المقاس: ${line.size} | اللون: ${
      line.color
    } | الكمية: ${line.qty} | ${formatPrice(priceOf(product) * line.qty)}`;
  });

  const total = cartTotal(lines, products);

  return [
    `طلب جديد — ${storeName}`,
    code ? `رقم الطلب: ${code}` : "",
    "--------------------------------",
    ...rows.filter(Boolean),
    "--------------------------------",
    `عدد القطع: ${cartCount(lines)}`,
    `الإجمالي: ${formatPrice(total)}`,
    `طريقة الدفع: ${customer.payment}`,
    "--------------------------------",
    `الاسم: ${customer.name}`,
    `الهاتف: ${customer.phone}`,
    `العنوان: ${customer.address}`,
    customer.notes ? `ملاحظات: ${customer.notes}` : "",
    "",
    "أرجو تأكيد الطلب وميعاد التوصيل. شكراً لكم.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}
