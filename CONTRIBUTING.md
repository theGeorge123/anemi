# Contributing Guide

## Development Environment
- Node.js 20.x (see `.nvmrc`)
- npm 10+

## Getting Started
1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Copy `env.example` to `.env.local` and fill in required variables.
4. Run `npm run dev` to start the development server.

## Branching
- Create branches from `main`.
- Use descriptive names like `feat/add-invite-api`.

## Commit Messages
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Tests
- Run `npm test` and `npm run lint` before committing.
- Ensure CI checks pass on pull requests.

## Code Style
- We use ESLint and Prettier.
- Format code with `npm run format` and fix lint issues with `npm run lint`.
