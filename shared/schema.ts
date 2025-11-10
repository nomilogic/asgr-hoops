import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rank: integer("rank"),
  gradeYear: integer("grade_year"),
  position: text("position"),
  height: text("height"),
  highSchool: text("high_school"),
  highSchoolId: integer("high_school_id"),
  circuitProgram: text("circuit_program"),
  circuitTeamId: integer("circuit_team_id"),
  state: text("state"),
  committedCollege: text("committed_college"),
  committedCollegeId: integer("committed_college_id"),
  imagePath: text("image_path"),
  sourceUrl: text("source_url"),
  ranks: jsonb("ranks").$type<Record<string, number>>().default({}),
  ratings: jsonb("ratings").$type<Record<string, number>>().default({}),
  notes: jsonb("notes").$type<Record<string, string>>().default({}),
  positions: jsonb("positions").$type<Record<string, string>>().default({}),
  heights: jsonb("heights").$type<Record<string, string>>().default({}),
  highSchools: jsonb("high_schools").$type<Record<string, string>>().default({}),
  circuitPrograms: jsonb("circuit_programs").$type<Record<string, string>>().default({}),
  committedColleges: jsonb("committed_colleges").$type<Record<string, string>>().default({}),
  sourceUrls: jsonb("source_urls").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const highSchools = pgTable("high_schools", {
  id: serial("id").primaryKey(),
  school: text("school").notNull(),
  logoPath: text("logo_path"),
  ranks: jsonb("ranks").$type<Record<string, number>>().default({}),
  records: jsonb("records").$type<Record<string, string>>().default({}),
  keyWins: jsonb("key_wins").$type<Record<string, string>>().default({}),
  sourceUrls: jsonb("source_urls").$type<string[]>().default([]),
});

export const circuitTeams = pgTable("circuit_teams", {
  id: serial("id").primaryKey(),
  team: text("team").notNull(),
  circuit: text("circuit"),
  ranks: jsonb("ranks").$type<Record<string, number>>().default({}),
  records: jsonb("records").$type<Record<string, string>>().default({}),
  keyWins: jsonb("key_wins").$type<Record<string, string>>().default({}),
  placements: jsonb("placements").$type<Record<string, string>>().default({}),
  sourceUrls: jsonb("source_urls").$type<string[]>().default([]),
});

export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoPath: text("logo_path"),
  logoUrl: text("logo_url"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  eventDate: text("event_date"),
  location: text("location"),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHighSchoolSchema = createInsertSchema(highSchools).omit({
  id: true,
});

export const insertCircuitTeamSchema = createInsertSchema(circuitTeams).omit({
  id: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertHighSchool = z.infer<typeof insertHighSchoolSchema>;
export type HighSchool = typeof highSchools.$inferSelect;

export type InsertCircuitTeam = z.infer<typeof insertCircuitTeamSchema>;
export type CircuitTeam = typeof circuitTeams.$inferSelect;

export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof colleges.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
