

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."employment_type" AS ENUM (
    'Full-time',
    'Part-time',
    'Internship',
    'Contract',
    'Seasonal',
    'Freelance',
    'Self-employed'
);


ALTER TYPE "public"."employment_type" OWNER TO "postgres";


CREATE TYPE "public"."location_type" AS ENUM (
    'Remote',
    'On-site',
    'Hybrid'
);


ALTER TYPE "public"."location_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, vanity_url)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'vanity_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."connections" (
    "id" integer NOT NULL,
    "user_id_1" "uuid" NOT NULL,
    "user_id_2" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "user_id_min" "uuid" GENERATED ALWAYS AS (LEAST("user_id_1", "user_id_2")) STORED,
    "user_id_max" "uuid" GENERATED ALWAYS AS (GREATEST("user_id_1", "user_id_2")) STORED,
    CONSTRAINT "connections_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text"])))
);


ALTER TABLE "public"."connections" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."connections_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."connections_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."connections_id_seq" OWNED BY "public"."connections"."id";



CREATE TABLE IF NOT EXISTS "public"."profile_experiences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "company_name" "text" DEFAULT ''::"text" NOT NULL,
    "location" "text" DEFAULT ''::"text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "employment_type" "public"."employment_type" DEFAULT 'Full-time'::"public"."employment_type" NOT NULL,
    "active_role" boolean DEFAULT true NOT NULL,
    "location_type" "public"."location_type" DEFAULT 'On-site'::"public"."location_type" NOT NULL,
    CONSTRAINT "profile_experiences_company_name_check" CHECK (("length"("company_name") < 120)),
    CONSTRAINT "profile_experiences_description_check" CHECK (("length"("description") < 2000)),
    CONSTRAINT "profile_experiences_location_check" CHECK (("length"("location") < 120)),
    CONSTRAINT "profile_experiences_title_check" CHECK (("length"("title") < 120))
);


ALTER TABLE "public"."profile_experiences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text" DEFAULT ''::"text" NOT NULL,
    "last_name" "text" DEFAULT ''::"text" NOT NULL,
    "headline" "text" DEFAULT ''::"text" NOT NULL,
    "about" "text" DEFAULT ''::"text" NOT NULL,
    "banner_url" "text",
    "picture_url" "text",
    "vanity_url" "text" DEFAULT ''::"text" NOT NULL,
    "public_email" "text" DEFAULT ''::"text" NOT NULL,
    "public_phone_number" "text" DEFAULT ''::"text" NOT NULL,
    "public_website_url" "text" DEFAULT ''::"text" NOT NULL,
    CONSTRAINT "profiles_about_check" CHECK (("length"("about") < 2600)),
    CONSTRAINT "profiles_banner_url_check" CHECK (("banner_url" ~ '^http?:\/\/(www\.)?([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})(:[0-9]+)?\/[-a-zA-Z0-9@:%_\+.~#?&//=]*$'::"text")),
    CONSTRAINT "profiles_headline_check" CHECK (("length"("headline") < 120)),
    CONSTRAINT "profiles_picture_url_check" CHECK (("picture_url" ~ '^http?:\/\/(www\.)?([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})(:[0-9]+)?\/[-a-zA-Z0-9@:%_\+.~#?&//=]*$'::"text")),
    CONSTRAINT "profiles_public_email_check" CHECK (("length"("public_email") < 256)),
    CONSTRAINT "profiles_public_phone_number_check" CHECK (("length"("public_phone_number") < 50)),
    CONSTRAINT "profiles_public_website_url_check" CHECK (("public_website_url" ~ '^(https?:\/\/[^\s"]+)?$'::"text"))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."connections" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."connections_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."connections"
    ADD CONSTRAINT "connections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_experiences"
    ADD CONSTRAINT "profile_experiences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_vanity_url_key" UNIQUE ("vanity_url");



ALTER TABLE ONLY "public"."connections"
    ADD CONSTRAINT "user_pair_unique_symmetric" UNIQUE ("user_id_min", "user_id_max");



CREATE INDEX "idx_connections_user_ids" ON "public"."connections" USING "btree" ("user_id_1", "user_id_2");



ALTER TABLE ONLY "public"."connections"
    ADD CONSTRAINT "connections_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."connections"
    ADD CONSTRAINT "connections_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_experiences"
    ADD CONSTRAINT "profile_experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow users to create connection requests" ON "public"."connections" FOR INSERT WITH CHECK (("user_id_1" = "auth"."uid"()));



CREATE POLICY "Allow users to modify their connection requests" ON "public"."connections" FOR UPDATE USING ((("user_id_1" = "auth"."uid"()) OR ("user_id_2" = "auth"."uid"())));



CREATE POLICY "Allow users to remove their own connections" ON "public"."connections" FOR DELETE USING ((("user_id_1" = "auth"."uid"()) OR ("user_id_2" = "auth"."uid"())));



CREATE POLICY "Allow users to view their connections" ON "public"."connections" FOR SELECT USING ((("user_id_1" = "auth"."uid"()) OR ("user_id_2" = "auth"."uid"())));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."profile_experiences" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."profile_experiences" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."profile_experiences" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on id" ON "public"."profiles" FOR UPDATE USING (( SELECT ("auth"."uid"() = "profiles"."id"))) WITH CHECK (( SELECT ("auth"."uid"() = "profiles"."id")));



CREATE POLICY "Enable update for users based on user_id" ON "public"."profile_experiences" FOR UPDATE USING (( SELECT ("auth"."uid"() = "profile_experiences"."user_id"))) WITH CHECK (( SELECT ("auth"."uid"() = "profile_experiences"."user_id")));



ALTER TABLE "public"."connections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_experiences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."connections" TO "anon";
GRANT ALL ON TABLE "public"."connections" TO "authenticated";
GRANT ALL ON TABLE "public"."connections" TO "service_role";



GRANT ALL ON SEQUENCE "public"."connections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."connections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."connections_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile_experiences" TO "anon";
GRANT ALL ON TABLE "public"."profile_experiences" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_experiences" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE POLICY "Give authenticated users access to their own private folder" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'Media'::"text") AND (("storage"."foldername"("name"))[1] = ( SELECT ("auth"."uid"())::"text" AS "uid"))));



