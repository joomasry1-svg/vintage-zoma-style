import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import {
  bookingStatusValidator,
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

    const [products, orders, bookings, reviews, posts] = await Promise.all([
      ctx.db.query("products").withIndex("by_position").collect(),
      ctx.db.query("orders").withIndex("by_created").order("desc").take(120),
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
        adminEmail: settings.adminEmail,
        updatedAt: settings.updatedAt,
      },
      products,
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

    const product = {
      ...args.product,
      price: Math.max(1, Math.round(args.product.price)),
      discount: Math.min(95, Math.max(0, Math.round(args.product.discount))),
      sizes: args.product.sizes.map((size) => size.trim()).filter(Boolean),
      colors: args.product.colors
        .map((color) => ({ ...color, name: color.name.trim() }))
        .filter((color) => color.name),
      keywords: args.product.keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean),
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
      updatedAt: Date.now(),
    });
    return { ok: true };
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
