# Contributing to Persona Fashion

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth collaboration.

---

## Branch Naming

Use descriptive branch names with the appropriate prefix:

| Prefix      | Purpose                          | Example                          |
| ----------- | -------------------------------- | -------------------------------- |
| `feature/`  | New features or enhancements     | `feature/coupon-system`          |
| `fix/`      | Bug fixes                        | `fix/cart-total-calculation`     |
| `refactor/` | Code refactoring (no new features) | `refactor/simplify-auth-flow` |

---

## Commit Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                          |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `docs`     | Documentation changes                |
| `style`    | Code style (formatting, semicolons)  |
| `refactor` | Code refactoring                     |
| `perf`     | Performance improvement              |
| `test`     | Adding or updating tests             |
| `chore`    | Build, CI, or tooling changes        |

### Examples

```
feat(cart): add coupon code validation endpoint
fix(auth): resolve session expiry redirect loop
docs(readme): add API overview section
refactor(products): extract shared JSON parsing utility
```

---

## Pull Request Process

1. **Create an issue** — Describe the bug or feature before starting work.
2. **Fork & branch** — Create a branch from `main` using the naming convention above.
3. **Write code** — Follow the existing code style and conventions:
   - TypeScript with strict types
   - Use shadcn/ui components where possible
   - Follow the project's ESLint rules (`bun run lint`)
4. **Add tests** — Include tests for new features or bug fixes (`bun run test`).
5. **Update docs** — Update README or inline docs if your change affects the public API.
6. **Ensure CI passes** — All lint, type-check, test, and build steps must pass.
7. **Open a PR** — Fill in the PR template with:
   - Summary of changes
   - Related issue number
   - Screenshots (for UI changes)
   - Testing instructions
8. **Review** — At least one approval is required before merging.
9. **Squash merge** — PRs are squash-merged to keep the history clean.

---

## Development Setup

```bash
bun install
cp .env.example .env
bun run db:push
bun run db:generate
bun run dev
```

---

## Code Style

- **TypeScript** — Strict mode, no `any` types (use `unknown` + type narrowing)
- **Components** — Use `'use client'` directive for client components
- **Styling** — Tailwind CSS utilities; avoid inline styles except for dynamic values
- **Imports** — Use `@/` path aliases for `src/` imports
- **APIs** — Use the standardized response helpers from `@/lib/api-response`

---

Thank you for contributing to Persona Fashion!
