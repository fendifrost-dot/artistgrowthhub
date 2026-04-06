#!/usr/bin/env bash
# Run this in Terminal on your machine (Cursor sandbox cannot create .git/hooks).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== Artist Growth Hub → GitHub (fendifrost-dot/artistgrowthhub) =="
echo "Root: $ROOT"
echo ""

if [[ ! -d .git ]]; then
  echo "Initializing git…"
  git init -b main
  git remote add origin https://github.com/fendifrost-dot/artistgrowthhub.git 2>/dev/null || true
fi

git remote -v | head -2 || true
git add -A
git status --short

read -r -p "Commit message [default]: Sync Supabase FanFuel + Lovable-aligned config & inventory
" MSG
MSG=${MSG:-"Sync Supabase FanFuel + Lovable-aligned config & inventory"}

git commit -m "$MSG" || { echo "Nothing to commit or commit failed."; exit 1; }

echo ""
echo "Pushing… If the remote already has history, you may need:"
echo "  git pull origin main --rebase --allow-unrelated-histories"
echo "  git push origin main"
git push origin main

echo "Done. Deploy Edge functions from Lovable or: supabase functions deploy playlist-research (see supabase/DEPLOY.md)"
