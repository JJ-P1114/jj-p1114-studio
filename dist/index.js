var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  inquiries: () => inquiries,
  inquiriesRelations: () => inquiriesRelations,
  insertInquirySchema: () => insertInquirySchema,
  insertLicenseSchema: () => insertLicenseSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPrototypeSchema: () => insertPrototypeSchema,
  insertSoftwareSchema: () => insertSoftwareSchema,
  insertUserSchema: () => insertUserSchema,
  licenses: () => licenses,
  licensesRelations: () => licensesRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  prototypes: () => prototypes,
  prototypesRelations: () => prototypesRelations,
  sessions: () => sessions,
  software: () => software,
  softwareRelations: () => softwareRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
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
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("client").notNull(),
  // client, admin, staff
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var software = pgTable("software", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  features: jsonb("features"),
  // Array of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  softwareId: integer("software_id").references(() => software.id).notNull(),
  status: varchar("status").default("pending").notNull(),
  // pending, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  softwareId: integer("software_id").references(() => software.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  licenseKey: varchar("license_key").unique().notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  projectType: varchar("project_type").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("new").notNull(),
  // new, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var prototypes = pgTable("prototypes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  components: jsonb("components"),
  // Prototype component data
  comments: text("comments"),
  specifications: text("specifications"),
  status: varchar("status").default("draft").notNull(),
  // draft, submitted, approved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  licenses: many(licenses),
  inquiries: many(inquiries),
  prototypes: many(prototypes)
}));
var softwareRelations = relations(software, ({ many }) => ({
  orders: many(orders),
  licenses: many(licenses)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  software: one(software, { fields: [orders.softwareId], references: [software.id] }),
  licenses: many(licenses)
}));
var licensesRelations = relations(licenses, ({ one }) => ({
  user: one(users, { fields: [licenses.userId], references: [users.id] }),
  software: one(software, { fields: [licenses.softwareId], references: [software.id] }),
  order: one(orders, { fields: [licenses.orderId], references: [orders.id] })
}));
var inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, { fields: [inquiries.userId], references: [users.id] })
}));
var prototypesRelations = relations(prototypes, ({ one }) => ({
  user: one(users, { fields: [prototypes.userId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users);
var insertSoftwareSchema = createInsertSchema(software);
var insertOrderSchema = createInsertSchema(orders);
var insertLicenseSchema = createInsertSchema(licenses);
var insertInquirySchema = createInsertSchema(inquiries);
var insertPrototypeSchema = createInsertSchema(prototypes);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Software operations
  async getAllSoftware() {
    return await db.select().from(software).where(eq(software.isActive, true)).orderBy(desc(software.createdAt));
  }
  async getSoftware(id) {
    const [result] = await db.select().from(software).where(eq(software.id, id));
    return result;
  }
  async createSoftware(softwareData) {
    const [result] = await db.insert(software).values(softwareData).returning();
    return result;
  }
  async updateSoftware(id, softwareData) {
    const [result] = await db.update(software).set({ ...softwareData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(software.id, id)).returning();
    return result;
  }
  // Order operations
  async createOrder(orderData) {
    const [result] = await db.insert(orders).values(orderData).returning();
    return result;
  }
  async getOrdersByUser(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }
  async getOrder(id) {
    const [result] = await db.select().from(orders).where(eq(orders.id, id));
    return result;
  }
  async updateOrderStatus(id, status) {
    const [result] = await db.update(orders).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, id)).returning();
    return result;
  }
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  // License operations
  async createLicense(licenseData) {
    const [result] = await db.insert(licenses).values(licenseData).returning();
    return result;
  }
  async getLicensesByUser(userId) {
    return await db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.createdAt));
  }
  async getLicense(id) {
    const [result] = await db.select().from(licenses).where(eq(licenses.id, id));
    return result;
  }
  async getLicenseByKey(licenseKey) {
    const [result] = await db.select().from(licenses).where(eq(licenses.licenseKey, licenseKey));
    return result;
  }
  // Inquiry operations
  async createInquiry(inquiryData) {
    const [result] = await db.insert(inquiries).values(inquiryData).returning();
    return result;
  }
  async getInquiriesByUser(userId) {
    return await db.select().from(inquiries).where(eq(inquiries.userId, userId)).orderBy(desc(inquiries.createdAt));
  }
  async getAllInquiries() {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }
  async updateInquiryStatus(id, status) {
    const [result] = await db.update(inquiries).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(inquiries.id, id)).returning();
    return result;
  }
  // Prototype operations
  async createPrototype(prototypeData) {
    const [result] = await db.insert(prototypes).values(prototypeData).returning();
    return result;
  }
  async getPrototypesByUser(userId) {
    return await db.select().from(prototypes).where(eq(prototypes.userId, userId)).orderBy(desc(prototypes.createdAt));
  }
  async getPrototype(id) {
    const [result] = await db.select().from(prototypes).where(eq(prototypes.id, id));
    return result;
  }
  async updatePrototype(id, prototypeData) {
    const [result] = await db.update(prototypes).set({ ...prototypeData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(prototypes.id, id)).returning();
    return result;
  }
  async getAllPrototypes() {
    return await db.select().from(prototypes).orderBy(desc(prototypes.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    const issuerUrl = process.env.ISSUER_URL || "https://replit.com/oidc";
    return await client.discovery(
      new URL(issuerUrl),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
  app2.get("/api/auth/user", async (req, res) => {
    try {
      console.log("Auth check: isAuthenticated =", req.isAuthenticated?.(), "user =", !!req.user);
      if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
        console.log("Returning null for unauthenticated user");
        return res.json(null);
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { nanoid } from "nanoid";
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/software", async (req, res) => {
    try {
      const softwareList = await storage.getAllSoftware();
      res.json(softwareList);
    } catch (error) {
      console.error("Error fetching software:", error);
      res.status(500).json({ message: "Failed to fetch software" });
    }
  });
  app2.get("/api/software/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const software2 = await storage.getSoftware(id);
      if (!software2) {
        return res.status(404).json({ message: "Software not found" });
      }
      res.json(software2);
    } catch (error) {
      console.error("Error fetching software:", error);
      res.status(500).json({ message: "Failed to fetch software" });
    }
  });
  app2.post("/api/software", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const validatedData = insertSoftwareSchema.parse(req.body);
      const software2 = await storage.createSoftware(validatedData);
      res.status(201).json(software2);
    } catch (error) {
      console.error("Error creating software:", error);
      res.status(500).json({ message: "Failed to create software" });
    }
  });
  app2.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId
      });
      const order = await storage.createOrder(validatedData);
      const licenseKey = `${req.body.softwareId}-${Date.now()}-${nanoid(8)}`.toUpperCase();
      await storage.createLicense({
        userId,
        softwareId: req.body.softwareId,
        orderId: order.id,
        licenseKey,
        isActive: true
      });
      await storage.updateOrderStatus(order.id, "completed");
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders2 = await storage.getOrdersByUser(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/admin/orders", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== "admin" && user.role !== "staff") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/licenses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const licenses2 = await storage.getLicensesByUser(userId);
      res.json(licenses2);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });
  app2.get("/api/inquiries", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const inquiries2 = await storage.getInquiriesByUser(userId);
      res.json(inquiries2);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.get("/api/admin/inquiries", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== "admin" && user.role !== "staff") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const inquiries2 = await storage.getAllInquiries();
      res.json(inquiries2);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.post("/api/prototypes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPrototypeSchema.parse({
        ...req.body,
        userId
      });
      const prototype = await storage.createPrototype(validatedData);
      res.status(201).json(prototype);
    } catch (error) {
      console.error("Error creating prototype:", error);
      res.status(500).json({ message: "Failed to create prototype" });
    }
  });
  app2.get("/api/prototypes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const prototypes2 = await storage.getPrototypesByUser(userId);
      res.json(prototypes2);
    } catch (error) {
      console.error("Error fetching prototypes:", error);
      res.status(500).json({ message: "Failed to fetch prototypes" });
    }
  });
  app2.put("/api/prototypes/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const existingPrototype = await storage.getPrototype(id);
      if (!existingPrototype || existingPrototype.userId !== userId) {
        return res.status(404).json({ message: "Prototype not found" });
      }
      const validatedData = insertPrototypeSchema.partial().parse(req.body);
      const prototype = await storage.updatePrototype(id, validatedData);
      res.json(prototype);
    } catch (error) {
      console.error("Error updating prototype:", error);
      res.status(500).json({ message: "Failed to update prototype" });
    }
  });
  app2.get("/api/admin/prototypes", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== "admin" && user.role !== "staff") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const prototypes2 = await storage.getAllPrototypes();
      res.json(prototypes2);
    } catch (error) {
      console.error("Error fetching prototypes:", error);
      res.status(500).json({ message: "Failed to fetch prototypes" });
    }
  });
  app2.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== "admin" && user.role !== "staff") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const [orders2, inquiries2, prototypes2, software2] = await Promise.all([
        storage.getAllOrders(),
        storage.getAllInquiries(),
        storage.getAllPrototypes(),
        storage.getAllSoftware()
      ]);
      const totalRevenue = orders2.filter((order) => order.status === "completed").reduce((sum, order) => sum + parseFloat(order.totalAmount || "0"), 0);
      const clientCount = new Set(orders2.map((order) => order.userId)).size;
      res.json({
        clientCount,
        softwareCount: software2.length,
        orderCount: orders2.length,
        revenue: totalRevenue,
        recentOrders: orders2.slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seedData.ts
var sampleSoftware = [
  {
    name: "BusinessManager Pro",
    description: "Solution compl\xE8te de gestion d'entreprise avec CRM, comptabilit\xE9 et gestion des stocks int\xE9gr\xE9s",
    price: 899.99,
    features: ["CRM avanc\xE9", "Comptabilit\xE9 automatis\xE9e", "Gestion des stocks", "Rapports d\xE9taill\xE9s", "Support 24/7"],
    category: "business",
    version: "3.2.1",
    requirements: "Windows 10+, 8GB RAM, 2GB espace disque"
  },
  {
    name: "InventoryTracker Elite",
    description: "Syst\xE8me de gestion d'inventaire en temps r\xE9el avec codes-barres et analytiques avanc\xE9es",
    price: 599.99,
    features: ["Codes-barres", "Tracking temps r\xE9el", "Alertes automatiques", "Rapports analytiques", "Multi-entrep\xF4ts"],
    category: "inventory",
    version: "2.8.4",
    requirements: "Windows 10+, 4GB RAM, 1GB espace disque"
  },
  {
    name: "CustomerInsight Analytics",
    description: "Plateforme d'analyse client avec segmentation automatique et pr\xE9dictions comportementales",
    price: 1299.99,
    features: ["Segmentation IA", "Pr\xE9dictions comportementales", "Tableaux de bord interactifs", "Int\xE9grations API", "Reporting avanc\xE9"],
    category: "analytics",
    version: "4.1.0",
    requirements: "Windows 10+, 16GB RAM, 5GB espace disque"
  },
  {
    name: "ProjectFlow Manager",
    description: "Solution de gestion de projet avec collaboration en temps r\xE9el et automatisation des t\xE2ches",
    price: 449.99,
    features: ["Collaboration temps r\xE9el", "Automatisation des t\xE2ches", "Gantt interactif", "Tracking du temps", "Notifications intelligentes"],
    category: "project",
    version: "1.9.7",
    requirements: "Windows 10+, 8GB RAM, 2GB espace disque"
  },
  {
    name: "SecureBackup Enterprise",
    description: "Solution de sauvegarde entreprise avec chiffrement avanc\xE9 et r\xE9cup\xE9ration instantan\xE9e",
    price: 799.99,
    features: ["Chiffrement 256-bit", "Sauvegarde automatique", "R\xE9cup\xE9ration instantan\xE9e", "D\xE9duplication", "Monitoring 24/7"],
    category: "security",
    version: "2.3.5",
    requirements: "Windows Server 2019+, 16GB RAM, 1TB espace disque"
  }
];
async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");
    const existingSoftware = await storage.getAllSoftware();
    if (existingSoftware.length > 0) {
      console.log("Database already contains software data, skipping seed");
      return;
    }
    for (const software2 of sampleSoftware) {
      await storage.createSoftware(software2);
      console.log(`Created software: ${software2.name}`);
    }
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await seedDatabase();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
