import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  type Player,
  type InsertPlayer,
  type HighSchool,
  type InsertHighSchool,
  type CircuitTeam,
  type InsertCircuitTeam,
  type College,
  type InsertCollege,
  players,
  highSchools,
  circuitTeams,
  colleges,
} from "@shared/schema";

const SUPABASE_STORAGE_URL = "https://uelszdsseveljfccszga.supabase.co/storage/v1/object/public/asgr/";

function addStoragePrefix(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return SUPABASE_STORAGE_URL + path;
}

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayersByGradYear(gradYear: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  bulkCreatePlayers(players: InsertPlayer[]): Promise<void>;
  
  getAllHighSchools(): Promise<HighSchool[]>;
  getHighSchoolById(id: number): Promise<HighSchool | undefined>;
  createHighSchool(school: InsertHighSchool): Promise<HighSchool>;
  
  getAllCircuitTeams(): Promise<CircuitTeam[]>;
  getCircuitTeamById(id: number): Promise<CircuitTeam | undefined>;
  createCircuitTeam(team: InsertCircuitTeam): Promise<CircuitTeam>;
  
  getAllColleges(): Promise<College[]>;
  getCollegeById(id: number): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;
}

export class DbStorage implements IStorage {
  async getAllPlayers(): Promise<Player[]> {
    const result = await db.select().from(players);
    return result.map(player => ({
      ...player,
      photoUrl: addStoragePrefix(player.photoUrl),
      imagePath: addStoragePrefix(player.imagePath)
    }));
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      photoUrl: addStoragePrefix(result[0].photoUrl),
      imagePath: addStoragePrefix(result[0].imagePath)
    };
  }

  async getPlayersByGradYear(gradYear: number): Promise<Player[]> {
    const result = await db.select().from(players).where(eq(players.gradeYear, gradYear));
    return result.map(player => ({
      ...player,
      photoUrl: addStoragePrefix(player.photoUrl),
      imagePath: addStoragePrefix(player.imagePath)
    }));
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(player).returning();
    return result[0];
  }

  async bulkCreatePlayers(playersData: InsertPlayer[]): Promise<void> {
    if (playersData.length === 0) return;
    await db.insert(players).values(playersData);
  }

  async getAllHighSchools(): Promise<HighSchool[]> {
    const result = await db.select().from(highSchools);
    return result.map(school => ({
      ...school,
      logoPath: addStoragePrefix(school.logoPath),
      logoUrl: addStoragePrefix(school.logoUrl)
    }));
  }

  async getHighSchoolById(id: number): Promise<HighSchool | undefined> {
    const result = await db.select().from(highSchools).where(eq(highSchools.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      logoPath: addStoragePrefix(result[0].logoPath),
      logoUrl: addStoragePrefix(result[0].logoUrl)
    };
  }

  async createHighSchool(school: InsertHighSchool): Promise<HighSchool> {
    const result = await db.insert(highSchools).values(school).returning();
    return result[0];
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

  async getAllColleges(): Promise<College[]> {
    const result = await db.select().from(colleges);
    return result.map(college => ({
      ...college,
      logoPath: addStoragePrefix(college.logoPath),
      logoUrl: addStoragePrefix(college.logoUrl)
    }));
  }

  async getCollegeById(id: number): Promise<College | undefined> {
    const result = await db.select().from(colleges).where(eq(colleges.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      logoPath: addStoragePrefix(result[0].logoPath),
      logoUrl: addStoragePrefix(result[0].logoUrl)
    };
  }

  async createCollege(college: InsertCollege): Promise<College> {
    const result = await db.insert(colleges).values(college).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
