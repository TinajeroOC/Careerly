CREATE TABLE IF NOT EXISTS "public"."connections" (
    "id" SERIAL PRIMARY KEY,
    "user_id_1" UUID NOT NULL,
    "user_id_2" UUID NOT NULL,
    "status" TEXT NOT NULL CHECK ("status" IN ('pending', 'accepted')),
    "created_at" TIMESTAMP DEFAULT now() NOT NULL,
    -- Generated columns for symmetric pair
    "user_id_min" UUID GENERATED ALWAYS AS (LEAST("user_id_1", "user_id_2")) STORED,
    "user_id_max" UUID GENERATED ALWAYS AS (GREATEST("user_id_1", "user_id_2")) STORED,
    CONSTRAINT "connections_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "auth"."users" ("id") ON DELETE CASCADE,
    CONSTRAINT "connections_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "auth"."users" ("id") ON DELETE CASCADE,
    -- Unique constraint on the symmetric pair
    CONSTRAINT "user_pair_unique_symmetric" UNIQUE ("user_id_min", "user_id_max")
);

-- Index to speed up queries
CREATE INDEX "idx_connections_user_ids" ON "public"."connections" (user_id_1, user_id_2);

-- Enable row level security
ALTER TABLE "public"."connections" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow users to view their connections" 
ON "public"."connections" 
FOR SELECT 
USING ("user_id_1" = auth.uid() OR "user_id_2" = auth.uid());

CREATE POLICY "Allow users to modify their connection requests" 
ON "public"."connections" 
FOR UPDATE 
USING ("user_id_1" = auth.uid() OR "user_id_2" = auth.uid());

CREATE POLICY "Allow users to create connection requests"
ON "public"."connections"
FOR INSERT
WITH CHECK ("user_id_1" = auth.uid());

CREATE POLICY "Allow users to remove their own connections"
ON "public"."connections"
FOR DELETE
USING ("user_id_1" = auth.uid() OR "user_id_2" = auth.uid());
