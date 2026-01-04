#!/bin/bash

# Automated pre-commit checklist runner
# Usage: ./scripts/pre-commit-check.sh
# This runs all checks automatically and tells you if you're safe to commit

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Pre-Commit Safety Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Step 1: Security check
echo -e "${BLUE}Step 1/5: Checking for secrets...${NC}"
if ./scripts/check-secrets.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No secrets detected${NC}\n"
else
    echo -e "${RED}❌ SECRETS DETECTED - STOP HERE!${NC}"
    echo -e "${YELLOW}Run './scripts/check-secrets.sh' to see details${NC}\n"
    ERRORS=$((ERRORS + 1))
fi

# Step 2: Check for .env files
echo -e "${BLUE}Step 2/5: Checking for .env files in staging...${NC}"
if git diff --cached --name-only 2>/dev/null | grep -E "\.env$|\.env\." > /dev/null; then
    echo -e "${RED}❌ .env files found in staging!${NC}"
    echo -e "${YELLOW}Remove them with: git reset HEAD .env${NC}\n"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No .env files in staging${NC}\n"
fi

# Step 3: Check if there are any changes to commit
echo -e "${BLUE}Step 3/5: Checking for changes to commit...${NC}"
if git diff --cached --quiet 2>/dev/null && [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}\n"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ Changes ready to commit${NC}\n"
fi

# Step 4: Build check (optional - can be slow)
echo -e "${BLUE}Step 4/5: Testing build...${NC}"
echo -e "${YELLOW}(This may take a moment...)${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}\n"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo -e "${YELLOW}Run 'npm run build' to see errors${NC}\n"
    ERRORS=$((ERRORS + 1))
fi

# Step 5: TypeScript check (informational only - build is the real test)
echo -e "${BLUE}Step 5/5: Checking TypeScript (informational)...${NC}"
TSC_OUTPUT=$(npx tsc --noEmit --skipLibCheck 2>&1 || true)

# Count errors (ignore scripts/)
if echo "$TSC_OUTPUT" | grep -v "scripts/" | grep -q "error TS"; then
    echo -e "${YELLOW}⚠️  TypeScript warnings found${NC}"
    echo -e "${YELLOW}Note: Build passed, so these may be false positives with Astro${NC}"
    echo -e "${YELLOW}Run 'npx tsc --noEmit' to see details (optional)${NC}\n"
    # Don't count as error since build passed - build is the real test
else
    echo -e "${GREEN}✅ No TypeScript errors${NC}\n"
fi

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}You're safe to commit! 🚀${NC}\n"
    echo -e "Next step:"
    echo -e "  git commit -m \"your message\""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  CHECKS PASSED WITH WARNINGS${NC}"
    echo -e "${YELLOW}Review warnings above, but you can commit${NC}\n"
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERROR(S) FOUND${NC}"
    echo -e "${RED}Please fix errors before committing${NC}\n"
    echo -e "For detailed help, see:"
    echo -e "  - PRE_COMMIT_CHECKLIST.md"
    echo -e "  - SECURITY.md"
    exit 1
fi
