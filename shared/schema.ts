import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, bigint, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  rank: integer("rank"),
  gradeYear: integer("grade_year"),
  position: text("position"),
  height: text("height"),
  highSchool: text("high_school"),
  highSchoolId: bigint("high_school_id", { mode: "number" }),
  circuitProgram: text("circuit_program"),
  circuitTeamId: bigint("circuit_team_id", { mode: "number" }),
  state: text("state"),
  committedCollege: text("committed_college"),
  committedCollegeId: bigint("committed_college_id", { mode: "number" }),
  rating: integer("rating"),
  ratingComment: text("rating_comment"),
  imagePath: text("image_path"),
  collegeLogoPath: text("college_logo_path"),
  sourceUrl: text("source_url"),
  ranks: jsonb("ranks").$type<Record<string, number>>().notNull().default({}),
  ratings: jsonb("ratings").$type<Record<string, number>>().notNull().default({}),
  notes: jsonb("notes").$type<Record<string, string>>().notNull().default({}),
  positions: jsonb("positions").$type<Record<string, string>>().notNull().default({}),
  heights: jsonb("heights").$type<Record<string, string>>().notNull().default({}),
  highSchools: jsonb("high_schools").$type<Record<string, string>>().notNull().default({}),
  circuitPrograms: jsonb("circuit_programs").$type<Record<string, string>>().notNull().default({}),
  committedColleges: jsonb("committed_colleges").$type<Record<string, string>>().notNull().default({}),
  sourceUrls: text("source_urls").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const highSchools = pgTable("high_schools", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  school: text("school").notNull(),
  logoPath: text("logo_path"),
  ranks: jsonb("ranks").$type<Record<string, number>>().notNull().default({}),
  records: jsonb("records").$type<Record<string, string>>().notNull().default({}),
  keyWins: jsonb("key_wins").$type<Record<string, string>>().notNull().default({}),
  sourceUrls: text("source_urls").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const circuitTeams = pgTable("circuit_teams", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  team: text("team").notNull(),
  circuit: text("circuit"),
  ranks: jsonb("ranks").$type<Record<string, number>>().notNull().default({}),
  records: jsonb("records").$type<Record<string, string>>().notNull().default({}),
  keyWins: jsonb("key_wins").$type<Record<string, string>>().notNull().default({}),
  placements: jsonb("placements").$type<Record<string, string>>().notNull().default({}),
  sourceUrls: text("source_urls").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const colleges = pgTable("colleges", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  logoPath: text("logo_path"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHighSchoolSchema = createInsertSchema(highSchools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCircuitTeamSchema = createInsertSchema(circuitTeams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertHighSchool = z.infer<typeof insertHighSchoolSchema>;
export type HighSchool = typeof highSchools.$inferSelect;

export type InsertCircuitTeam = z.infer<typeof insertCircuitTeamSchema>;
export type CircuitTeam = typeof circuitTeams.$inferSelect;

export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof colleges.$inferSelect;

export const products = pgTable("products", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category"),
  features: text("features").array().notNull().default([]),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = Omit<typeof users.$inferSelect, 'password'>;
export type UserWithPassword = typeof users.$inferSelect;
