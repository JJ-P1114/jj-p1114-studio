import {
  users,
  software,
  orders,
  licenses,
  inquiries,
  prototypes,
  type User,
  type UpsertUser,
  type Software,
  type InsertSoftware,
  type Order,
  type InsertOrder,
  type License,
  type InsertLicense,
  type Inquiry,
  type InsertInquiry,
  type Prototype,
  type InsertPrototype,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Software operations
  getAllSoftware(): Promise<Software[]>;
  getSoftware(id: number): Promise<Software | undefined>;
  createSoftware(software: InsertSoftware): Promise<Software>;
  updateSoftware(id: number, software: Partial<InsertSoftware>): Promise<Software>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  
  // License operations
  createLicense(license: InsertLicense): Promise<License>;
  getLicensesByUser(userId: string): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;
  getLicenseByKey(licenseKey: string): Promise<License | undefined>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesByUser(userId: string): Promise<Inquiry[]>;
  getAllInquiries(): Promise<Inquiry[]>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry>;
  
  // Prototype operations
  createPrototype(prototype: InsertPrototype): Promise<Prototype>;
  getPrototypesByUser(userId: string): Promise<Prototype[]>;
  getPrototype(id: number): Promise<Prototype | undefined>;
  updatePrototype(id: number, prototype: Partial<InsertPrototype>): Promise<Prototype>;
  getAllPrototypes(): Promise<Prototype[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Software operations
  async getAllSoftware(): Promise<Software[]> {
    return await db.select().from(software).where(eq(software.isActive, true)).orderBy(desc(software.createdAt));
  }

  async getSoftware(id: number): Promise<Software | undefined> {
    const [result] = await db.select().from(software).where(eq(software.id, id));
    return result;
  }

  async createSoftware(softwareData: InsertSoftware): Promise<Software> {
    const [result] = await db.insert(software).values(softwareData).returning();
    return result;
  }

  async updateSoftware(id: number, softwareData: Partial<InsertSoftware>): Promise<Software> {
    const [result] = await db
      .update(software)
      .set({ ...softwareData, updatedAt: new Date() })
      .where(eq(software.id, id))
      .returning();
    return result;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [result] = await db.insert(orders).values(orderData).returning();
    return result;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [result] = await db.select().from(orders).where(eq(orders.id, id));
    return result;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [result] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // License operations
  async createLicense(licenseData: InsertLicense): Promise<License> {
    const [result] = await db.insert(licenses).values(licenseData).returning();
    return result;
  }

  async getLicensesByUser(userId: string): Promise<License[]> {
    return await db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.createdAt));
  }

  async getLicense(id: number): Promise<License | undefined> {
    const [result] = await db.select().from(licenses).where(eq(licenses.id, id));
    return result;
  }

  async getLicenseByKey(licenseKey: string): Promise<License | undefined> {
    const [result] = await db.select().from(licenses).where(eq(licenses.licenseKey, licenseKey));
    return result;
  }

  // Inquiry operations
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const [result] = await db.insert(inquiries).values(inquiryData).returning();
    return result;
  }

  async getInquiriesByUser(userId: string): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.userId, userId)).orderBy(desc(inquiries.createdAt));
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry> {
    const [result] = await db
      .update(inquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
      .returning();
    return result;
  }

  // Prototype operations
  async createPrototype(prototypeData: InsertPrototype): Promise<Prototype> {
    const [result] = await db.insert(prototypes).values(prototypeData).returning();
    return result;
  }

  async getPrototypesByUser(userId: string): Promise<Prototype[]> {
    return await db.select().from(prototypes).where(eq(prototypes.userId, userId)).orderBy(desc(prototypes.createdAt));
  }

  async getPrototype(id: number): Promise<Prototype | undefined> {
    const [result] = await db.select().from(prototypes).where(eq(prototypes.id, id));
    return result;
  }

  async updatePrototype(id: number, prototypeData: Partial<InsertPrototype>): Promise<Prototype> {
    const [result] = await db
      .update(prototypes)
      .set({ ...prototypeData, updatedAt: new Date() })
      .where(eq(prototypes.id, id))
      .returning();
    return result;
  }

  async getAllPrototypes(): Promise<Prototype[]> {
    return await db.select().from(prototypes).orderBy(desc(prototypes.createdAt));
  }
}

export const storage = new DatabaseStorage();
