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
  type Product,
  type InsertProduct,
  type User,
  type UserWithPassword,
  type InsertUser,
  players,
  highSchools,
  circuitTeams,
  colleges,
  products,
  users,
} from "@shared/schema";

const SUPABASE_STORAGE_URL = "https://uelszdsseveljfccszga.supabase.co/storage/v1/object/public/asgr/";

function addStoragePrefix(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return SUPABASE_STORAGE_URL + path;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserWithPassword(id: string): Promise<UserWithPassword | undefined>;
  getUserByEmail(email: string): Promise<UserWithPassword | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayersByGradYear(gradYear: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  bulkCreatePlayers(players: InsertPlayer[]): Promise<void>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;

  getAllHighSchools(): Promise<HighSchool[]>;
  getHighSchoolById(id: number): Promise<HighSchool | undefined>;
  createHighSchool(school: InsertHighSchool): Promise<HighSchool>;
  updateHighSchool(id: number, school: Partial<InsertHighSchool>): Promise<HighSchool | undefined>;
  deleteHighSchool(id: number): Promise<void>;

  getAllCircuitTeams(): Promise<CircuitTeam[]>;
  getCircuitTeamById(id: number): Promise<CircuitTeam | undefined>;
  createCircuitTeam(team: InsertCircuitTeam): Promise<CircuitTeam>;
  updateCircuitTeam(id: number, team: Partial<InsertCircuitTeam>): Promise<CircuitTeam | undefined>;
  deleteCircuitTeam(id: number): Promise<void>;

  getAllColleges(): Promise<College[]>;
  getCollegeById(id: number): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;
  updateCollege(id: number, college: Partial<InsertCollege>): Promise<College | undefined>;
  deleteCollege(id: number): Promise<void>;

  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  getPublicStats(): Promise<{ playersCount: number; highSchoolsCount: number; circuitTeamsCount: number; collegesCount: number; productsCount: number; usersCount: number }>;
}

export class DbStorage implements IStorage {
  // Assuming 'db' is accessible here, or passed in constructor if it were a class member
  private db = db;

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, id));
    return user;
  }

  async getUserWithPassword(id: string): Promise<UserWithPassword | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);
    return result;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await this.db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async getAllPlayers(): Promise<Player[]> {
    const result = await this.db.select().from(players);
    return result.map(player => ({
      ...player,
      imagePath: addStoragePrefix(player.imagePath),
      collegeLogoPath: addStoragePrefix(player.collegeLogoPath)
    }));
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await this.db.select().from(players).where(eq(players.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      imagePath: addStoragePrefix(result[0].imagePath),
      collegeLogoPath: addStoragePrefix(result[0].collegeLogoPath)
    };
  }

  async getPlayersByGradYear(gradYear: number): Promise<Player[]> {
    const result = await this.db.select().from(players).where(eq(players.gradeYear, gradYear));
    return result.map(player => ({
      ...player,
      imagePath: addStoragePrefix(player.imagePath),
      collegeLogoPath: addStoragePrefix(player.collegeLogoPath)
    }));
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await this.db.insert(players).values(player).returning();
    return result[0];
  }

  async bulkCreatePlayers(playersData: InsertPlayer[]): Promise<void> {
    if (playersData.length === 0) return;
    await this.db.insert(players).values(playersData);
  }

  async updatePlayer(id: number, playerData: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [player] = await this.db
      .update(players)
      .set(playerData)
      .where(eq(players.id, id))
      .returning();
    if (!player) return undefined;
    return {
      ...player,
      imagePath: addStoragePrefix(player.imagePath),
      collegeLogoPath: addStoragePrefix(player.collegeLogoPath)
    };
  }

  async deletePlayer(id: number): Promise<void> {
    await this.db.delete(players).where(eq(players.id, id));
  }

  async getAllHighSchools(): Promise<HighSchool[]> {
    const result = await this.db.select().from(highSchools);
    return result.map(school => ({
      ...school,
      logoPath: addStoragePrefix(school.logoPath)
    }));
  }

  async getHighSchoolById(id: number): Promise<HighSchool | undefined> {
    const result = await this.db.select().from(highSchools).where(eq(highSchools.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      logoPath: addStoragePrefix(result[0].logoPath)
    };
  }

  async createHighSchool(school: InsertHighSchool): Promise<HighSchool> {
    const result = await this.db.insert(highSchools).values(school).returning();
    return result[0];
  }

  async updateHighSchool(id: number, schoolData: Partial<InsertHighSchool>): Promise<HighSchool | undefined> {
    const [school] = await this.db
      .update(highSchools)
      .set(schoolData)
      .where(eq(highSchools.id, id))
      .returning();
    if (!school) return undefined;
    return {
      ...school,
      logoPath: addStoragePrefix(school.logoPath)
    };
  }

  async deleteHighSchool(id: number): Promise<void> {
    await this.db.delete(highSchools).where(eq(highSchools.id, id));
  }

  async getAllCircuitTeams(): Promise<CircuitTeam[]> {
    return await this.db.select().from(circuitTeams);
  }

  async getCircuitTeamById(id: number): Promise<CircuitTeam | undefined> {
    const result = await this.db.select().from(circuitTeams).where(eq(circuitTeams.id, id));
    return result[0];
  }

  async createCircuitTeam(team: InsertCircuitTeam): Promise<CircuitTeam> {
    const result = await this.db.insert(circuitTeams).values(team).returning();
    return result[0];
  }

  async updateCircuitTeam(id: number, teamData: Partial<InsertCircuitTeam>): Promise<CircuitTeam | undefined> {
    const [team] = await this.db
      .update(circuitTeams)
      .set(teamData)
      .where(eq(circuitTeams.id, id))
      .returning();
    return team;
  }

  async deleteCircuitTeam(id: number): Promise<void> {
    await this.db.delete(circuitTeams).where(eq(circuitTeams.id, id));
  }

  async getAllColleges(): Promise<College[]> {
    const result = await this.db.select().from(colleges);
    return result.map(college => ({
      ...college,
      logoPath: addStoragePrefix(college.logoPath),
      logoUrl: addStoragePrefix(college.logoUrl)
    }));
  }

  async getCollegeById(id: number): Promise<College | undefined> {
    const result = await this.db.select().from(colleges).where(eq(colleges.id, id));
    if (!result[0]) return undefined;
    return {
      ...result[0],
      logoPath: addStoragePrefix(result[0].logoPath),
      logoUrl: addStoragePrefix(result[0].logoUrl)
    };
  }

  async createCollege(college: InsertCollege): Promise<College> {
    const result = await this.db.insert(colleges).values(college).returning();
    return result[0];
  }

  async updateCollege(id: number, collegeData: Partial<InsertCollege>): Promise<College | undefined> {
    const [college] = await this.db
      .update(colleges)
      .set(collegeData)
      .where(eq(colleges.id, id))
      .returning();
    if (!college) return undefined;
    return {
      ...college,
      logoPath: addStoragePrefix(college.logoPath),
      logoUrl: addStoragePrefix(college.logoUrl)
    };
  }

  async deleteCollege(id: number): Promise<void> {
    await this.db.delete(colleges).where(eq(colleges.id, id));
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const result = await this.db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await this.db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await this.db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id));
  }

  async getPublicStats(): Promise<{ playersCount: number; highSchoolsCount: number; circuitTeamsCount: number; collegesCount: number; productsCount: number; usersCount: number }> {
    const [playersData, highSchoolsData, circuitTeamsData, collegesData, productsData, usersData] = await Promise.all([
      this.getAllPlayers(),
      this.getAllHighSchools(),
      this.getAllCircuitTeams(),
      this.getAllColleges(),
      this.getAllProducts(),
      this.getAllUsers(),
    ]);

    return {
      playersCount: playersData.length,
      highSchoolsCount: highSchoolsData.length,
      circuitTeamsCount: circuitTeamsData.length,
      collegesCount: collegesData.length,
      productsCount: productsData.length,
      usersCount: usersData.length,
    };
  }
}

export const storage = new DbStorage();