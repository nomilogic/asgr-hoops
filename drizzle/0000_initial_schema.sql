
-- Create schools table
CREATE TABLE IF NOT EXISTS "schools" (
  "id" SERIAL PRIMARY KEY,
  "school_name" TEXT NOT NULL,
  "clean_name" TEXT,
  "city" TEXT,
  "state" TEXT,
  "category" TEXT
);

-- Create players table
CREATE TABLE IF NOT EXISTS "players" (
  "id" SERIAL PRIMARY KEY,
  "old_id" TEXT,
  "name" TEXT NOT NULL,
  "rank_number" INTEGER,
  "position" TEXT,
  "height_raw" TEXT,
  "height_feet" INTEGER,
  "height_inches" INTEGER,
  "height_formatted" TEXT,
  "school" TEXT,
  "city" TEXT,
  "state" TEXT,
  "grad_year" INTEGER,
  "committed_to" TEXT,
  "previous_school" TEXT,
  "twitter" TEXT,
  "school_id" INTEGER,
  "school_clean" TEXT,
  "school_type" TEXT,
  "image_url" TEXT,
  "circuit_program" TEXT
);

-- Create circuit_teams table
CREATE TABLE IF NOT EXISTS "circuit_teams" (
  "id" SERIAL PRIMARY KEY,
  "team_name" TEXT NOT NULL,
  "state" TEXT
);

-- Create player_circuit_teams table
CREATE TABLE IF NOT EXISTS "player_circuit_teams" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER NOT NULL,
  "circuit_team_id" INTEGER,
  "event_index" INTEGER,
  "team_index" INTEGER,
  "wins" INTEGER,
  "losses" INTEGER
);

-- Create events table
CREATE TABLE IF NOT EXISTS "events" (
  "id" SERIAL PRIMARY KEY,
  "event_name" TEXT NOT NULL,
  "event_date" TEXT,
  "location" TEXT,
  "description" TEXT,
  "image_url" TEXT
);

-- Create rankings table
CREATE TABLE IF NOT EXISTS "rankings" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER NOT NULL,
  "rank_type" TEXT NOT NULL,
  "rank" INTEGER NOT NULL,
  "year" INTEGER,
  "rating" INTEGER,
  "rating_description" TEXT
);

-- Create school_rankings table
CREATE TABLE IF NOT EXISTS "school_rankings" (
  "id" SERIAL PRIMARY KEY,
  "rank" INTEGER NOT NULL,
  "school_name" TEXT NOT NULL,
  "school_state" TEXT,
  "logo_url" TEXT,
  "wins" INTEGER,
  "losses" INTEGER,
  "key_wins" TEXT,
  "season" TEXT NOT NULL
);
