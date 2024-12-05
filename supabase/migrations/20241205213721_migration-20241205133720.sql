alter table "public"."profiles" add column "public_email" text not null default ''::text;

alter table "public"."profiles" add column "public_phone_number" text not null default ''::text;

alter table "public"."profiles" add column "public_website_url" text not null default ''::text;

alter table "public"."profiles" add constraint "profiles_public_email_check" CHECK ((length(public_email) < 256)) not valid;

alter table "public"."profiles" validate constraint "profiles_public_email_check";

alter table "public"."profiles" add constraint "profiles_public_phone_number_check" CHECK ((length(public_phone_number) < 50)) not valid;

alter table "public"."profiles" validate constraint "profiles_public_phone_number_check";

alter table "public"."profiles" add constraint "profiles_public_website_url_check" CHECK ((public_website_url ~ '^(https?:\/\/[^\s"]+)?$'::text)) not valid;

alter table "public"."profiles" validate constraint "profiles_public_website_url_check";



