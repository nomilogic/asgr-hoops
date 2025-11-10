import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, bigint, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  photoUrl: text("photo_url"),
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
  logoUrl: text("logo_url"),
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
