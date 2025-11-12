CREATE TABLE "circuit_teams" (
	"id" bigint PRIMARY KEY NOT NULL,
	"team" text NOT NULL,
	"circuit" text,
	"ranks" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"records" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"key_wins" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"placements" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_urls" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colleges" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo_path" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "high_schools" (
	"id" bigint PRIMARY KEY NOT NULL,
	"school" text NOT NULL,
	"logo_path" text,
	"ranks" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"records" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"key_wins" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_urls" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rank" integer,
	"grade_year" integer,
	"position" text,
	"height" text,
	"high_school" text,
	"high_school_id" bigint,
	"circuit_program" text,
	"circuit_team_id" bigint,
	"state" text,
	"committed_college" text,
	"committed_college_id" bigint,
	"rating" integer,
	"rating_comment" text,
	"image_path" text,
	"college_logo_path" text,
	"source_url" text,
	"ranks" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ratings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"positions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"heights" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"high_schools" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"circuit_programs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"committed_colleges" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_urls" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"category" text,
	"features" text[] DEFAULT '{}' NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");