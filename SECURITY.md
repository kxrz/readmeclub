# 🔒 Security Policy

This document describes security practices for this open-source project.

## ⚠️ Sensitive Information

**NEVER COMMIT** the following information to the Git repository:

### Sensitive environment variables

All environment variables must be defined in a local `.env` file (not versioned) or in your deployment platform's environment variables (Vercel, etc.).

**Sensitive variables to protect:**

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (full admin access)
- `ADMIN_PASSWORD` - Administrator password
- `VERCEL_REBUILD_WEBHOOK_URL` - Vercel webhook URL (can be used to trigger builds)
- `OLD_SUPABASE_SERVICE_ROLE_KEY` - Old migration keys
- `AIRTABLE_API_KEY` - Airtable API key (if used)

**Public variables (can be exposed client-side):**

- `PUBLIC_SUPABASE_URL` - Public Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (limited by RLS)

### Files to never commit

- `.env` - Local environment variables file
- `.env.production` - Production variables
- `.env.local` - Local variables
- `.env.*.local` - All local environment files
- `*.key` - Private key files
- `*.pem` - Private certificates
- `*.p12` - PKCS#12 certificates

## 🔍 Pre-commit verification

Before committing code, verify that:

1. ✅ No `.env` files are present in staging
2. ✅ No API keys, tokens, or passwords are hardcoded in the code
3. ✅ No complete webhook URLs with tokens are in the code
4. ✅ Configuration files use environment variables

### Useful commands

```bash
# Check for sensitive files in staging
git diff --cached | grep -E "(API_KEY|SECRET|PASSWORD|TOKEN|\.env)"

# Search for suspicious patterns in all code
grep -r "eyJ" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "sk-" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git
```

## 🛡️ Best Practices

### Environment variables

1. **Use `.env.example`** as a template
2. **Never commit** `.env` or `.env.production`
3. **Document** all required variables in `.env.example`
4. **Use placeholder values** in examples (e.g., `your-key-here`)

### Code

1. **Always use** `import.meta.env.VARIABLE_NAME` to access variables
2. **Never hardcode** secrets in source code
3. **Validate** the presence of critical variables at startup
4. **Use types** (`env.d.ts`) to document expected variables

### Supabase

1. **Use RLS (Row Level Security)** to limit data access
2. **Use the anonymous key** (`PUBLIC_SUPABASE_ANON_KEY`) on the client side
3. **Reserve the service role key** (`SUPABASE_SERVICE_ROLE_KEY`) for server-side operations only
4. **Never expose** the service role key on the client side

### Deployment

1. **Configure variables** in your platform's dashboard (Vercel, etc.)
2. **Never** put secrets in versioned configuration files
3. **Use secrets** for sensitive values in CI/CD
4. **Rotate regularly** keys and passwords

## 🚨 If a secret is exposed

If you discover that a secret has been committed by mistake:

1. **Immediately**:
   - Revoke/regenerate the exposed secret
   - Remove the commit from Git history (if possible)
   - Or create a new commit that removes the secret

2. **To remove a file from Git history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push** (⚠️ warning, this rewrites history):
   ```bash
   git push origin --force --all
   ```

4. **Alert** collaborators to retrieve the new secrets

## 📝 Pre-open-source publication checklist

- [ ] Verify that `.env` is in `.gitignore`
- [ ] Create `.env.example` with all placeholders
- [ ] Verify that no secrets are hardcoded in the code
- [ ] Verify configuration files (vercel.json, etc.)
- [ ] Verify SQL migrations for sensitive data
- [ ] Verify scripts for credentials
- [ ] Document required variables in the README
- [ ] Create this SECURITY.md file

## 📧 Reporting a vulnerability

If you discover a security vulnerability, please:

1. **Do not** create a public issue
2. **Contact** the project maintainer directly
3. **Describe** the vulnerability in detail
4. **Propose** a solution if possible

---

**Last updated**: December 2024
