# ✅ Pre-Commit & Testing Checklist

**Use this checklist before every commit or when testing changes.**

This checklist ensures you never commit secrets or break the project. Follow it step by step - it's your safety net! 🛡️

---

## 🔍 Step 1: Check for Secrets (CRITICAL)

### Option A: Automated check (RECOMMENDED - runs all checks)
```bash
./scripts/pre-commit-check.sh
```
**This runs everything automatically!** ✅

### Option B: Manual security check
```bash
./scripts/check-secrets.sh
```

**Expected result**: ✅ Green message saying "No secrets detected"

**If you see errors**:
- ❌ Stop here - fix the issues first
- Remove any `.env` files from staging: `git reset HEAD .env`
- Replace hardcoded values with environment variables
- See `SECURITY.md` for help

---

## 📁 Step 2: Verify .gitignore

### Quick check
```bash
git status | grep "\.env"
```

**Expected result**: Nothing (no .env files listed)

**If you see `.env` files**:
- ❌ Stop here - they shouldn't be tracked
- Check `.gitignore` includes `.env` patterns
- Remove from tracking: `git rm --cached .env`

---

## 🧪 Step 3: Test Your Changes

### Build check
```bash
npm run build
```

**Expected result**: ✅ Build completes without errors

**If build fails**:
- ❌ Fix TypeScript/compilation errors
- Check console output for specific errors
- Don't commit broken code

### Development server check
```bash
npm run dev
```

**Expected result**: ✅ Server starts on `http://localhost:4321`

**If server fails**:
- ❌ Check error messages
- Verify environment variables are set (`.env` file exists)
- Don't commit if server won't start

---

## 📝 Step 4: Review Your Changes

### See what you're committing
```bash
git status
git diff
```

**Check for**:
- ✅ Only intended files are modified
- ✅ No accidental deletions
- ✅ No test/debug code left in
- ✅ No console.logs or debug statements (unless intentional)

---

## 🔒 Step 5: Final Security Check

### Manual verification
```bash
# Check for common secret patterns
git diff | grep -iE "(password|secret|key|token)" | grep -v "your-" | grep -v "example"
```

**Expected result**: Nothing (or only safe placeholders)

**If you see actual secrets**:
- ❌ Stop immediately
- Remove secrets from code
- Use environment variables instead
- Regenerate any exposed secrets

---

## ✅ Step 6: Ready to Commit?

### Final checklist before `git commit`:

- [ ] Security check passed (`./scripts/check-secrets.sh` ✅)
- [ ] No `.env` files in staging
- [ ] Build succeeds (`npm run build` ✅)
- [ ] Dev server works (`npm run dev` ✅)
- [ ] Code changes reviewed (`git diff` ✅)
- [ ] No secrets in code (manual check ✅)
- [ ] Commit message follows conventions (see below)

### Commit message format
```
feat: add new feature
fix: fix bug in component
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

**Example**:
```bash
git commit -m "feat: add dark mode toggle"
```

---

## 🚨 Emergency Stop Signs

**STOP and fix before committing if you see**:

- ❌ `.env` file in `git status`
- ❌ Actual API keys, passwords, or tokens in code
- ❌ Build errors
- ❌ TypeScript errors
- ❌ "ERROR" messages from `check-secrets.sh`
- ❌ Complete webhook URLs (should use env vars)

---

## 🆘 Quick Help

### "I see .env in git status"
```bash
# Remove from staging
git reset HEAD .env

# Verify it's ignored
git check-ignore .env
# Should output: .env
```

### "check-secrets.sh found secrets"
1. Open the file mentioned in the error
2. Find the secret (API key, password, etc.)
3. Replace with environment variable: `import.meta.env.VARIABLE_NAME`
4. Add variable to `.env.example` (documented)
5. Run `check-secrets.sh` again

### "Build fails"
1. Read the error message carefully
2. Check TypeScript errors: look for `error TS...`
3. Fix syntax errors
4. Run `npm run build` again

### "I'm not sure if something is safe"
- When in doubt, **don't commit**
- Check `SECURITY.md` for guidance
- Ask for help in an issue (don't include secrets!)

---

## 💡 Pro Tips

### Before starting work
```bash
# Create a new branch
git checkout -b feature/my-feature

# This keeps main safe
```

### Quick test workflow
```bash
# 1. Make changes
# 2. Test locally
npm run dev
# 3. Check secrets
./scripts/check-secrets.sh
# 4. Build test
npm run build
# 5. If all good, commit!
```

### Use Git hooks (optional)
If you want automatic checks before every commit:
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
./scripts/check-secrets.sh
EOF
chmod +x .git/hooks/pre-commit
```

---

## 📋 Quick Reference Card

**Copy this and keep it handy:**

```
□ ./scripts/check-secrets.sh → ✅
□ git status → no .env files
□ npm run build → ✅
□ npm run dev → ✅
□ git diff → reviewed
□ No secrets in code → ✅
□ Commit message → formatted
→ READY TO COMMIT! 🚀
```

---

## 🎯 Remember

**It's better to check twice than to commit secrets once!**

This checklist exists to protect you and the project. Take your time, follow each step, and you'll be fine. If you're unsure about anything, stop and ask - that's what the community is for!

**You've got this! 💪**

---

*Last updated: January 2025*
