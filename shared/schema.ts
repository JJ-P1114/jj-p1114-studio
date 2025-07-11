import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("client").notNull(), // client, admin, staff
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Software products table
export const software = pgTable("software", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  features: jsonb("features"), // Array of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  softwareId: integer("software_id").references(() => software.id).notNull(),
  status: varchar("status").default("pending").notNull(), // pending, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Software licenses table
export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  softwareId: integer("software_id").references(() => software.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  licenseKey: varchar("license_key").unique().notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom project inquiries table
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  projectType: varchar("project_type").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("new").notNull(), // new, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prototype projects table
export const prototypes = pgTable("prototypes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  components: jsonb("components"), // Prototype component data
  comments: text("comments"),
  specifications: text("specifications"),
  status: varchar("status").default("draft").notNull(), // draft, submitted, approved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  licenses: many(licenses),
  inquiries: many(inquiries),
  prototypes: many(prototypes),
}));

export const softwareRelations = relations(software, ({ many }) => ({
  orders: many(orders),
  licenses: many(licenses),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  software: one(software, { fields: [orders.softwareId], references: [software.id] }),
  licenses: many(licenses),
}));

export const licensesRelations = relations(licenses, ({ one }) => ({
  user: one(users, { fields: [licenses.userId], references: [users.id] }),
  software: one(software, { fields: [licenses.softwareId], references: [software.id] }),
  order: one(orders, { fields: [licenses.orderId], references: [orders.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, { fields: [inquiries.userId], references: [users.id] }),
}));

export const prototypesRelations = relations(prototypes, ({ one }) => ({
  user: one(users, { fields: [prototypes.userId], references: [users.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertSoftwareSchema = createInsertSchema(software);
export const insertOrderSchema = createInsertSchema(orders);
export const insertLicenseSchema = createInsertSchema(licenses);
export const insertInquirySchema = createInsertSchema(inquiries);
export const insertPrototypeSchema = createInsertSchema(prototypes);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Software = typeof software.$inferSelect;
export type InsertSoftware = typeof software.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
export type Prototype = typeof prototypes.$inferSelect;
export type InsertPrototype = typeof prototypes.$inferInsert;
