import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";
import {
  badgeValidator,
  bookingStatusValidator,
  categoryValidator,
  colorValidator,
  heroSlideValidator,
  bannerValidator,
  kindValidator,
  orderStatusValidator,
  paymentMethodValidator,
  postStatusValidator,
} from "./validators";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    products: defineTable({
      slug: v.string(),
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
      imageUrl: v.optional(v.string()),
      secondImageUrl: v.optional(v.string()),
      position: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_position", ["position"]),

    categories: defineTable({
      slug: v.string(),
      label: v.string(),
      note: v.string(),
      imageUrl: v.optional(v.string()),
      position: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_position", ["position"]),

    orders: defineTable({
      code: v.string(),
      userId: v.optional(v.id("users")),
      customerName: v.string(),
      phone: v.string(),
      address: v.string(),
      notes: v.optional(v.string()),
      payment: v.string(),
      paymentId: v.string(),
      items: v.array(
        v.object({
          slug: v.string(),
          name: v.string(),
          size: v.string(),
          color: v.string(),
          qty: v.number(),
          unitPrice: v.number(),
        }),
      ),
      total: v.number(),
      status: orderStatusValidator,
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_created", ["createdAt"]),

    reviews: defineTable({
      productSlug: v.string(),
      userId: v.optional(v.id("users")),
      authorName: v.string(),
      rating: v.number(),
      text: v.string(),
      approved: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_product", ["productSlug", "approved"])
      .index("by_user", ["userId"])
      .index("by_approved", ["approved"]),

    bookings: defineTable({
      userId: v.optional(v.id("users")),
      name: v.string(),
      phone: v.string(),
      service: v.string(),
      date: v.string(),
      time: v.string(),
      notes: v.optional(v.string()),
      status: bookingStatusValidator,
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_date", ["date"]),

    posts: defineTable({
      userId: v.optional(v.id("users")),
      authorName: v.string(),
      caption: v.string(),
      imageId: v.optional(v.id("_storage")),
      imageUrl: v.optional(v.string()),
      status: postStatusValidator,
      createdAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_user", ["userId"]),

    settings: defineTable({
      key: v.string(),
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
      logoUrl: v.optional(v.string()),
      heroSlides: v.optional(v.array(heroSlideValidator)),
      banner: v.optional(bannerValidator),
      adminEmail: v.string(),
      adminPassword: v.string(),
      seedVersion: v.optional(v.number()),
      updatedAt: v.number(),
    }).index("by_key", ["key"]),

    adminSessions: defineTable({
      token: v.string(),
      createdAt: v.number(),
      expiresAt: v.number(),
    }).index("by_token", ["token"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
