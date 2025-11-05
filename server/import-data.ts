import { db } from "./db";
import { players, schools, circuitTeams, playerCircuitTeams } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

interface PlayerCSVRow {
  old_id: string;
  name: string;
  rank_number: string;
  position: string;
  height_raw: string;
  height_feet: string;
  height_inches: string;
  school: string;
  city: string;
  state: string;
  grad_year: string;
  committed_to: string;
  previous_school: string;
  twitter: string;
  height_formatted: string;
  school_id: string;
  school_clean: string;
  school_type: string;
  image_url: string;
}

interface WorkSchoolCSVRow {
  school: string;
  clean_name: string;
  clean_city: string;
  clean_state: string;
  category: string;
}

interface CircuitTeamCSVRow {
  id: string;
  player_id: string;
  event_index: string;
  team_index: string;
  team_name: string;
  wins: string;
  losses: string;
  state: string;
}

async function importData() {
  console.log("Starting data import...");

  try {
    // Import schools from work_schools.csv
    const workSchoolsPath = path.join(process.cwd(), "attached_assets", "work_schools_1762373029760.csv");
    const workSchoolsContent = fs.readFileSync(workSchoolsPath, "utf-8");
    const workSchoolsData = parse(workSchoolsContent, {
      columns: true,
      skip_empty_lines: true,
    }) as WorkSchoolCSVRow[];

    console.log(`Importing ${workSchoolsData.length} schools...`);
    
    const schoolsToInsert = workSchoolsData
      .filter(row => row.school && row.school !== "NULL")
      .map(row => ({
        schoolName: row.school,
        cleanName: row.clean_name === "NULL" ? null : row.clean_name,
        city: row.clean_city === "NULL" ? null : row.clean_city,
        state: row.clean_state === "NULL" ? null : row.clean_state,
        category: row.category === "NULL" ? null : row.category,
      }));

    const insertedSchools = await db.insert(schools).values(schoolsToInsert).returning();
    console.log(`Imported ${insertedSchools.length} schools`);

    // Import players from clean_players.csv
    const playersPath = path.join(process.cwd(), "attached_assets", "clean_players_1762373029755.csv");
    const playersContent = fs.readFileSync(playersPath, "utf-8");
    const playersData = parse(playersContent, {
      columns: true,
      skip_empty_lines: true,
    }) as PlayerCSVRow[];

    console.log(`Importing ${playersData.length} players...`);
    
    const safeParseInt = (value: string): number | null => {
      if (!value || value === "NULL") return null;
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    const playersToInsert = playersData
      .filter(row => row.name && row.name !== "NULL" && row.old_id)
      .map(row => ({
        oldId: row.old_id,
        name: row.name,
        rankNumber: safeParseInt(row.rank_number),
        position: row.position === "NULL" ? null : row.position,
        heightRaw: row.height_raw === "NULL" ? null : row.height_raw,
        heightFeet: safeParseInt(row.height_feet),
        heightInches: safeParseInt(row.height_inches),
        heightFormatted: row.height_formatted === "NULL" ? null : row.height_formatted,
        school: row.school === "NULL" ? null : row.school,
        city: row.city === "NULL" ? null : row.city,
        state: row.state === "NULL" ? null : row.state,
        gradYear: safeParseInt(row.grad_year),
        committedTo: row.committed_to === "NULL" ? null : row.committed_to,
        previousSchool: row.previous_school === "NULL" ? null : row.previous_school,
        twitter: row.twitter === "NULL" ? null : row.twitter,
        schoolId: safeParseInt(row.school_id),
        schoolClean: row.school_clean === "NULL" ? null : row.school_clean,
        schoolType: row.school_type === "NULL" ? null : row.school_type,
        imageUrl: row.image_url === "NULL" ? null : row.image_url,
      }));

    const insertedPlayers = await db.insert(players).values(playersToInsert).returning();
    console.log(`Imported ${insertedPlayers.length} players`);

    // Create a map of old_id to new id
    const playerIdMap = new Map<string, number>();
    insertedPlayers.forEach((player, index) => {
      const oldId = playersToInsert[index].oldId;
      if (oldId) {
        playerIdMap.set(oldId, player.id);
      }
    });

    // Import circuit teams and player-circuit team relationships
    const circuitTeamsPath = path.join(process.cwd(), "attached_assets", "players_circuit_teams_1762373029759.csv");
    const circuitTeamsContent = fs.readFileSync(circuitTeamsPath, "utf-8");
    const circuitTeamsData = parse(circuitTeamsContent, {
      columns: true,
      skip_empty_lines: true,
    }) as CircuitTeamCSVRow[];

    console.log(`Processing ${circuitTeamsData.length} circuit team relationships...`);
    
    // Get unique team names
    const teamMap = new Map<string, { teamName: string; state: string | null }>();
    circuitTeamsData
      .filter(row => row.team_name && row.team_name !== "NULL")
      .forEach(row => {
        if (!teamMap.has(row.team_name)) {
          teamMap.set(row.team_name, {
            teamName: row.team_name,
            state: row.state === "NULL" ? null : row.state
          });
        }
      });

    const circuitTeamsToInsert = Array.from(teamMap.values());
    const insertedCircuitTeams = await db.insert(circuitTeams).values(circuitTeamsToInsert).returning();
    console.log(`Imported ${insertedCircuitTeams.length} circuit teams`);

    // Create map of team name to id
    const circuitTeamMap = new Map<string, number>();
    insertedCircuitTeams.forEach(team => {
      circuitTeamMap.set(team.teamName, team.id);
    });

    // Create player-circuit team relationships
    const playerCircuitTeamsToInsert = circuitTeamsData
      .filter(row => row.team_name && row.team_name !== "NULL" && row.player_id)
      .map(row => {
        const playerId = playerIdMap.get(row.player_id);
        const circuitTeamId = circuitTeamMap.get(row.team_name);
        
        if (!playerId || !circuitTeamId) return null;
        
        return {
          playerId: playerId,
          circuitTeamId: circuitTeamId,
          eventIndex: safeParseInt(row.event_index),
          teamIndex: safeParseInt(row.team_index),
          wins: safeParseInt(row.wins),
          losses: safeParseInt(row.losses),
        };
      })
      .filter(item => item !== null);

    if (playerCircuitTeamsToInsert.length > 0) {
      await db.insert(playerCircuitTeams).values(playerCircuitTeamsToInsert);
      console.log(`Created ${playerCircuitTeamsToInsert.length} player-circuit team relationships`);
    }

    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}

importData();
