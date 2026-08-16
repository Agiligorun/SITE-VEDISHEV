import * as migration_20260814_132012_initial_schema from './20260814_132012_initial_schema';
import * as migration_20260814_133144_add_publications_slug from './20260814_133144_add_publications_slug';
import * as migration_20260816_104200_add_legacy_content_schema from './20260816_104200_add_legacy_content_schema';

export const migrations = [
  {
    up: migration_20260814_132012_initial_schema.up,
    down: migration_20260814_132012_initial_schema.down,
    name: '20260814_132012_initial_schema',
  },
  {
    up: migration_20260814_133144_add_publications_slug.up,
    down: migration_20260814_133144_add_publications_slug.down,
    name: '20260814_133144_add_publications_slug',
  },
  {
    up: migration_20260816_104200_add_legacy_content_schema.up,
    down: migration_20260816_104200_add_legacy_content_schema.down,
    name: '20260816_104200_add_legacy_content_schema'
  },
];
