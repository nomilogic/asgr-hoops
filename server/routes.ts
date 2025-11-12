import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { uploadPlayerImage, uploadCollegeLogo } from "./supabase-storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Player routes
  app.get("/api/players", isAuthenticated, async (_req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/year/:year", isAuthenticated, async (req, res) => {
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
  app.get("/api/high-schools", isAuthenticated, async (_req, res) => {
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
  app.get("/api/circuit-teams", isAuthenticated, async (_req, res) => {
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

      // Image URL update would happen separately via API if needed

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/upload/college-logo", upload.single('image'), async (req, res) => {
    try {
      const { collegeName } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      if (!collegeName) {
        return res.status(400).json({ error: "College name is required" });
      }

      const result = await uploadCollegeLogo(
        collegeName,
        req.file.buffer,
        req.file.originalname
      );

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // New Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts(); // Assuming storage has getAllProducts
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
      const product = await storage.getProductById(id); // Assuming storage has getProductById
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}