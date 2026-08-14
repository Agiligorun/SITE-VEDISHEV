#!/usr/bin/env bash
set -euo pipefail

timestamp="$(date +%Y-%m-%dT%H-%M-%S)"
backup_dir="/var/backups/vedishev"
backup_file="${backup_dir}/vedishev-${timestamp}.sql"

mkdir -p "${backup_dir}"
sudo -u postgres pg_dump vedishev > "${backup_file}"
gzip -f "${backup_file}"

echo "Backup created: ${backup_file}.gz"
