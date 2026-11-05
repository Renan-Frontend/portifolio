#!/usr/bin/env bash
# Publica o build do portfólio na raiz de Renan-Frontend.github.io,
# preservando /curriculo-v1/ (site antigo).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IO_DIR="${IO_DIR:-/tmp/renan-frontend-github-io}"
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$ROOT"
node ./node_modules/vite/bin/vite.js build

rm -rf "$IO_DIR"
gh repo clone Renan-Frontend/Renan-Frontend.github.io "$IO_DIR" -- --depth 1

cd "$IO_DIR"
git checkout -B "$BRANCH"

if [ ! -d curriculo-v1 ]; then
  echo "ERRO: pasta curriculo-v1/ ausente no user site. Abortando para não apagar o legado." >&2
  exit 1
fi

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'curriculo-v1' \
  ! -name '.github' \
  -exec rm -rf {} +

cp -a "$ROOT/dist/." .
cp -f index.html 404.html

git add -A
if git diff --cached --quiet; then
  echo "Nada novo para publicar."
  exit 0
fi

git -c user.name="Renan Naves" -c user.email="renan.naves.frontend@gmail.com" \
  commit -m "Deploy do portfólio na raiz."
git push origin "HEAD:$BRANCH"
echo "Publicado em https://renan-frontend.github.io/"
