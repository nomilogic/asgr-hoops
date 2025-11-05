import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  schoolName: text("school_name").notNull(),
  cleanName: text("clean_name"),
  city: text("city"),
  state: text("state"),
  category: text("category"),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  oldId: text("old_id"),
  name: text("name").notNull(),
  rankNumber: integer("rank_number"),
  position: text("position"),
  heightRaw: text("height_raw"),
  heightFeet: integer("height_feet"),
  heightInches: integer("height_inches"),
  heightFormatted: text("height_formatted"),
  school: text("school"),
  city: text("city"),
  state: text("state"),
  gradYear: integer("grad_year"),
  committedTo: text("committed_to"),
  previousSchool: text("previous_school"),
  twitter: text("twitter"),
  schoolId: integer("school_id"),
  schoolClean: text("school_clean"),
  schoolType: text("school_type"),
  imageUrl: text("image_url"),
  circuitProgram: text("circuit_program"),
});

export const circuitTeams = pgTable("circuit_teams", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  state: text("state"),
});

export const playerCircuitTeams = pgTable("player_circuit_teams", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  circuitTeamId: integer("circuit_team_id"),
  eventIndex: integer("event_index"),
  teamIndex: integer("team_index"),
  wins: integer("wins"),
  losses: integer("losses"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  eventDate: text("event_date"),
  location: text("location"),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const rankings = pgTable("rankings", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  rankType: text("rank_type").notNull(),
  rank: integer("rank").notNull(),
  year: integer("year"),
  rating: integer("rating"),
  ratingDescription: text("rating_description"),
});

export const schoolRankings = pgTable("school_rankings", {
  id: serial("id").primaryKey(),
  rank: integer("rank").notNull(),
  schoolName: text("school_name").notNull(),
  schoolState: text("school_state"),
  logoUrl: text("logo_url"),
  wins: integer("wins"),
  losses: integer("losses"),
  keyWins: text("key_wins"),
  season: text("season").notNull(),
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertCircuitTeamSchema = createInsertSchema(circuitTeams).omit({
  id: true,
});

export const insertPlayerCircuitTeamSchema = createInsertSchema(playerCircuitTeams).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertRankingSchema = createInsertSchema(rankings).omit({
  id: true,
});

export const insertSchoolRankingSchema = createInsertSchema(schoolRankings).omit({
  id: true,
});

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertCircuitTeam = z.infer<typeof insertCircuitTeamSchema>;
export type CircuitTeam = typeof circuitTeams.$inferSelect;

export type InsertPlayerCircuitTeam = z.infer<typeof insertPlayerCircuitTeamSchema>;
export type PlayerCircuitTeam = typeof playerCircuitTeams.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertRanking = z.infer<typeof insertRankingSchema>;
export type Ranking = typeof rankings.$inferSelect;

export type InsertSchoolRanking = z.infer<typeof insertSchoolRankingSchema>;
export type SchoolRanking = typeof schoolRankings.$inferSelect;
