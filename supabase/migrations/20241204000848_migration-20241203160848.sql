alter table "public"."profiles" add column "vanity_url" text not null default ''::text;

CREATE UNIQUE INDEX profiles_vanity_url_key ON public.profiles USING btree (vanity_url);

alter table "public"."profiles" add constraint "profiles_vanity_url_key" UNIQUE using index "profiles_vanity_url_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, first_name, last_name, vanity_url)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'vanity_url');
  return new;
end;
$function$
;



