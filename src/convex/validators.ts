import { v } from "convex/values";

export const categoryValidator = v.union(
  v.literal("suits"),
  v.literal("blazers"),
  v.literal("shirts"),
  v.literal("polos"),
  v.literal("trousers"),
  v.literal("shoes"),
  v.literal("accessories"),
);

export const kindValidator = v.union(
  v.literal("suit"),
  v.literal("blazer"),
  v.literal("shirt"),
  v.literal("polo"),
  v.literal("trousers"),
  v.literal("shoes"),
  v.literal("watch"),
  v.literal("tie"),
  v.literal("belt"),
);

export const badgeValidator = v.union(v.literal("new"), v.literal("hot"));

export const colorValidator = v.object({
  name: v.string(),
  hex: v.string(),
});

export const productInputValidator = v.object({
  name: v.string(),
  category: categoryValidator,
  kind: kindValidator,
  description: v.string(),
  fabric: v.string(),
  price: v.number(),
  discount: v.number(),
  sizes: v.array(v.string()),
  colors: v.array(colorValidator),
  tone: v.string(),
  badge: v.optional(badgeValidator),
  inStock: v.boolean(),
  keywords: v.array(v.string()),
});

export const orderStatusValidator = v.union(
  v.literal("new"),
  v.literal("confirmed"),
  v.literal("shipped"),
  v.literal("delivered"),
  v.literal("cancelled"),
);

export const bookingStatusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("completed"),
  v.literal("cancelled"),
);

export const postStatusValidator = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
);

export const paymentMethodValidator = v.object({
  id: v.string(),
  label: v.string(),
  note: v.string(),
  enabled: v.boolean(),
});

export const settingsInputValidator = v.object({
  storeName: v.string(),
  tagline: v.string(),
  announcement: v.array(v.string()),
  whatsapp: v.string(),
  phoneDisplay: v.string(),
  email: v.string(),
  city: v.string(),
  paymentMethods: v.array(paymentMethodValidator),
  footerCredit: v.string(),
  footerCreditUrl: v.string(),
});
