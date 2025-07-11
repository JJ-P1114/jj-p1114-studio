import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Simple session configuration for demo
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || "demo-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

// Create a demo user for testing
const demoUser = {
  id: "demo-user",
  email: "demo@jj-p1114.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  role: "admin"
};

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Create demo user if it doesn't exist
  try {
    await storage.upsertUser(demoUser);
  } catch (error) {
    console.error("Error creating demo user:", error);
  }

  // Simple login route - automatically logs in as demo user
  app.get("/api/login", (req, res) => {
    (req.session as any).user = demoUser;
    res.redirect("/");
  });

  // Simple logout route
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  });
}

// Simple authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Add user to request object
  (req as any).user = user;
  next();
};

// Optional authentication middleware (doesn't block if not authenticated)
export const optionalAuth: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.user;
  if (user) {
    (req as any).user = user;
  }
  next();
};