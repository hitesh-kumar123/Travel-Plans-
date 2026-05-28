# Contributing to Travel Planner

Thank you for your interest in contributing to Travel Planner! We welcome contributions from everyone and appreciate your efforts to help improve this project.

## Contribution Workflow

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** locally: `git clone https://github.com/your-username/Travel-Plans-.git`
3. **Create a feature branch** for your work: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bug-fix`
4. **Make your changes** following the code style guidelines.
5. **Test your changes** to ensure they work correctly and don't break existing features.
6. **Commit your changes** using Conventional Commits format.
7. **Push your branch** to your fork: `git push origin feature/your-feature-name`
8. **Open a Pull Request (PR)** against the `main` branch of the original repository.

### Syncing Upstream Changes

To keep your fork up-to-date with the main repository:

```bash
git remote add upstream https://github.com/hitesh-kumar123/Travel-Plans-.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Local Environment Setup

After cloning your fork, set up your environment variables:

### Server Setup

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your values. Most fields are self-explanatory — the only one that needs a special setup is the **Email (OTP)** configuration.

### 📧 Setting Up Gmail App Password (for OTP emails)

> **Note:** The production server uses its own email credentials. For local development, **you must use your own Gmail App Password**. Do not share or commit your credentials.

**Steps:**

1. Go to your Google Account → [https://myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security → How you sign in to Google → 2-Step Verification** and enable it
3. After enabling, go to **Security → App passwords**
4. Select app: **Mail** → device: **Other** → type `TravelPlanner`
5. Google will show a **16-character password** — copy it
6. Paste it in your `server/.env`:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

📖 Official Guide: https://support.google.com/accounts/answer/185833

### Client Setup

```bash
cd client
cp .env.example .env
```

The default `REACT_APP_API_URL=http://localhost:5000/api` works for local development. No changes needed.

---

## Pull Request Requirements

When creating a Pull Request, please ensure you:

- Use a clear and descriptive PR title (following commit message conventions if possible).
- Fill out the provided Pull Request Template completely.
- Link the PR to any relevant issues using the closing keyword syntax in the description (e.g., `Fixes #123` or `Resolves #456`).

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Please use the following prefixes:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

Example: `feat: add Google authentication to login page`

## Code Style Rules

- We use **ESLint** and **Prettier** to enforce code quality and formatting.
- Variables and functions should use `camelCase`.
- React components should use `PascalCase`.
- Maintain clean, modular file organization within the `client/src/components` and `server/controllers` directories.

## Testing Expectations

Before submitting a PR, please ensure:

1. You have run the linting script: `npm run lint` (or checked for ESLint errors).
2. You have formatted your code: `npm run format:check` or let your IDE format via Prettier.
3. The project builds successfully: `npm run build` (in the client directory).
4. There are **no console errors or warnings** when running the application locally.

## Review Expectations

- **Typical Review Timeline:** Project Admins aim to review PRs within **24–48 hours**.
- **Code Walkthrough:** For complex PRs, you may be asked to explain your implementation details to ensure it aligns with the project's architecture.
- Please be responsive to feedback and make requested changes promptly.

## Beginner Contributor Guidance

If you are new to Open Source or this project:

1. Look for issues labeled `good first issue`. These are specifically selected to be approachable.
2. If you want to work on an issue, comment on it asking to be assigned. **Wait for assignment** before starting work to avoid duplicated effort.
3. If you have questions, feel free to ask in the issue thread! We are here to help.

Thank you for contributing!
