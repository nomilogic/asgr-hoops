
CREATE TABLE IF NOT EXISTS "products" (
  "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text NOT NULL,
  "price" integer NOT NULL,
  "category" text,
  "features" text[] NOT NULL DEFAULT '{}',
  "image_url" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
