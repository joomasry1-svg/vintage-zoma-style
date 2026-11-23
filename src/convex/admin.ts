import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import {
  bookingStatusValidator,
  categoryInputValidator,
  orderStatusValidator,
  postStatusValidator,
  productInputValidator,
  settingsInputValidator,
} from "./validators";

const SESSION_DAYS = 7;

function createToken() {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random().toString(36).slice(2)}`;
}

async function assertAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("انتهت جلسة الإدارة. سجّل الدخول من جديد.");
  }
  return session;
}

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (!settings) {
      throw new Error("المتجر لم يُهيَّأ بعد. أعد تحميل الصفحة الرئيسية أولاً.");
    }

    const email = args.email.trim().toLowerCase();
    if (
      email !== settings.adminEmail.toLowerCase() ||
      args.password !== settings.adminPassword
    ) {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }

    const now = Date.now();
    const token = createToken();
    await ctx.db.insert("adminSessions", {
      token,
      createdAt: now,
      expiresAt: now + SESSION_DAYS * 24 * 60 * 60 * 1000,
    });

    return { token, email: settings.adminEmail };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});

export const dashboard = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    if (!settings) throw new Error("بيانات المتجر غير موجودة.");

    const [products, categories, orders, bookings, reviews, posts] =
      await Promise.all([
        ctx.db.query("products").withIndex("by_position").collect(),
        ctx.db.query("categories").withIndex("by_position").collect(),
        ctx.db
          .query("orders")
          .withIndex("by_created")
          .order("desc")
          .take(120),
        ctx.db.query("bookings").order("desc").take(120),
        ctx.db.query("reviews").order("desc").take(160),
        ctx.db.query("posts").order("desc").take(120),
      ]);

    const postsWithImages = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        imageUrl: post.imageId
          ? await ctx.storage.getUrl(post.imageId)
          : post.imageUrl,
      })),
    );

    const activeOrders = orders.filter((order) => order.status !== "cancelled");

    return {
      settings: {
        storeName: settings.storeName,
        tagline: settings.tagline,
        announcement: settings.announcement,
        whatsapp: settings.whatsapp,
        phoneDisplay: settings.phoneDisplay,
        email: settings.email,
        city: settings.city,
        paymentMethods: settings.paymentMethods,
        footerCredit: settings.footerCredit,
        footerCreditUrl: settings.footerCreditUrl,
        logoUrl: settings.logoUrl ?? "",
        heroSlides: settings.heroSlides ?? [],
        banner: settings.banner ?? null,
        adminEmail: settings.adminEmail,
        updatedAt: settings.updatedAt,
      },
      products,
      categories,
      orders,
      bookings,
      reviews,
      posts: postsWithImages,
      stats: {
        orders: orders.length,
        revenue: activeOrders.reduce((sum, order) => sum + order.total, 0),
        newOrders: orders.filter((order) => order.status === "new").length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        pendingReviews: reviews.filter((r) => !r.approved).length,
        pendingPosts: posts.filter((p) => p.status === "pending").length,
      },
    };
  },
});

export const updateOrderStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("orders"),
    status: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});

export const updateBookingStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("bookings"),
    status: bookingStatusValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});

export const deleteOrder = mutation({
  args: { token: v.string(), id: v.id("orders") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const deleteBooking = mutation({
  args: { token: v.string(), id: v.id("bookings") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const moderatePost = mutation({
  args: {
    token: v.string(),
    id: v.id("posts"),
    status: postStatusValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});

export const deletePost = mutation({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const post = await ctx.db.get(args.id);
    if (!post) return { ok: true };
    if (post.imageId) {
      await ctx.storage.delete(post.imageId);
    }
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const moderateReview = mutation({
  args: {
    token: v.string(),
    id: v.id("reviews"),
    approved: v.boolean(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.patch(args.id, { approved: args.approved });
    return { ok: true };
  },
});

export const deleteReview = mutation({
  args: { token: v.string(), id: v.id("reviews") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const saveProduct = mutation({
  args: {
    token: v.string(),
    id: v.optional(v.id("products")),
    product: productInputValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    const sizes = args.product.sizes
      .map((size) => size.trim())
      .filter(Boolean);
    const product = {
      ...args.product,
      price: Math.max(1, Math.round(args.product.price)),
      discount: Math.min(95, Math.max(0, Math.round(args.product.discount))),
      sizes,
      colors: args.product.colors
        .map((color) => ({ ...color, name: color.name.trim() }))
        .filter((color) => color.name),
      keywords: args.product.keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      gallery: (args.product.gallery ?? [])
        .map((image) => image.trim())
        .filter(Boolean)
        .slice(0, 8),
      videoPlaybackId: args.product.videoPlaybackId?.trim() || undefined,
      videoAssetId: args.product.videoAssetId?.trim() || undefined,
      videoAspectRatio: args.product.videoAspectRatio?.trim() || undefined,
      sizeOverrides: (args.product.sizeOverrides ?? [])
        .filter((entry) => sizes.includes(entry.size))
        .map((entry) => ({
          size: entry.size,
          values: Object.fromEntries(
            Object.entries(entry.values)
              .map(([key, value]) => [key, value.trim()] as const)
              .filter(([, value]) => Boolean(value)),
          ),
        }))
        .filter((entry) => Object.keys(entry.values).length > 0),
    };

    if (product.sizes.length === 0) {
      throw new Error("أضف مقاساً واحداً على الأقل.");
    }
    if (product.colors.length === 0) {
      throw new Error("أضف لوناً واحداً على الأقل.");
    }

    if (args.id) {
      await ctx.db.patch(args.id, product);
      return args.id;
    }

    const last = await ctx.db
      .query("products")
      .withIndex("by_position")
      .order("desc")
      .first();

    return await ctx.db.insert("products", {
      ...product,
      slug: `p-${Date.now().toString(36)}`,
      position: (last?.position ?? 0) + 1,
    });
  },
});

export const setProductOwnerNote = mutation({
  args: {
    token: v.string(),
    slug: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!product) throw new Error("المنتج غير موجود.");

    const note = args.note.trim().slice(0, 600);
    await ctx.db.patch(product._id, {
      ownerNote: note || undefined,
    });
    return { ok: true, note };
  },
});

export const deleteProduct = mutation({
  args: { token: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const updateSettings = mutation({
  args: {
    token: v.string(),
    settings: settingsInputValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    if (!settings) throw new Error("بيانات المتجر غير موجودة.");

    if (!/^\d{8,15}$/.test(args.settings.whatsapp.replace(/[^\d]/g, ""))) {
      throw new Error("رقم واتساب غير صالح. استخدم رمز الدولة بدون +.");
    }

    await ctx.db.patch(settings._id, {
      ...args.settings,
      announcement: args.settings.announcement
        .map((line) => line.trim())
        .filter(Boolean),
      logoUrl: args.settings.logoUrl?.trim() ?? "",
      heroSlides: args.settings.heroSlides
        ?.map((slide) => ({
          ...slide,
          imageUrl: slide.imageUrl.trim(),
          videoUrl: slide.videoUrl?.trim() || undefined,
          title: slide.title.trim(),
          subtitle: slide.subtitle.trim(),
          kicker: slide.kicker.trim(),
          productId: slide.productId?.trim() || undefined,
        }))
        .filter((slide) => slide.imageUrl),
      banner: args.settings.banner
        ? {
            ...args.settings.banner,
            eyebrow: args.settings.banner.eyebrow.trim(),
            title: args.settings.banner.title.trim(),
            subtitle: args.settings.banner.subtitle.trim(),
            imageUrl: args.settings.banner.imageUrl.trim(),
            ctaLabel: args.settings.banner.ctaLabel.trim(),
            ctaHref: args.settings.banner.ctaHref.trim() || "/#catalog",
          }
        : undefined,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

/* ------------------------------- Categories -------------------------------- */

export const saveCategory = mutation({
  args: {
    token: v.string(),
    id: v.optional(v.id("categories")),
    category: categoryInputValidator,
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    const label = args.category.label.trim();
    const note = args.category.note.trim();
    const imageUrl = args.category.imageUrl?.trim();
    if (label.length < 2) throw new Error("اكتب اسماً واضحاً للقسم.");

    if (args.id) {
      await ctx.db.patch(args.id, { label, note, imageUrl });
      return args.id;
    }

    const last = await ctx.db
      .query("categories")
      .withIndex("by_position")
      .order("desc")
      .first();

    return await ctx.db.insert("categories", {
      slug: `c-${Date.now().toString(36)}`,
      label,
      note,
      imageUrl,
      position: (last?.position ?? 0) + 1,
    });
  },
});

export const deleteCategory = mutation({
  args: { token: v.string(), id: v.id("categories") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const category = await ctx.db.get(args.id);
    if (!category) return { ok: true };

    const usedBy = await ctx.db
      .query("products")
      .withIndex("by_position")
      .collect();
    const count = usedBy.filter((p) => p.category === category.slug).length;
    if (count > 0) {
      throw new Error(
        `لا يمكن حذف «${category.label}» قبل نقل ${count} منتج إلى قسم آخر.`,
      );
    }

    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

/* --------------------------------- Media ----------------------------------- */

export const verifyAdminToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    return Boolean(session && session.expiresAt > Date.now());
  },
});

export const generateMediaUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const mediaUrl = query({
  args: { token: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const updateCredentials = mutation({
  args: {
    token: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);
    const email = args.email.trim().toLowerCase();
    if (!email.includes("@") || email.length < 5) {
      throw new Error("اكتب بريداً إلكترونياً صالحاً.");
    }
    if (args.password.length < 8) {
      throw new Error("كلمة المرور يجب ألا تقل عن ٨ أحرف.");
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    if (!settings) throw new Error("بيانات المتجر غير موجودة.");

    await ctx.db.patch(settings._id, {
      adminEmail: email,
      adminPassword: args.password,
      updatedAt: Date.now(),
    });
    return { ok: true, email };
  },
});
