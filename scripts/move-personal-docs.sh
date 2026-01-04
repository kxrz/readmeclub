#!/bin/bash

# Script to move personal documentation files to docs/ folder
# These files will be ignored by Git but kept locally

set -e

echo "📁 Moving personal documentation files to docs/ folder..."
echo ""

# Create docs directory if it doesn't exist
mkdir -p docs

# Files to move to docs/
FILES_TO_MOVE=(
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
    ".gitignore-review.md"
)

MOVED_COUNT=0
NOT_FOUND_COUNT=0
ALREADY_MOVED=0

for file in "${FILES_TO_MOVE[@]}"; do
    if [ -f "$file" ]; then
        # Check if already in docs/
        if [ -f "docs/$file" ]; then
            echo "⚠️  Already in docs/: $file (skipping)"
            ALREADY_MOVED=$((ALREADY_MOVED + 1))
        else
            echo "Moving: $file → docs/$file"
            mv "$file" "docs/$file"
            MOVED_COUNT=$((MOVED_COUNT + 1))
            
            # Remove from Git if tracked
            if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
                git rm --cached "$file" 2>/dev/null || true
            fi
        fi
    else
        echo "Not found: $file (skipping)"
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Moved $MOVED_COUNT file(s) to docs/"
if [ $ALREADY_MOVED -gt 0 ]; then
    echo "ℹ️  $ALREADY_MOVED file(s) were already in docs/"
fi
if [ $NOT_FOUND_COUNT -gt 0 ]; then
    echo "ℹ️  $NOT_FOUND_COUNT file(s) were not found"
fi
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes: git status"
echo "   2. Commit the removal: git commit -m 'chore: move personal docs to docs/ folder'"
echo ""
echo "✅ All files in docs/ are now ignored by Git (see .gitignore)"
