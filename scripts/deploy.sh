#!/usr/bin/env bash
set -euo pipefail

app_dir="/var/www/vedishev/current"

cd "${app_dir}"
pnpm install --frozen-lockfile
pnpm run generate:types
pnpm run build
node --import=tsx/esm ./scripts/bootstrap-placeholders.ts
sudo systemctl restart vedishev
sudo systemctl status vedishev --no-pager
