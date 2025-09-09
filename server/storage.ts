import { type User, type InsertUser, type Fortune, type InsertFortune } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { users, fortunes } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFortune(fortune: InsertFortune): Promise<Fortune>;
  getFortunes(userId?: string): Promise<Fortune[]>;
  getFortune(id: string): Promise<Fortune | undefined>;
  deleteFortune(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fortunes: Map<string, Fortune>;

  constructor() {
    this.users = new Map();
    this.fortunes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      zodiacSign: insertUser.zodiacSign || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createFortune(insertFortune: InsertFortune): Promise<Fortune> {
    const id = randomUUID();
    const fortune: Fortune = {
      ...insertFortune,
      id,
      data: insertFortune.data || null,
      userId: insertFortune.userId || null,
      createdAt: new Date()
    };
    this.fortunes.set(id, fortune);
    return fortune;
  }

  async getFortunes(userId?: string): Promise<Fortune[]> {
    const fortunes = Array.from(this.fortunes.values());
    if (userId) {
      return fortunes
        .filter((fortune) => fortune.userId === userId)
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    return fortunes.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getFortune(id: string): Promise<Fortune | undefined> {
    return this.fortunes.get(id);
  }

  async deleteFortune(id: string): Promise<boolean> {
    return this.fortunes.delete(id);
  }
}

export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createFortune(insertFortune: InsertFortune): Promise<Fortune> {
    const result = await this.db.insert(fortunes).values(insertFortune).returning();
    return result[0];
  }

  async getFortunes(userId?: string): Promise<Fortune[]> {
    if (userId) {
      return await this.db.select().from(fortunes).where(eq(fortunes.userId, userId)).orderBy(desc(fortunes.createdAt));
    }
    return await this.db.select().from(fortunes).orderBy(desc(fortunes.createdAt));
  }

  async getFortune(id: string): Promise<Fortune | undefined> {
    const result = await this.db.select().from(fortunes).where(eq(fortunes.id, id)).limit(1);
    return result[0];
  }

  async deleteFortune(id: string): Promise<boolean> {
    const result = await this.db.delete(fortunes).where(eq(fortunes.id, id)).returning();
    return result.length > 0;
  }
}

// Use database storage in production, memory storage in development
export const storage = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL 
  ? new DbStorage() 
  : new MemStorage();
