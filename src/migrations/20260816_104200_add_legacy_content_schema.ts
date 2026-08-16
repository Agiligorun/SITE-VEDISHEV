import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__posts_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_practice_areas_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__practice_areas_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_services_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__services_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_cases_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__cases_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_publications_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__publications_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_books_full_text_status" AS ENUM('unknown', 'unavailable', 'catalog-only', 'reading-room', 'available-online');
  CREATE TYPE "public"."enum_books_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__books_v_version_full_text_status" AS ENUM('unknown', 'unavailable', 'catalog-only', 'reading-room', 'available-online');
  CREATE TYPE "public"."enum__books_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum_videos_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TYPE "public"."enum__videos_v_version_source_type" AS ENUM('legacy-site', 'official-site', 'library-catalog', 'media', 'editorial');
  CREATE TABLE "pages_blocks_books_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_books_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "publications" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "publications" ALTER COLUMN "type" SET DEFAULT 'professional'::text;
  DROP TYPE "public"."enum_publications_type";
  CREATE TYPE "public"."enum_publications_type" AS ENUM('academic', 'professional', 'media', 'interview', 'commentary', 'conference', 'other');
  ALTER TABLE "publications" ALTER COLUMN "type" SET DEFAULT 'professional'::"public"."enum_publications_type";
  ALTER TABLE "publications" ALTER COLUMN "type" SET DATA TYPE "public"."enum_publications_type" USING "type"::"public"."enum_publications_type";
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DEFAULT 'professional'::text;
  DROP TYPE "public"."enum__publications_v_version_type";
  CREATE TYPE "public"."enum__publications_v_version_type" AS ENUM('academic', 'professional', 'media', 'interview', 'commentary', 'conference', 'other');
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DEFAULT 'professional'::"public"."enum__publications_v_version_type";
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__publications_v_version_type" USING "version_type"::"public"."enum__publications_v_version_type";
  ALTER TABLE "pages_rels" ADD COLUMN "books_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "books_id" integer;
  ALTER TABLE "posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "posts" ADD COLUMN "author_name" varchar DEFAULT 'Николай Павлович Ведищев';
  ALTER TABLE "posts" ADD COLUMN "source_type" "enum_posts_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "posts" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "posts" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "posts_rels" ADD COLUMN "practice_areas_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_author_name" varchar DEFAULT 'Николай Павлович Ведищев';
  ALTER TABLE "_posts_v" ADD COLUMN "version_source_type" "enum__posts_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "practice_areas_id" integer;
  ALTER TABLE "practice_areas" ADD COLUMN "source_type" "enum_practice_areas_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "practice_areas" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "practice_areas" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "practice_areas" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "practice_areas" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "practice_areas" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_source_type" "enum__practice_areas_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_practice_areas_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "services" ADD COLUMN "source_type" "enum_services_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "services" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "services" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "services" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "services" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_source_type" "enum__services_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_services_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_services_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_services_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "cases" ADD COLUMN "case_category" varchar;
  ALTER TABLE "cases" ADD COLUMN "decision_date" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "procedural_issue" varchar;
  ALTER TABLE "cases" ADD COLUMN "related_publication_id" integer;
  ALTER TABLE "cases" ADD COLUMN "source_type" "enum_cases_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "cases" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "cases" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "cases" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "cases" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "cases" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_case_category" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_decision_date" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_procedural_issue" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_related_publication_id" integer;
  ALTER TABLE "_cases_v" ADD COLUMN "version_source_type" "enum__cases_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_cases_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_cases_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_cases_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "publications" ADD COLUMN "authors" varchar DEFAULT 'Н. П. Ведищев';
  ALTER TABLE "publications" ADD COLUMN "issue" varchar;
  ALTER TABLE "publications" ADD COLUMN "page_range" varchar;
  ALTER TABLE "publications" ADD COLUMN "source_type" "enum_publications_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "publications" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "publications" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "publications" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "publications" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "publications" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_authors" varchar DEFAULT 'Н. П. Ведищев';
  ALTER TABLE "_publications_v" ADD COLUMN "version_issue" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_page_range" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_source_type" "enum__publications_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_publications_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_publications_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_publications_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "books" ADD COLUMN "authors" varchar DEFAULT 'Н. П. Ведищев';
  ALTER TABLE "books" ADD COLUMN "page_count" numeric;
  ALTER TABLE "books" ADD COLUMN "isbn" varchar;
  ALTER TABLE "books" ADD COLUMN "full_text_status" "enum_books_full_text_status" DEFAULT 'unknown';
  ALTER TABLE "books" ADD COLUMN "source_type" "enum_books_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "books" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "books" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "books" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "books" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "books" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_books_v" ADD COLUMN "version_authors" varchar DEFAULT 'Н. П. Ведищев';
  ALTER TABLE "_books_v" ADD COLUMN "version_page_count" numeric;
  ALTER TABLE "_books_v" ADD COLUMN "version_isbn" varchar;
  ALTER TABLE "_books_v" ADD COLUMN "version_full_text_status" "enum__books_v_version_full_text_status" DEFAULT 'unknown';
  ALTER TABLE "_books_v" ADD COLUMN "version_source_type" "enum__books_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_books_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_books_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_books_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_books_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_books_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "videos" ADD COLUMN "source_type" "enum_videos_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "videos" ADD COLUMN "legacy_source_url" varchar;
  ALTER TABLE "videos" ADD COLUMN "legacy_slug" varchar;
  ALTER TABLE "videos" ADD COLUMN "legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "videos" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "videos" ADD COLUMN "verification_note" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN "version_source_type" "enum__videos_v_version_source_type" DEFAULT 'legacy-site';
  ALTER TABLE "_videos_v" ADD COLUMN "version_legacy_source_url" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN "version_legacy_slug" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN "version_legacy_published_at" timestamp(3) with time zone;
  ALTER TABLE "_videos_v" ADD COLUMN "version_verified" boolean DEFAULT false;
  ALTER TABLE "_videos_v" ADD COLUMN "version_verification_note" varchar;
  ALTER TABLE "pages_blocks_books_showcase" ADD CONSTRAINT "pages_blocks_books_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_books_showcase" ADD CONSTRAINT "_pages_v_blocks_books_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_books_showcase_order_idx" ON "pages_blocks_books_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_books_showcase_parent_id_idx" ON "pages_blocks_books_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_books_showcase_path_idx" ON "pages_blocks_books_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_books_showcase_order_idx" ON "_pages_v_blocks_books_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_books_showcase_parent_id_idx" ON "_pages_v_blocks_books_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_books_showcase_path_idx" ON "_pages_v_blocks_books_showcase" USING btree ("_path");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_related_publication_id_publications_id_fk" FOREIGN KEY ("related_publication_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_related_publication_id_publications_id_fk" FOREIGN KEY ("version_related_publication_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_rels_books_id_idx" ON "pages_rels" USING btree ("books_id");
  CREATE INDEX "_pages_v_rels_books_id_idx" ON "_pages_v_rels" USING btree ("books_id");
  CREATE INDEX "posts_rels_practice_areas_id_idx" ON "posts_rels" USING btree ("practice_areas_id");
  CREATE INDEX "_posts_v_rels_practice_areas_id_idx" ON "_posts_v_rels" USING btree ("practice_areas_id");
  CREATE INDEX "cases_related_publication_idx" ON "cases" USING btree ("related_publication_id");
  CREATE INDEX "_cases_v_version_version_related_publication_idx" ON "_cases_v" USING btree ("version_related_publication_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_books_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_books_showcase" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_books_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_books_showcase" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_books_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_books_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_practice_areas_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_practice_areas_fk";
  
  ALTER TABLE "cases" DROP CONSTRAINT "cases_related_publication_id_publications_id_fk";
  
  ALTER TABLE "_cases_v" DROP CONSTRAINT "_cases_v_version_related_publication_id_publications_id_fk";
  
  ALTER TABLE "publications" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "publications" ALTER COLUMN "type" SET DEFAULT 'media'::text;
  DROP TYPE "public"."enum_publications_type";
  CREATE TYPE "public"."enum_publications_type" AS ENUM('media', 'academic', 'interview', 'other');
  ALTER TABLE "publications" ALTER COLUMN "type" SET DEFAULT 'media'::"public"."enum_publications_type";
  ALTER TABLE "publications" ALTER COLUMN "type" SET DATA TYPE "public"."enum_publications_type" USING "type"::"public"."enum_publications_type";
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DEFAULT 'media'::text;
  DROP TYPE "public"."enum__publications_v_version_type";
  CREATE TYPE "public"."enum__publications_v_version_type" AS ENUM('media', 'academic', 'interview', 'other');
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DEFAULT 'media'::"public"."enum__publications_v_version_type";
  ALTER TABLE "_publications_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__publications_v_version_type" USING "version_type"::"public"."enum__publications_v_version_type";
  DROP INDEX "pages_rels_books_id_idx";
  DROP INDEX "_pages_v_rels_books_id_idx";
  DROP INDEX "posts_rels_practice_areas_id_idx";
  DROP INDEX "_posts_v_rels_practice_areas_id_idx";
  DROP INDEX "cases_related_publication_idx";
  DROP INDEX "_cases_v_version_version_related_publication_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "books_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "books_id";
  ALTER TABLE "posts" DROP COLUMN "excerpt";
  ALTER TABLE "posts" DROP COLUMN "author_name";
  ALTER TABLE "posts" DROP COLUMN "source_type";
  ALTER TABLE "posts" DROP COLUMN "legacy_source_url";
  ALTER TABLE "posts" DROP COLUMN "legacy_slug";
  ALTER TABLE "posts" DROP COLUMN "legacy_published_at";
  ALTER TABLE "posts" DROP COLUMN "verified";
  ALTER TABLE "posts" DROP COLUMN "verification_note";
  ALTER TABLE "posts_rels" DROP COLUMN "practice_areas_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_posts_v" DROP COLUMN "version_author_name";
  ALTER TABLE "_posts_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_verified";
  ALTER TABLE "_posts_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "practice_areas_id";
  ALTER TABLE "practice_areas" DROP COLUMN "source_type";
  ALTER TABLE "practice_areas" DROP COLUMN "legacy_source_url";
  ALTER TABLE "practice_areas" DROP COLUMN "legacy_slug";
  ALTER TABLE "practice_areas" DROP COLUMN "legacy_published_at";
  ALTER TABLE "practice_areas" DROP COLUMN "verified";
  ALTER TABLE "practice_areas" DROP COLUMN "verification_note";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_verified";
  ALTER TABLE "_practice_areas_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "services" DROP COLUMN "source_type";
  ALTER TABLE "services" DROP COLUMN "legacy_source_url";
  ALTER TABLE "services" DROP COLUMN "legacy_slug";
  ALTER TABLE "services" DROP COLUMN "legacy_published_at";
  ALTER TABLE "services" DROP COLUMN "verified";
  ALTER TABLE "services" DROP COLUMN "verification_note";
  ALTER TABLE "_services_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_services_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_services_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_services_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_services_v" DROP COLUMN "version_verified";
  ALTER TABLE "_services_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "cases" DROP COLUMN "case_category";
  ALTER TABLE "cases" DROP COLUMN "decision_date";
  ALTER TABLE "cases" DROP COLUMN "procedural_issue";
  ALTER TABLE "cases" DROP COLUMN "related_publication_id";
  ALTER TABLE "cases" DROP COLUMN "source_type";
  ALTER TABLE "cases" DROP COLUMN "legacy_source_url";
  ALTER TABLE "cases" DROP COLUMN "legacy_slug";
  ALTER TABLE "cases" DROP COLUMN "legacy_published_at";
  ALTER TABLE "cases" DROP COLUMN "verified";
  ALTER TABLE "cases" DROP COLUMN "verification_note";
  ALTER TABLE "_cases_v" DROP COLUMN "version_case_category";
  ALTER TABLE "_cases_v" DROP COLUMN "version_decision_date";
  ALTER TABLE "_cases_v" DROP COLUMN "version_procedural_issue";
  ALTER TABLE "_cases_v" DROP COLUMN "version_related_publication_id";
  ALTER TABLE "_cases_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_cases_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_cases_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_cases_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_cases_v" DROP COLUMN "version_verified";
  ALTER TABLE "_cases_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "publications" DROP COLUMN "authors";
  ALTER TABLE "publications" DROP COLUMN "issue";
  ALTER TABLE "publications" DROP COLUMN "page_range";
  ALTER TABLE "publications" DROP COLUMN "source_type";
  ALTER TABLE "publications" DROP COLUMN "legacy_source_url";
  ALTER TABLE "publications" DROP COLUMN "legacy_slug";
  ALTER TABLE "publications" DROP COLUMN "legacy_published_at";
  ALTER TABLE "publications" DROP COLUMN "verified";
  ALTER TABLE "publications" DROP COLUMN "verification_note";
  ALTER TABLE "_publications_v" DROP COLUMN "version_authors";
  ALTER TABLE "_publications_v" DROP COLUMN "version_issue";
  ALTER TABLE "_publications_v" DROP COLUMN "version_page_range";
  ALTER TABLE "_publications_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_publications_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_publications_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_publications_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_publications_v" DROP COLUMN "version_verified";
  ALTER TABLE "_publications_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "books" DROP COLUMN "authors";
  ALTER TABLE "books" DROP COLUMN "page_count";
  ALTER TABLE "books" DROP COLUMN "isbn";
  ALTER TABLE "books" DROP COLUMN "full_text_status";
  ALTER TABLE "books" DROP COLUMN "source_type";
  ALTER TABLE "books" DROP COLUMN "legacy_source_url";
  ALTER TABLE "books" DROP COLUMN "legacy_slug";
  ALTER TABLE "books" DROP COLUMN "legacy_published_at";
  ALTER TABLE "books" DROP COLUMN "verified";
  ALTER TABLE "books" DROP COLUMN "verification_note";
  ALTER TABLE "_books_v" DROP COLUMN "version_authors";
  ALTER TABLE "_books_v" DROP COLUMN "version_page_count";
  ALTER TABLE "_books_v" DROP COLUMN "version_isbn";
  ALTER TABLE "_books_v" DROP COLUMN "version_full_text_status";
  ALTER TABLE "_books_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_books_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_books_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_books_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_books_v" DROP COLUMN "version_verified";
  ALTER TABLE "_books_v" DROP COLUMN "version_verification_note";
  ALTER TABLE "videos" DROP COLUMN "source_type";
  ALTER TABLE "videos" DROP COLUMN "legacy_source_url";
  ALTER TABLE "videos" DROP COLUMN "legacy_slug";
  ALTER TABLE "videos" DROP COLUMN "legacy_published_at";
  ALTER TABLE "videos" DROP COLUMN "verified";
  ALTER TABLE "videos" DROP COLUMN "verification_note";
  ALTER TABLE "_videos_v" DROP COLUMN "version_source_type";
  ALTER TABLE "_videos_v" DROP COLUMN "version_legacy_source_url";
  ALTER TABLE "_videos_v" DROP COLUMN "version_legacy_slug";
  ALTER TABLE "_videos_v" DROP COLUMN "version_legacy_published_at";
  ALTER TABLE "_videos_v" DROP COLUMN "version_verified";
  ALTER TABLE "_videos_v" DROP COLUMN "version_verification_note";
  DROP TYPE "public"."enum_posts_source_type";
  DROP TYPE "public"."enum__posts_v_version_source_type";
  DROP TYPE "public"."enum_practice_areas_source_type";
  DROP TYPE "public"."enum__practice_areas_v_version_source_type";
  DROP TYPE "public"."enum_services_source_type";
  DROP TYPE "public"."enum__services_v_version_source_type";
  DROP TYPE "public"."enum_cases_source_type";
  DROP TYPE "public"."enum__cases_v_version_source_type";
  DROP TYPE "public"."enum_publications_source_type";
  DROP TYPE "public"."enum__publications_v_version_source_type";
  DROP TYPE "public"."enum_books_full_text_status";
  DROP TYPE "public"."enum_books_source_type";
  DROP TYPE "public"."enum__books_v_version_full_text_status";
  DROP TYPE "public"."enum__books_v_version_source_type";
  DROP TYPE "public"."enum_videos_source_type";
  DROP TYPE "public"."enum__videos_v_version_source_type";`)
}
