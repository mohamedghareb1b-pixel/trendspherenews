import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

// -------------------- Enums --------------------
export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
]);

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "editor",
  "author",
  "reader",
]);

// -------------------- Auth: Users --------------------
// بنية متوافقة مع next-auth Drizzle Adapter + حقل role للصلاحيات الداخلية
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }),
  email: varchar("email", { length: 300 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  role: userRoleEnum("role").default("reader").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------- Auth: OAuth Accounts --------------------
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 300 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: varchar("scope", { length: 300 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 300 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// -------------------- Auth: Sessions --------------------
export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 300 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

// -------------------- Auth: Verification Tokens (Magic Link) --------------------
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 300 }).notNull(),
    token: varchar("token", { length: 300 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// -------------------- Authors --------------------
export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------- Categories --------------------
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  parentId: uuid("parent_id"),
  description: text("description"),
});

// -------------------- Tags --------------------
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

// -------------------- Articles (Core Entity) --------------------
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // Part 1 - shown before the secondary image
  contentPart2: text("content_part_2"), // Part 2 - shown after the secondary image
  ticketLink: text("ticket_link"), // رابط اختياري لبيع التذاكر (ماتشات/حفلات) - بيظهر في نهاية الجزء الأول من المحتوى قبل الصورة الثانية
  heroImageUrl: text("hero_image_url"),
  secondaryImageUrl: text("secondary_image_url"),

  authorId: uuid("author_id").references(() => authors.id),
  categoryId: uuid("category_id").references(() => categories.id),

  status: articleStatusEnum("status").default("draft").notNull(),

  // SEO / GEO fields
  metaTitle: varchar("meta_title", { length: 300 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  aiSummary: text("ai_summary"),
  faq: jsonb("faq").$type<{ question: string; answer: string }[]>(),

  readingTimeMinutes: integer("reading_time_minutes"),

  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Article <-> Tags (many to many) --------------------
export const articleTags = pgTable("article_tags", {
  articleId: uuid("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

// -------------------- Analytics: Page Views --------------------
// تتبع بسيط وخفيف (بدون كوكيز أو تعريف زوار) - عدد مشاهدات لكل مقال/صفحة
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "set null" }),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: varchar("referrer", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------- Advertisement: Ad Slots --------------------
// كل سلوت إعلان بيتدار بالكامل من لوحة التحكم - كود الإعلان بيتحط كـ raw HTML/script
export const adSlots = pgTable("ad_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(), // e.g. "homepage_hero", "article_top"
  name: varchar("name", { length: 200 }).notNull(),
  code: text("code"), // كود AdSense / Ad Manager / أي سكريبت إعلان
  enabled: boolean("enabled").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// -------------------- Site Settings (Google/Analytics keys, editable from Admin) --------------------
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// -------------------- Newsletter Subscribers --------------------
export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "pending", // لسه ما أكدش الإيميل
  "verified", // مؤكد وبيستقبل النشرة
  "unsubscribed",
]);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 300 }).notNull().unique(),
  status: subscriberStatusEnum("status").default("pending").notNull(),
  preferredCategories: jsonb("preferred_categories").$type<string[]>(),

  verificationToken: varchar("verification_token", { length: 300 }),
  verificationTokenExpires: timestamp("verification_token_expires"),
  unsubscribeToken: varchar("unsubscribe_token", { length: 300 }).notNull(),

  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
