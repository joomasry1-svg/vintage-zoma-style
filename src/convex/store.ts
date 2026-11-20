import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  CATEGORIES,
  DEFAULT_BANNER,
  DEFAULT_HERO_SLIDES,
  PRODUCTS,
  STORE,
} from "../../src/data/store";

const ADMIN_EMAIL = "ye360057@gmail.com";
const ADMIN_PASSWORD = "12345678910";

function orderCode() {
  return `ZM-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

/**
 * Idempotent bootstrap so the storefront and admin panel have a catalog,
 * settings and default admin credentials on first load.
 */
export const ensureSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (settings) {
      // One-time migration for stores created before the winter photo edit.
      // A version marker keeps deleted products/categories from coming back.
      if ((settings.seedVersion ?? 0) < 2) {
        await ctx.db.patch(settings._id, {
          logoUrl: settings.logoUrl ?? "",
          heroSlides: settings.heroSlides ?? DEFAULT_HERO_SLIDES,
          banner: settings.banner ?? DEFAULT_BANNER,
          seedVersion: 2,
          updatedAt: Date.now(),
        });

        const existingCategories = await ctx.db
          .query("categories")
          .withIndex("by_position")
          .first();
        if (!existingCategories) {
          let categoryPosition = 0;
          for (const category of CATEGORIES) {
            await ctx.db.insert("categories", {
              slug: category.id,
              label: category.label,
              note: category.note,
              imageUrl: category.imageUrl,
              position: categoryPosition,
            });
            categoryPosition += 1;
          }
        }

        const existingProducts = await ctx.db.query("products").collect();
        const bySlug = new Map(existingProducts.map((p) => [p.slug, p]));
        let lastPosition = existingProducts.reduce(
          (max, product) => Math.max(max, product.position),
          0,
        );

        for (const product of PRODUCTS) {
          const stored = bySlug.get(product.id);
          if (!stored) {
            lastPosition += 1;
            await ctx.db.insert("products", {
              slug: product.id,
              name: product.name,
              category: product.category,
              kind: product.kind,
              description: product.description,
              fabric: product.fabric,
              price: product.price,
              discount: product.discount,
              sizes: product.sizes,
              colors: product.colors,
              tone: product.tone,
              badge: product.badge,
              inStock: product.inStock,
              keywords: product.keywords,
              imageUrl: product.imageUrl,
              secondImageUrl: product.secondImageUrl,
              position: lastPosition,
            });
          } else if (!stored.imageUrl && product.imageUrl) {
            await ctx.db.patch(stored._id, {
              imageUrl: product.imageUrl,
              secondImageUrl: product.secondImageUrl,
            });
          }
        }
      }

      return { ok: true, seeded: false };
    }

    await ctx.db.insert("settings", {
      key: "main",
      storeName: STORE.name,
      tagline: STORE.tagline,
      announcement: STORE.announcement,
      whatsapp: STORE.whatsapp,
      phoneDisplay: STORE.phoneDisplay,
      email: STORE.email,
      city: STORE.city,
      paymentMethods: STORE.paymentMethods,
      footerCredit: STORE.footerCredit,
      footerCreditUrl: STORE.footerCreditUrl,
      logoUrl: "",
      heroSlides: DEFAULT_HERO_SLIDES,
      banner: DEFAULT_BANNER,
      adminEmail: ADMIN_EMAIL,
      adminPassword: ADMIN_PASSWORD,
      seedVersion: 2,
      updatedAt: Date.now(),
    });

    let categoryPosition = 0;
    for (const category of CATEGORIES) {
      await ctx.db.insert("categories", {
        slug: category.id,
        label: category.label,
        note: category.note,
        imageUrl: category.imageUrl,
        position: categoryPosition,
      });
      categoryPosition += 1;
    }

    let position = 0;
    for (const product of PRODUCTS) {
      await ctx.db.insert("products", {
        slug: product.id,
        name: product.name,
        category: product.category,
        kind: product.kind,
        description: product.description,
        fabric: product.fabric,
        price: product.price,
        discount: product.discount,
        sizes: product.sizes,
        colors: product.colors,
        tone: product.tone,
        badge: product.badge,
        inStock: product.inStock,
        keywords: product.keywords,
        imageUrl: product.imageUrl,
        secondImageUrl: product.secondImageUrl,
        position,
      });
      position += 1;
    }

    return { ok: true, seeded: true };
  },
});

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("categories")
      .withIndex("by_position")
      .collect();

    // Before the very first seed, show the launch menu so the site is usable.
    if (rows.length === 0) {
      return CATEGORIES.map((category, position) => ({
        _id: `seed-${category.id}`,
        slug: category.id,
        label: category.label,
        note: category.note,
        imageUrl: category.imageUrl,
        position,
      }));
    }

    return rows;
  },
});

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_position")
      .collect();
  },
});

export const getProduct = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (!settings) return null;

    return {
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
      heroSlides:
        settings.heroSlides && settings.heroSlides.length > 0
          ? settings.heroSlides
          : DEFAULT_HERO_SLIDES,
      banner: settings.banner ?? DEFAULT_BANNER,
    };
  },
});

export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        slug: v.string(),
        size: v.string(),
        color: v.string(),
        qty: v.number(),
      }),
    ),
    customer: v.object({
      name: v.string(),
      phone: v.string(),
      address: v.string(),
      notes: v.optional(v.string()),
    }),
    payment: v.string(),
    paymentId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0 || args.items.length > 30) {
      throw new Error("سلة الطلب فارغة أو تحتوي على عدد كبير من القطع.");
    }
    if (args.customer.name.trim().length < 3) {
      throw new Error("اكتب اسم العميل الكامل.");
    }
    if (!/^[+\d][\d\s()-]{8,}$/.test(args.customer.phone.trim())) {
      throw new Error("رقم هاتف العميل غير صالح.");
    }
    if (args.customer.address.trim().length < 6) {
      throw new Error("عنوان التوصيل غير مكتمل.");
    }

    const userId = await getAuthUserId(ctx);
    const items = [];
    let total = 0;

    for (const item of args.items) {
      const qty = Math.floor(item.qty);
      if (qty < 1 || qty > 20) {
        throw new Error("كمية غير صالحة في الطلب.");
      }
      const product = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();
      if (!product) {
        throw new Error("إحدى القطع لم تعد متاحة. حدّث السلة وحاول مرة أخرى.");
      }
      if (!product.inStock) {
        throw new Error(`${product.name} غير متوفر حالياً.`);
      }
      const unitPrice =
        Math.round((product.price * (1 - product.discount / 100)) / 5) * 5;
      items.push({
        slug: product.slug,
        name: product.name,
        size: item.size,
        color: item.color,
        qty,
        unitPrice,
      });
      total += unitPrice * qty;
    }

    const code = orderCode();
    await ctx.db.insert("orders", {
      code,
      userId: userId ?? undefined,
      customerName: args.customer.name.trim(),
      phone: args.customer.phone.trim(),
      address: args.customer.address.trim(),
      notes: args.customer.notes?.trim() || undefined,
      payment: args.payment,
      paymentId: args.paymentId,
      items,
      total,
      status: "new",
      createdAt: Date.now(),
    });

    return { code, total };
  },
});

export const myOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createReview = mutation({
  args: {
    productSlug: v.string(),
    rating: v.number(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("سجّل الدخول أولاً لتتمكن من إضافة تعليق.");
    }
    const rating = Math.round(args.rating);
    if (rating < 1 || rating > 5) throw new Error("اختر تقييماً من ١ إلى ٥.");
    const text = args.text.trim();
    if (text.length < 3) throw new Error("اكتب تعليقاً أقصر من اللازم.");
    if (text.length > 600) throw new Error("التعليق أطول من المسموح.");

    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.productSlug))
      .first();
    if (!product) throw new Error("المنتج غير موجود.");

    const user = await ctx.db.get(userId);
    const authorName =
      user?.name?.trim() ||
      user?.email?.split("@")[0] ||
      "عضو Zoma";

    return await ctx.db.insert("reviews", {
      productSlug: args.productSlug,
      userId,
      authorName,
      rating,
      text,
      approved: false,
      createdAt: Date.now(),
    });
  },
});

export const listReviews = query({
  args: { productSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) =>
        q.eq("productSlug", args.productSlug).eq("approved", true),
      )
      .order("desc")
      .collect();
  },
});

export const myReviews = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(60);

    return await Promise.all(
      posts.map(async (post) => ({
        _id: post._id,
        authorName: post.authorName,
        caption: post.caption,
        createdAt: post.createdAt,
        imageUrl: post.imageId
          ? await ctx.storage.getUrl(post.imageId)
          : post.imageUrl,
      })),
    );
  },
});

export const generatePostUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("سجّل الدخول أولاً لرفع صورة.");
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    caption: v.string(),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("سجّل الدخول أولاً لنشر إطلالتك.");

    const caption = args.caption.trim();
    if (caption.length < 3) throw new Error("اكتب وصفاً قصيراً للإطلالة.");
    if (caption.length > 400) throw new Error("الوصف أطول من المسموح.");
    if (!args.imageId && !args.imageUrl) {
      throw new Error("أضف صورة أو اكتب وصفاً نصياً على الأقل.");
    }

    const user = await ctx.db.get(userId);
    const authorName =
      user?.name?.trim() || user?.email?.split("@")[0] || "عضو Zoma";

    return await ctx.db.insert("posts", {
      userId,
      authorName,
      caption,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const myPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return await Promise.all(
      posts.map(async (post) => ({
        _id: post._id,
        caption: post.caption,
        status: post.status,
        createdAt: post.createdAt,
        imageUrl: post.imageId
          ? await ctx.storage.getUrl(post.imageId)
          : post.imageUrl,
      })),
    );
  },
});

export const createBooking = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    service: v.string(),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const phone = args.phone.trim();
    if (name.length < 3) throw new Error("اكتب اسمك الكامل.");
    if (!/^[+\d][\d\s()-]{8,}$/.test(phone)) {
      throw new Error("اكتب رقم هاتف صحيحاً.");
    }
    if (!args.date || !args.time) throw new Error("اختر التاريخ والموعد.");
    if (args.service.trim().length < 2) throw new Error("اختر نوع الجلسة.");

    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("bookings", {
      userId: userId ?? undefined,
      name,
      phone,
      service: args.service,
      date: args.date,
      time: args.time,
      notes: args.notes?.trim() || undefined,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const myBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return bookings.sort((a, b) => b.createdAt - a.createdAt);
  },
});
