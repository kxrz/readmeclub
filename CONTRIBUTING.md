# 🤝 Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- npm or yarn
- A Supabase account (for local testing)

### Installation

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/xteinkhub2026.git
   cd xteinkhub2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your own Supabase keys
   ```

4. **Set up Supabase**
   - Create a project on [Supabase](https://supabase.com)
   - Create Storage buckets: `resources` and `wallpapers` (public)
   - Run SQL migrations in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_rls_policies.sql`
     - `supabase/migrations/003_add_starred_to_resources.sql`
     - `supabase/migrations/004_create_news_table.sql`
     - `supabase/migrations/005_create_news_images_bucket.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Contribution Process

### 1. Create a branch

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-fix
```

### 2. Make your changes

- Write clear and well-commented code
- Follow existing code conventions
- Add tests if applicable
- Update documentation if necessary

### 3. Verify before committing

**⚠️ IMPORTANT: Verify that no secrets are in your code**

```bash
# Check modified files
git diff | grep -E "(API_KEY|SECRET|PASSWORD|TOKEN|\.env)"

# Verify that no .env files are added
git status | grep "\.env"
```

### 4. Commit your changes

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: fix bug in..."
```

**Commit conventions**:
- `feat:` for a new feature
- `fix:` for a bug fix
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for refactoring
- `test:` for tests
- `chore:` for maintenance tasks

### 5. Push and create a Pull Request

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub with:
- A clear description of changes
- Screenshots if applicable
- Reference related issues if applicable

## 🎨 Code Standards

### TypeScript

- Use TypeScript for all code
- Avoid `any`, prefer explicit types
- Use interfaces for component props

### Astro

- Use `.astro` components for templates
- Separate logic into `.ts` files if necessary
- Use slots for composition

### Styles

- Use Tailwind CSS for styling
- Follow the design system (see `designsystem.md`)
- Use utility classes rather than custom CSS when possible

### Internationalization

- All strings must be translated
- Add translations in `src/i18n/languages.ts`
- Supported languages: EN, FR, ES, RU, CN

## 🧪 Testing

Before submitting a PR, verify that:

- [ ] Code compiles without errors (`npm run build`)
- [ ] Development server works (`npm run dev`)
- [ ] No TypeScript errors
- [ ] Features tested manually

## 📚 Documentation

If you add a new feature:

- [ ] Update README if necessary
- [ ] Document new environment variables in `.env.example`
- [ ] Add comments in code for complex parts

## 🐛 Reporting a Bug

If you find a bug:

1. Check that an issue doesn't already exist
2. Create a new issue with:
   - Clear bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (OS, browser, Node.js version)

## 💡 Proposing a Feature

To propose a new feature:

1. Check that it hasn't already been proposed
2. Create an issue with:
   - Detailed description
   - Use cases
   - Examples if applicable

## 🔒 Security

**NEVER**:
- Commit `.env` files
- Hardcode secrets in code
- Expose API keys or tokens

See `SECURITY.md` for more details.

## 📞 Questions?

If you have questions:
- Create an issue with the `question` tag
- Consult existing documentation
- Check existing issues

---

Thank you for contributing to this project! 🎉
