# Contributing to Ultimate Tic-Tac-Toe

Thank you for your interest in contributing! This guide covers the workflow and standards for this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/sachinksamad1/ultimate-tic-tac-toe.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Branch Naming

| Type          | Format                 | Example                        |
| ------------- | ---------------------- | ------------------------------ |
| Feature       | `feature/description`  | `feature/dark-mode`            |
| Bug fix       | `bugfix/description`   | `bugfix/free-move-validation`  |
| Documentation | `docs/description`     | `docs/add-security-docs`       |
| Refactor      | `refactor/description` | `refactor/extract-game-engine` |
| Chores        | `chore/description`    | `chore/update-dependencies`    |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

```
feat(engine): add free move validation logic
fix(backend): correct nextTargetBoard calculation after local win
docs: add security and testing architecture docs
test(engine): add win condition test suite
```

## Code Style

- **Linting**: ESLint rules are enforced. Run `pnpm lint` before committing.
- **Formatting**: Prettier handles formatting. Run `pnpm format` or use editor integration.
- **TypeScript**: Strict mode enabled. No `any` types without justification.
- **Naming**: camelCase for variables/functions, PascalCase for components/types, UPPER_SNAKE_CASE for constants.

## Pull Request Process

### Before Submitting

- [ ] All tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`
- [ ] Type checking passes: `pnpm typecheck`
- [ ] Code is formatted: `pnpm format`
- [ ] Commits follow conventional commit format

### PR Template

```markdown
## Summary

- What changed and why

## Testing

- How was this tested
- Screenshots if UI changed

## Notes

- Any caveats, follow-up work, or breaking changes
```

### Review Requirements

- At least 1 approval required
- All CI checks must pass (lint, test, typecheck)
- Address all review comments before merge

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Project Structure

```
ultimate-tic-tac-toe/
├── apps/
│   ├── server/          # Backend (Express + Socket.io)
│   └── web/             # Frontend (SvelteKit)
├── packages/
│   └── shared/          # Shared types and game engine
├── docs/                # Architecture and task docs
└── CONTRIBUTING.md
```

## Reporting Issues

When filing a bug report, include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS
- Console/server logs if applicable

For feature requests, describe the problem you're trying to solve and proposed solution.
