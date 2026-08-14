import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publications" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "publications" ADD COLUMN "slug" varchar;
  ALTER TABLE "_publications_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "_publications_v" ADD COLUMN "version_slug" varchar;
  CREATE UNIQUE INDEX "publications_slug_idx" ON "publications" USING btree ("slug");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "_publications_v" USING btree ("version_slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "publications_slug_idx";
  DROP INDEX "_publications_v_version_version_slug_idx";
  ALTER TABLE "publications" DROP COLUMN "generate_slug";
  ALTER TABLE "publications" DROP COLUMN "slug";
  ALTER TABLE "_publications_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "_publications_v" DROP COLUMN "version_slug";`)
}
