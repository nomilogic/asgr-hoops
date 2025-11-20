import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { uploadPlayerImage, uploadCollegeLogo } from "./supabase-storage";
import { authenticateToken, requireAdmin, hashPassword, comparePassword, signToken } from "./auth";
import { signupSchema, loginSchema, insertPlayerSchema, insertHighSchoolSchema, insertCircuitTeamSchema, insertCollegeSchema, insertProductSchema, insertUserSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validation = signupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }

      const { email, password, firstName, lastName } = validation.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user' // Default role
      });

      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      res.json({ user, token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const { email, password } = validation.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  app.get('/api/auth/user', authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Player routes
  app.get("/api/players", async (_req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/year/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ error: "Invalid year parameter" });
      }
      const players = await storage.getPlayersByGradYear(year);
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      const player = await storage.getPlayerById(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  // High School routes
  app.get("/api/high-schools", async (_req, res) => {
    try {
      const schools = await storage.getAllHighSchools();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch high schools" });
    }
  });

  app.get("/api/high-schools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid high school ID" });
      }
      const school = await storage.getHighSchoolById(id);
      if (!school) {
        return res.status(404).json({ error: "High school not found" });
      }
      res.json(school);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch high school" });
    }
  });

  // Circuit team routes
  app.get("/api/circuit-teams", async (_req, res) => {
    try {
      const teams = await storage.getAllCircuitTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch circuit teams" });
    }
  });

  app.get("/api/circuit-teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid circuit team ID" });
      }
      const team = await storage.getCircuitTeamById(id);
      if (!team) {
        return res.status(404).json({ error: "Circuit team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch circuit team" });
    }
  });

  // College routes
  app.get("/api/colleges", async (_req, res) => {
    try {
      const colleges = await storage.getAllColleges();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid college ID" });
      }
      const college = await storage.getCollegeById(id);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch college" });
    }
  });

  // Image Upload endpoints
  app.post("/api/upload/player-image/:playerId", upload.single('image'), async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const result = await uploadPlayerImage(
        playerId,
        req.file.buffer,
        req.file.originalname
      );

      // Update player with new image path
      await storage.updatePlayer(playerId, { imagePath: result.path });

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/upload/college-logo", upload.single('image'), async (req, res) => {
    try {
      const { collegeId } = req.body; // Assuming collegeId is sent in the body

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      if (!collegeId) {
        return res.status(400).json({ error: "College ID is required" });
      }

      const college = await storage.getCollegeById(parseInt(collegeId));
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }

      const result = await uploadCollegeLogo(
        college.name, // Use college name for storage key if needed
        req.file.buffer,
        req.file.originalname
      );

      // Update college with new logo path
      await storage.updateCollege(parseInt(collegeId), { logoPath: result.path });

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // New Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // ===== ADMIN ROUTES =====
  // Admin - Players Management
  app.post("/api/admin/players", requireAdmin, async (req, res) => {
    try {
      const validation = insertPlayerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }
      const player = await storage.createPlayer(validation.data);
      res.json(player);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Failed to create player" });
    }
  });

  app.patch("/api/admin/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      const validation = insertPlayerSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid player data", details: validation.error });
      }
      const player = await storage.updatePlayer(id, validation.data);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  app.delete("/api/admin/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      await storage.deletePlayer(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  });

  // Admin - High Schools Management
  app.post("/api/admin/high-schools", requireAdmin, async (req, res) => {
    try {
      const validation = insertHighSchoolSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }
      const school = await storage.createHighSchool(validation.data);
      res.json(school);
    } catch (error) {
      console.error("Error creating high school:", error);
      res.status(500).json({ error: "Failed to create high school" });
    }
  });

  app.patch("/api/admin/high-schools/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid high school ID" });
      }
      const validation = insertHighSchoolSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid high school data", details: validation.error });
      }
      const school = await storage.updateHighSchool(id, validation.data);
      if (!school) {
        return res.status(404).json({ error: "High school not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error updating high school:", error);
      res.status(500).json({ error: "Failed to update high school" });
    }
  });

  app.delete("/api/admin/high-schools/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid high school ID" });
      }
      await storage.deleteHighSchool(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting high school:", error);
      res.status(500).json({ error: "Failed to delete high school" });
    }
  });

  // Admin - Circuit Teams Management
  app.post("/api/admin/circuit-teams", requireAdmin, async (req, res) => {
    try {
      const validation = insertCircuitTeamSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }
      const team = await storage.createCircuitTeam(validation.data);
      res.json(team);
    } catch (error) {
      console.error("Error creating circuit team:", error);
      res.status(500).json({ error: "Failed to create circuit team" });
    }
  });

  app.patch("/api/admin/circuit-teams/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid circuit team ID" });
      }
      const validation = insertCircuitTeamSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid circuit team data", details: validation.error });
      }
      const team = await storage.updateCircuitTeam(id, validation.data);
      if (!team) {
        return res.status(404).json({ error: "Circuit team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error updating circuit team:", error);
      res.status(500).json({ error: "Failed to update circuit team" });
    }
  });

  app.delete("/api/admin/circuit-teams/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid circuit team ID" });
      }
      await storage.deleteCircuitTeam(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting circuit team:", error);
      res.status(500).json({ error: "Failed to delete circuit team" });
    }
  });

  // Admin - Colleges Management
  app.post("/api/admin/colleges", requireAdmin, async (req, res) => {
    try {
      const validation = insertCollegeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }
      // Check if college with the same name already exists (optional, depends on requirements)
      const existingCollege = await storage.getCollegeByName(validation.data.name);
      if (existingCollege) {
        return res.status(400).json({ error: "College with this name already exists" });
      }

      const college = await storage.createCollege(validation.data);
      res.json(college);
    } catch (error) {
      console.error("Error creating college:", error);
      res.status(500).json({ error: "Failed to create college" });
    }
  });

  app.patch("/api/admin/colleges/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid college ID" });
      }
      const validation = insertCollegeSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid college data", details: validation.error });
      }

      // If name is being updated, check for duplicates
      if (validation.data.name) {
        const existingCollege = await storage.getCollegeByName(validation.data.name);
        if (existingCollege && existingCollege.id !== id) {
          return res.status(400).json({ error: "College with this name already exists" });
        }
      }

      const college = await storage.updateCollege(id, validation.data);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }
      res.json(college);
    } catch (error) {
      console.error("Error updating college:", error);
      res.status(500).json({ error: "Failed to update college" });
    }
  });

  app.delete("/api/admin/colleges/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid college ID" });
      }
      await storage.deleteCollege(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting college:", error);
      res.status(500).json({ error: "Failed to delete college" });
    }
  });

  // Admin - Products Management
  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const validation = insertProductSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid input", details: validation.error });
      }
      const product = await storage.createProduct(validation.data);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const validation = insertProductSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid product data", details: validation.error });
      }
      const product = await storage.updateProduct(id, validation.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin - Users Management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validation = insertUserSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid user data", details: validation.error });
      }

      const updateData = validation.data;
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Public stats endpoint for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPublicStats();
      // Replace 350 with 750
      const modifiedStats = {
        ...stats,
        someValue: stats.someValue === 350 ? 750 : stats.someValue,
        anotherValue: stats.anotherValue === 350 ? 750 : stats.anotherValue,
      };
      res.json(modifiedStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin - Dashboard Stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getPublicStats();
      // Replace 350 with 750
      const modifiedStats = {
        ...stats,
        someValue: stats.someValue === 350 ? 750 : stats.someValue,
        anotherValue: stats.anotherValue === 350 ? 750 : stats.anotherValue,
      };
      res.json(modifiedStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin - Upload Player Image
  app.post("/api/admin/players/:id/image", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const result = await uploadPlayerImage(
        id,
        req.file.buffer,
        req.file.originalname
      );

      // Update player with new image path
      await storage.updatePlayer(id, { imagePath: result.path });

      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("Error uploading player image:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Upload College Logo
  app.post("/api/admin/colleges/:id/logo", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid college ID" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const college = await storage.getCollegeById(id);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }

      const result = await uploadCollegeLogo(
        college.name,
        req.file.buffer,
        req.file.originalname
      );

      // Update college with new logo path
      await storage.updateCollege(id, { logoPath: result.path });

      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("Error uploading college logo:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Upload High School Logo
  app.post("/api/admin/high-schools/:id/logo", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid high school ID" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const school = await storage.getHighSchoolById(id);
      if (!school) {
        return res.status(404).json({ error: "High school not found" });
      }

      const fileExt = req.file.originalname.split('.').pop();
      const sanitizedName = school.school.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filePath = `high-schools/${sanitizedName}.${fileExt}`;

      const { createClient } = await import('@supabase/supabase-js');
      const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Missing Supabase credentials');
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'asgr-images';

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, req.file.buffer, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload high school logo: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // Update high school with new logo path
      await storage.updateHighSchool(id, { logoPath: filePath });

      res.json({ success: true, url: urlData.publicUrl, path: filePath });
    } catch (error: any) {
      console.error("Error uploading high school logo:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}