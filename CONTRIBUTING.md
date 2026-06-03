# Contributing to PackGo (Travel Planner)

Thank you for your interest in contributing to PackGo! We welcome contributions from everyone during GSSoC 2026.

---

## ⚠️ GSSoC 2026 Rules

- Only work on **assigned issues** — comment and wait for assignment before starting
- **No trivial changes** — whitespace, typo fixes in comments, or cosmetic README changes are not accepted
- **Respond to reviews within 48 hours** or PR may be closed
- Read full contributor guidelines: [GSSoC Contributor Guidelines](https://gssoc.girlscript.org/guidelines/contributor)

---

## 🤖 AI Conduct

- You **may use AI tools** (Copilot, ChatGPT) to understand concepts or debug
- You **must fully understand** every line you submit — reviewers will ask questions
- **Cite AI assistance** in your PR description if AI substantially helped
- **No copy-paste** of AI output without review and testing
- **No AI-generated** issue comments or maintainer communication

---

## Contribution Workflow

1. **Fork the repository** to your own GitHub account
2. **Clone your fork** locally:

```bash
   git clone https://github.com/your-username/Travel-Plans-.git
```

3. **Create a feature branch** — never commit to `main`:

```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
```

4. **Make your changes** following code style guidelines
5. **Test your changes** locally before submitting
6. **Commit your changes** using Conventional Commits format
7. **Push your branch**:

```bash
   git push origin feat/your-feature-name
```

8. **Open a Pull Request** against the `main` branch

---

## Syncing Upstream Changes

Keep your fork up-to-date with the main repository:

```bash
git remote add upstream https://github.com/hitesh-kumar123/Travel-Plans-.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

> ⚠️ **Never commit directly to your `main` branch** — always create a new branch for your changes!

---

## Local Environment Setup

### Server Setup

```bash
cd server
cp .env.example .env
```

### 📧 Setting Up Gmail App Password (for OTP emails)

> **Note:** Production server uses its own credentials. For local development, use your own Gmail App Password. Never commit credentials!

1. Go to [Google Account](https://myaccount.google.com)
2. **Security → 2-Step Verification** → Enable it
3. **Security → App passwords** → Select Mail → Other → type `PackGo`
4. Copy the 16-character password
5. Paste in `server/.env`:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

📖 [Official Guide](https://support.google.com/accounts/answer/185833)

### Client Setup

```bash
cd client
cp .env.example .env
```

Default `REACT_APP_API_URL=http://localhost:5000/api` works for local development ✅

---

## Pull Request Requirements

- Clear and descriptive PR title
- Fill out the PR Template completely
- Link issues using: `Closes #123` or `Fixes #123`
- UI changes **must include** before/after screenshots

---

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Use for               |
| ----------- | --------------------- |
| `feat:`     | New feature           |
| `fix:`      | Bug fix               |
| `docs:`     | Documentation changes |
| `refactor:` | Code restructuring    |
| `style:`    | Formatting only       |
| `test:`     | Adding/fixing tests   |
| `chore:`    | Build process changes |

Example: `feat: add Google authentication to login page`

---

## Code Style Rules

- **ESLint** and **Prettier** enforced
- Variables and functions → `camelCase`
- React components → `PascalCase`
- Clean, modular file organization

---

## Testing Expectations

Before submitting PR:

```bash
npm run lint          # Check ESLint errors
npm run format:check  # Check Prettier formatting
npm run build         # Ensure project builds (in client/)
```

- No console errors or warnings when running locally ✅

---

## Review Expectations

- **Review Timeline:** 24–48 hours
- Be responsive to feedback
- Complex PRs may require explanation of implementation

---

## 🌱 Beginner Contributor Guidance

1. Look for `good first issue` labeled issues
2. Comment on issue asking to be assigned — **wait for assignment**
3. Ask questions in the issue thread — we are here to help!

---

Thank you for contributing to PackGo!
