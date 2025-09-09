import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  zodiacSign: text("zodiac_sign"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fortunes = pgTable("fortunes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'tarot', 'coffee', 'horoscope', 'dream'
  title: text("title").notNull(),
  content: text("content").notNull(),
  data: jsonb("data"), // Store specific data like selected cards, image urls, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  zodiacSign: true,
});

export const insertFortuneSchema = createInsertSchema(fortunes).pick({
  userId: true,
  type: true,
  title: true,
  content: true,
  data: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFortune = z.infer<typeof insertFortuneSchema>;
export type Fortune = typeof fortunes.$inferSelect;

export const FORTUNE_TYPES = {
  TAROT: 'tarot',
  COFFEE: 'coffee',
  HOROSCOPE: 'horoscope',
  DREAM: 'dream'
} as const;

export const ZODIAC_SIGNS = [
  { name: 'Koç', symbol: '♈', dates: '21 Mart - 20 Nisan' },
  { name: 'Boğa', symbol: '♉', dates: '21 Nisan - 21 Mayıs' },
  { name: 'İkizler', symbol: '♊', dates: '22 Mayıs - 21 Haziran' },
  { name: 'Yengeç', symbol: '♋', dates: '22 Haziran - 22 Temmuz' },
  { name: 'Aslan', symbol: '♌', dates: '23 Temmuz - 23 Ağustos' },
  { name: 'Başak', symbol: '♍', dates: '24 Ağustos - 23 Eylül' },
  { name: 'Terazi', symbol: '♎', dates: '24 Eylül - 23 Ekim' },
  { name: 'Akrep', symbol: '♏', dates: '24 Ekim - 22 Kasım' },
  { name: 'Yay', symbol: '♐', dates: '23 Kasım - 21 Aralık' },
  { name: 'Oğlak', symbol: '♑', dates: '22 Aralık - 20 Ocak' },
  { name: 'Kova', symbol: '♒', dates: '21 Ocak - 19 Şubat' },
  { name: 'Balık', symbol: '♓', dates: '20 Şubat - 20 Mart' }
] as const;
