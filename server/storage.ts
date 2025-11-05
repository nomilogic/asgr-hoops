import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  type School,
  type InsertSchool,
  type Player,
  type InsertPlayer,
  type CircuitTeam,
  type InsertCircuitTeam,
  type PlayerCircuitTeam,
  type InsertPlayerCircuitTeam,
  type Event,
  type InsertEvent,
  type Ranking,
  type InsertRanking,
  schools,
  players,
  circuitTeams,
  playerCircuitTeams,
  events,
  rankings,
} from "@shared/schema";

export interface IStorage {
  getAllSchools(): Promise<School[]>;
  getSchoolById(id: number): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayersByGradYear(gradYear: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  bulkCreatePlayers(players: InsertPlayer[]): Promise<void>;
  
  getAllCircuitTeams(): Promise<CircuitTeam[]>;
  getCircuitTeamById(id: number): Promise<CircuitTeam | undefined>;
  createCircuitTeam(team: InsertCircuitTeam): Promise<CircuitTeam>;
  
  getAllPlayerCircuitTeams(): Promise<PlayerCircuitTeam[]>;
  getPlayerCircuitTeamsByPlayerId(playerId: number): Promise<PlayerCircuitTeam[]>;
  createPlayerCircuitTeam(pct: InsertPlayerCircuitTeam): Promise<PlayerCircuitTeam>;
  
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  getAllRankings(): Promise<Ranking[]>;
  getRankingsByPlayerId(playerId: number): Promise<Ranking[]>;
  getRankingsByType(rankType: string, year?: number): Promise<Ranking[]>;
  createRanking(ranking: InsertRanking): Promise<Ranking>;
}

export class DbStorage implements IStorage {
  async getAllSchools(): Promise<School[]> {
    return await db.select().from(schools);
  }

  async getSchoolById(id: number): Promise<School | undefined> {
    const result = await db.select().from(schools).where(eq(schools.id, id));
    return result[0];
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const result = await db.insert(schools).values(school).returning();
    return result[0];
  }

  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayersByGradYear(gradYear: number): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.gradYear, gradYear));
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(player).returning();
    return result[0];
  }

  async bulkCreatePlayers(playersData: InsertPlayer[]): Promise<void> {
    if (playersData.length === 0) return;
    await db.insert(players).values(playersData);
  }

  async getAllCircuitTeams(): Promise<CircuitTeam[]> {
    return await db.select().from(circuitTeams);
  }

  async getCircuitTeamById(id: number): Promise<CircuitTeam | undefined> {
    const result = await db.select().from(circuitTeams).where(eq(circuitTeams.id, id));
    return result[0];
  }

  async createCircuitTeam(team: InsertCircuitTeam): Promise<CircuitTeam> {
    const result = await db.insert(circuitTeams).values(team).returning();
    return result[0];
  }

  async getAllPlayerCircuitTeams(): Promise<PlayerCircuitTeam[]> {
    return await db.select().from(playerCircuitTeams);
  }

  async getPlayerCircuitTeamsByPlayerId(playerId: number): Promise<PlayerCircuitTeam[]> {
    return await db.select().from(playerCircuitTeams).where(eq(playerCircuitTeams.playerId, playerId));
  }

  async createPlayerCircuitTeam(pct: InsertPlayerCircuitTeam): Promise<PlayerCircuitTeam> {
    const result = await db.insert(playerCircuitTeams).values(pct).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async getAllRankings(): Promise<Ranking[]> {
    return await db.select().from(rankings);
  }

  async getRankingsByPlayerId(playerId: number): Promise<Ranking[]> {
    return await db.select().from(rankings).where(eq(rankings.playerId, playerId));
  }

  async getRankingsByType(rankType: string, year?: number): Promise<Ranking[]> {
    if (year) {
      return await db.select().from(rankings)
        .where(eq(rankings.rankType, rankType))
        .where(eq(rankings.year, year));
    }
    return await db.select().from(rankings).where(eq(rankings.rankType, rankType));
  }

  async createRanking(ranking: InsertRanking): Promise<Ranking> {
    const result = await db.insert(rankings).values(ranking).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
