import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // School routes
  app.get("/api/schools", async (_req, res) => {
    try {
      const schools = await storage.getAllSchools();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schools" });
    }
  });

  app.get("/api/schools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid school ID" });
      }
      const school = await storage.getSchoolById(id);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch school" });
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

  // Player circuit teams routes
  app.get("/api/player-circuit-teams", async (_req, res) => {
    try {
      const relationships = await storage.getAllPlayerCircuitTeams();
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player circuit teams" });
    }
  });

  app.get("/api/player-circuit-teams/player/:playerId", async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);
      if (isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      const relationships = await storage.getPlayerCircuitTeamsByPlayerId(playerId);
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player circuit teams" });
    }
  });

  // Events routes
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      const event = await storage.getEventById(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Rankings routes
  app.get("/api/rankings", async (_req, res) => {
    try {
      const rankings = await storage.getAllRankings();
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  });

  app.get("/api/rankings/player/:playerId", async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);
      if (isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      const rankings = await storage.getRankingsByPlayerId(playerId);
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player rankings" });
    }
  });

  app.get("/api/rankings/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const rankings = await storage.getRankingsByType(type, year);
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings by type" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
