# Node.js + Tenor — Library GIF Bot Plan

This document captures the agreed plan to build a Discord bot that posts a random "library" GIF using Node.js, discord.js, and the Tenor API.

## One-line goal
Build a Node.js Discord bot that responds to a slash command (`/librarygif`) by posting a random library/reading GIF fetched from Tenor, with a local fallback.

## Contract (inputs / outputs / success criteria)
- Inputs
  - Environment variables: `DISCORD_TOKEN`, `TENOR_API_KEY` (optional if using local fallback)
  - Command: `/librarygif` (slash command) or `!librarygif` (optional prefix)
- Outputs
  - A Discord message containing an embed with a GIF URL or attached GIF file.
- Success
  - Bot starts, registers the slash command, and posts a valid GIF within a couple seconds when invoked.
  - Clear error message when GIFs are not available or on failures.

## Chosen stack (why)
- Node.js (LTS) — fast iteration, common ecosystem for Discord bots.
- discord.js v14+ — modern API, built-in slash command support.
- Tenor API — simple search endpoint returning GIFs suitable for this use-case.
- dotenv for local env management.

## File layout
- `package.json` — dependencies & scripts
- `.gitignore`
- `.env.example` — example environment variables
- `NODE_TENOR_PLAN.md` — this file
- `src/`
  - `index.js` — bot entry & login
  - `commands/`
    - `library.js` — slash command registration + handler
  - `lib/`
    - `gifProvider.js` — Tenor integration + fallback
  - `utils/`
    - `logger.js` — minimal logging helper
- `tests/`
  - `gifProvider.test.js` — unit tests for provider
- `deploy/`
  - `workflow.yml` — optional GitHub Actions example

## Step-by-step implementation
1. Initialize project and install dependencies.
2. Add `.env.example` with `DISCORD_TOKEN=` and `TENOR_API_KEY=`.
3. Implement `gifProvider.js`:
   - Export `getRandomLibraryGif()` which:
     - Searches Tenor for keywords ["library","books","reading","bookstore"], with safe-search.
     - If results exist, pick a random result and return a normalized object: `{ url, id, source }`.
     - On API failure or empty results, return a local fallback GIF from a `resources/gifs/` folder.
4. Implement `library` slash command:
   - Register command on startup (or via separate registration script).
   - Handler calls `getRandomLibraryGif()` and replies with an embed containing the GIF.
   - Include small caption and Tenor attribution (if provided).
5. Error handling & rate limits:
   - Catch Tenor errors, log details, and reply with a friendly message.
   - On HTTP 429, reply "Tenor rate limit reached — try again soon." and optionally cache last results.
6. Tests & lint:
   - Add unit test for `gifProvider` mocking Tenor responses.
   - Add ESLint + Prettier (or recommended formatting) and a basic lint script.
7. Deployment:
   - Host options: Railway, Render, Replit for quick deploy; or Docker on VPS.
   - Store `DISCORD_TOKEN` and `TENOR_API_KEY` as environment variables in the host.
   - Ensure auto-restart or process manager.
8. Docs & README:
   - Add setup, invite link generation (scopes: `bot`, `applications.commands`), and permission suggestions.

## Example PowerShell commands (local setup)
```powershell
# in project root
npm init -y
npm install discord.js dotenv node-fetch@2 axios
npm install -D eslint jest

# create .env (local dev) - DO NOT commit this file
# set DISCORD_TOKEN and TENOR_API_KEY in .env
```

## Env variables
- `DISCORD_TOKEN` — your bot token from the Discord Developer Portal
- `TENOR_API_KEY` — optional; Tenor’s API key. If omitted, plan to rely on a small local GIF pool

## Slash command details
- Name: `librarygif`
- Description: "Send a random library / reading GIF"
- Options: none required for MVP

## Edge cases and mitigations
- No GIFs found: try alternate keywords; if still none, respond with a friendly message and use local fallback.
- Rate limiting (429): detect and inform user; cache previous results to reduce calls.
- Missing permissions: check and inform the server admin if bot cannot send messages or embed links.
- NSFW / inappropriate results: use Tenor safe-search parameters and filter results by tags if needed.

## Tests and quality gates
- Lint: run `npm run lint` (ESLint)
- Unit tests: `npm test` (Jest) — mock Tenor responses
- Smoke test: run locally and call the slash command in a test server.

## Deployment recommendations
- Quick deploy: Railway or Replit (friendly env var UI)
- Production: Docker container on a VPS or cloud service with a restart policy
- Add simple monitoring (UptimeRobot) and centralized logs if needed

## Estimated time (single dev)
- Scaffold & install: 30–60 minutes
- Provider + command: 1–2 hours
- Tests, docs, deploy: 1–2 hours
Total MVP ~3–5 hours

## Next actions (recommended)
1. I can scaffold the Node.js project and implement the bot (create files, implement provider and command, add tests).
2. Or, you can implement locally using this plan — tell me if you want me to scaffold now.

---
Saved plan for `Node.js + Tenor` implementation. If you want me to proceed and scaffold the project now, tell me and I will create the project files and implement the MVP.
