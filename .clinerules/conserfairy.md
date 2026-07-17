# ConserFAIRy Agent Rules

## 1. Core Architecture & Monorepo
- Workspace root: `/home/mempellaenger/repos/conserFAIRy`
- `backend/`: Django + django-ninja + PostgreSQL/JSONB.
- `frontend/`: Vite + React + TypeScript + shadcn/ui.
- `schemas/`: Generated Pydantic models and JSON Schema artifacts.
- `knowledge/`: specs, domain docs, and memory-bank.

## 2. Memory Bank Folder
`knowledge/memory-bank`

## 3. When to Read Memory Bank Files
- Read `knowledge/memory-bank/projectbrief.md`, `knowledge/memory-bank/techContext.md`, `knowledge/memory-bank/activeContext.md`, `knowledge/memory-bank/gotchas.md` and `knowledge/memory-bank/engineering.md` at the start of EVERY session.
- Read `knowledge/memory-bank/systemPatterns.md` or `knowledge/memory-bank/productContext.md` when starting a new feature or if you lack domain context.

## 4. When to Write / Update Memory Bank Files
- **`activeContext.md`**: Update at the END of every session or when switching major tasks. Document what is currently being worked on, the next steps and also delayed/skipped tasks.
- **`progress.md`**: Update when a significant milestone or feature is completed. Remove from **`activeContext.md`**.
- **`gotchas.md`**: If you encounter a weird bug, a framework quirk, or a pattern that breaks, document it here immediately so future sessions don't repeat the mistake.
- **`techContext.md`**: If another important technical framework/library choice is made.
- **`systemPatterns.md`**: When new architectural patterns or design decisions are established.
- **`productContext.md`**: When product functionality or feature requirements change.
- **`projectbrief.md`**: Keep the short project description up to date with new functionalities.

## 5. Contradiction Handling
If you find a contradiction, missing referenced file or information out of place in the memory bank, raise it instantly to solve it with the user.