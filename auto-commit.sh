#!/bin/zsh

# Auto-commit script - commits all changes every 30 minutes
# Usage: ./auto-commit.sh [repo-path]
# Example: ./auto-commit.sh /Users/shashwath/Documents/AnkrMiraSol/mira_pin_frontend

REPO_PATH="${1:-$(pwd)}"
INTERVAL=1800  # 30 minutes in seconds

if [ ! -d "$REPO_PATH/.git" ]; then
  echo "Error: $REPO_PATH is not a git repository"
  exit 1
fi

echo "Auto-commit started for: $REPO_PATH"
echo "Interval: every 30 minutes. Press Ctrl+C to stop."

while true; do
  cd "$REPO_PATH"

  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  # If no changes, append a newline to a tracking file to force a commit
  if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo "" >> .auto-commit-keep
  fi

  git add -A
  git commit -m "auto-commit: $TIMESTAMP"
  git push
  echo "[$TIMESTAMP] Committed and pushed"

  sleep $INTERVAL
done
