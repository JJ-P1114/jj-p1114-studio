import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSoftwareSchema, insertOrderSchema, insertLicenseSchema, insertInquirySchema, insertPrototypeSchema } from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are now handled in replitAuth.ts

  // Software routes
  app.get('/api/software', async (req, res) => {
    try {
      const softwareList = await storage.getAllSoftware();
      res.json(softwareList);
    } catch (error) {
      console.error("Error fetching software:", error);
      res.status(500).json({ message: "Failed to fetch software" });
    }
  });

  app.get('/api/software/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const software = await storage.getSoftware(id);
      if (!software) {
        return res.status(404).json({ message: "Software not found" });
      }
      res.json(software);
    } catch (error) {
      console.error("Error fetching software:", error);
      res.status(500).json({ message: "Failed to fetch software" });
    }
  });

  app.post('/api/software', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertSoftwareSchema.parse(req.body);
      const software = await storage.createSoftware(validatedData);
      res.status(201).json(software);
    } catch (error) {
      console.error("Error creating software:", error);
      res.status(500).json({ message: "Failed to create software" });
    }
  });

  // Order routes
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      
      const order = await storage.createOrder(validatedData);
      
      // Generate license key
      const licenseKey = `${req.body.softwareId}-${Date.now()}-${nanoid(8)}`.toUpperCase();
      
      // Create license
      await storage.createLicense({
        userId,
        softwareId: req.body.softwareId,
        orderId: order.id,
        licenseKey,
        isActive: true,
      });
      
      // Update order status
      await storage.updateOrderStatus(order.id, 'completed');
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/admin/orders', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // License routes
  app.get('/api/licenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const licenses = await storage.getLicensesByUser(userId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });

  // Inquiry routes
  app.post('/api/inquiries', async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.get('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const inquiries = await storage.getInquiriesByUser(userId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get('/api/admin/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Prototype routes
  app.post('/api/prototypes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPrototypeSchema.parse({
        ...req.body,
        userId,
      });
      
      const prototype = await storage.createPrototype(validatedData);
      res.status(201).json(prototype);
    } catch (error) {
      console.error("Error creating prototype:", error);
      res.status(500).json({ message: "Failed to create prototype" });
    }
  });

  app.get('/api/prototypes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prototypes = await storage.getPrototypesByUser(userId);
      res.json(prototypes);
    } catch (error) {
      console.error("Error fetching prototypes:", error);
      res.status(500).json({ message: "Failed to fetch prototypes" });
    }
  });

  app.put('/api/prototypes/:id', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/admin/prototypes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const prototypes = await storage.getAllPrototypes();
      res.json(prototypes);
    } catch (error) {
      console.error("Error fetching prototypes:", error);
      res.status(500).json({ message: "Failed to fetch prototypes" });
    }
  });

  // Admin stats route
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const [orders, inquiries, prototypes, software] = await Promise.all([
        storage.getAllOrders(),
        storage.getAllInquiries(),
        storage.getAllPrototypes(),
        storage.getAllSoftware(),
      ]);
      
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.totalAmount || '0'), 0);
      
      const clientCount = new Set(orders.map(order => order.userId)).size;
      
      res.json({
        clientCount,
        softwareCount: software.length,
        orderCount: orders.length,
        revenue: totalRevenue,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
