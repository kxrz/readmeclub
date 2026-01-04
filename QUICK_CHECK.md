# ⚡ Quick Check

**Super fast verification before commit**

## 🚀 One Command (RECOMMENDED)

```bash
./scripts/pre-commit-check.sh
```

**That's it!** This runs all checks automatically and tells you if you're safe to commit. ✅

---

## 📋 Manual Quick Check (if you prefer)

```bash
# 1. Security check (MOST IMPORTANT)
./scripts/check-secrets.sh

# 2. No .env files?
git status | grep "\.env" || echo "✅ No .env files"

# 3. Build works?
npm run build && echo "✅ Build OK"

# All green? → You're good to commit! 🚀
```

**If any step fails → STOP and check `PRE_COMMIT_CHECKLIST.md`**

---

*For detailed step-by-step guide, see `PRE_COMMIT_CHECKLIST.md`*
