#!/bin/bash

# Script to remove personal documentation files from Git tracking
# NOTE: Use scripts/move-personal-docs.sh instead - it moves files to docs/ folder
# This script is kept for backward compatibility

set -e

echo "⚠️  DEPRECATED: Use './scripts/move-personal-docs.sh' instead"
echo "   It moves files to docs/ folder (which is ignored by Git)"
echo ""
echo "Running move script instead..."
echo ""

exec ./scripts/move-personal-docs.sh

# Files to remove from Git (but keep locally)
FILES_TO_REMOVE=(
    "ANALYSE_CACHE_EGRESS.md"
    "ANALYSE_DEBOUNCING_REBUILD.md"
    "EVALUATION_OPTIMISATIONS_STATIQUES.md"
    "OPTIMISATIONS_IMPLEMENTEES.md"
    "OPTIMISATIONS_SUPPLEMENTAIRES.md"
    "PRERENDER_IMPLEMENTATION.md"
    "PRERENDER_VERCEL_FIX.md"
    "REBUILD_DEBOUNCING_READY.md"
    "DEBOUNCING_REBUILD.md"
    "CACHE_IMPLEMENTATION.md"
    "SOLUTION_CACHE_EGRESS.md"
    "SUPABASE_CACHE_EVALUATION.md"
    "TEST_CACHE.md"
    "EXEMPLE_MIGRATION_CACHE.md"
    "CONFIGURATION_VERCEL_REBUILD.md"
    "GUIDE_CONFIGURATION_WEBHOOK_VERCEL.md"
    "migration-analysis.json"
)

REMOVED_COUNT=0
NOT_FOUND_COUNT=0

for file in "${FILES_TO_REMOVE[@]}"; do
    if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
        echo "Removing: $file"
        git rm --cached "$file" 2>/dev/null || true
        REMOVED_COUNT=$((REMOVED_COUNT + 1))
    else
        echo "Not tracked: $file (skipping)"
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Removed $REMOVED_COUNT file(s) from Git tracking"
if [ $NOT_FOUND_COUNT -gt 0 ]; then
    echo "ℹ️  $NOT_FOUND_COUNT file(s) were not tracked (already ignored or don't exist)"
fi
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes: git status"
echo "   2. Commit the removal: git commit -m 'chore: remove personal development documentation'"
echo ""
echo "⚠️  Note: Files are still on your local machine, just not tracked by Git anymore."
