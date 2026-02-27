#!/usr/bin/env bash
set -euo pipefail

# Deploy Weather.IM Live Vite build output to a target directory.
#
# Environment overrides:
#   DEST=/opt/weather.im/html/live
#   INSTALL_DEPS=1

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

DEST="${DEST:-/opt/weather.im/html/live}"
INSTALL_DEPS="${INSTALL_DEPS:-1}"
PROD="0"

usage() {
    cat <<EOF
Usage: $0 [--prod] [--help]

Options:
  --prod  Run production deployment branch.
  --help  Show this help message.

Environment overrides:
  DEST         Deployment target directory (default: /opt/weather.im/html/live)
  INSTALL_DEPS Run npm ci before build (default: 1)
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --prod)
            PROD="1"
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            echo >&2
            usage >&2
            exit 1
            ;;
    esac
done

echo "[deploy] Project root: $PROJECT_ROOT"
echo "[deploy] Mode: $([[ "$PROD" == "1" ]] && echo "prod" || echo "default")"
echo "[deploy] Destination: $DEST"

cd "$PROJECT_ROOT"

if [[ "$INSTALL_DEPS" == "1" ]]; then
    echo "[deploy] Installing dependencies with npm ci"
    npm ci
fi

echo "[deploy] Running lint"
npm run lint

echo "[deploy] Building production assets"
npm run build

if [[ "$PROD" == "1" ]]; then
    echo "[deploy] --prod selected"
    rsync -a "$PROJECT_ROOT/dist/" "mesonet@anticyclone:$DEST/"
else
    mkdir -p "$DEST"
    echo "[deploy] Syncing dist/ to destination"
    rsync -a "$PROJECT_ROOT/dist/" "$DEST/"
fi

echo "[deploy] Complete"
