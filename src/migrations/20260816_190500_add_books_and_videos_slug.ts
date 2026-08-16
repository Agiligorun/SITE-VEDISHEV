import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "books" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "books" ADD COLUMN "slug" varchar;
  ALTER TABLE "_books_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "_books_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "videos" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "videos" ADD COLUMN "slug" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "_videos_v" ADD COLUMN "version_slug" varchar;
  CREATE UNIQUE INDEX "books_slug_idx" ON "books" USING btree ("slug");
  CREATE INDEX "_books_v_version_version_slug_idx" ON "_books_v" USING btree ("version_slug");
  CREATE UNIQUE INDEX "videos_slug_idx" ON "videos" USING btree ("slug");
  CREATE INDEX "_videos_v_version_version_slug_idx" ON "_videos_v" USING btree ("version_slug");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "books_slug_idx";
  DROP INDEX "_books_v_version_version_slug_idx";
  DROP INDEX "videos_slug_idx";
  DROP INDEX "_videos_v_version_version_slug_idx";
  ALTER TABLE "books" DROP COLUMN "generate_slug";
  ALTER TABLE "books" DROP COLUMN "slug";
  ALTER TABLE "_books_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "_books_v" DROP COLUMN "version_slug";
  ALTER TABLE "videos" DROP COLUMN "generate_slug";
  ALTER TABLE "videos" DROP COLUMN "slug";
  ALTER TABLE "_videos_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "_videos_v" DROP COLUMN "version_slug";`)
}
