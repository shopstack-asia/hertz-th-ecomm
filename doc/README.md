# Documentation — hertz-th-ecomm

This folder holds **repository-wide** documentation: how AI agents and developers should work in this codebase, where feature logic is documented, and which rules apply before implementation.

It is **not** the primary store for per-feature business logic. That lives under `doc/features/<feature-area>/`.

## Table of contents (files under `doc/`)

| Path | Purpose |
|------|---------|
| [README.md](./README.md) | This file: role of `doc/`, TOC, [team implementation principles](#team-implementation-principles), feature-area definition, resolution order, root vs feature docs. |
| [ai-agent-instruction.md](./ai-agent-instruction.md) | **Mandatory entry** for AI agents: workflow, rule files, completion gates, final report format. |
| [feature-logic-summary.md](./feature-logic-summary.md) | **Global navigation index** only: links each feature area to its doc folder under `doc/features/`. |
| [prompt.md](./prompt.md) | Short reminder prompt for agents (copy/paste or session hint). |
| [rules/coding.md](./rules/coding.md) | Coding and architecture standards (App Router, BFF, components, contexts, services). |
| [rules/testing.md](./rules/testing.md) | Testing standards: scope, required cases, quality, reporting. |
| [rules/lint.md](./rules/lint.md) | TypeScript and ESLint quality gates and how to report results. |
| [rules/documentation.md](./rules/documentation.md) | Where and how to write feature docs and when to update them. |
| [rules/feature-area-documentation.md](./rules/feature-area-documentation.md) | Required structure and naming for `doc/features/<feature-area>/`. |

## Team implementation principles

Stakeholder-aligned expectations for extending this codebase (human developers and AI agents). These complement the detailed rules under `doc/rules/` and `.cursor/rules/ai-agent.mdc` (stakeholder checklist is **section 2** there, mirroring this section).

1. **Continue the existing structure; do not invent behavior** — Extend the established layers and patterns in [rules/coding.md](./rules/coding.md). Resolve product behavior from **feature-area docs** and **existing code**; do not assume API shapes or business rules without evidence.

2. **Keep documentation current** — When behavior, validation, user flows, or BFF contracts change, update the relevant **`doc/features/<feature-area>/`** documentation per [rules/documentation.md](./rules/documentation.md). Root `doc/` describes standards and workflow; per-feature folders remain the **canonical** place for domain behavior.

3. **Stick to agreed coding standards** — Follow [rules/coding.md](./rules/coding.md), [rules/lint.md](./rules/lint.md), and [rules/testing.md](./rules/testing.md) (architecture boundaries, i18n, naming, quality gates).

4. **Design for CMS where content belongs** — Prefer CMS-backed configuration and pages for editorial or site-wide settings (feature area **`cms`**, e.g. `src/lib/cms/`, `src/app/api/cms/*`) instead of hardcoding content that should be managed in Commerce Suite / CMS.

5. **BFF / proxy pattern (sometimes called “proxy page”)** — The browser must call **only** same-origin **`/api/*`** Route Handlers under `src/app/api/`; those handlers integrate with Commerce Suite or other upstream APIs. **Never** call external backend base URLs from client components for business operations. See the root [README.md](../README.md) (Architecture) and [ai-agent-instruction.md](./ai-agent-instruction.md) (§9 BFF enforcement). Client code may use helpers such as `src/lib/api/proxy_fetch.ts` to call **`/api/*` only**.

## What is a “feature area”?

A **feature area** is a **business domain module** (booking, checkout, auth, etc.), not a single file or folder name.

- It maps to user-visible capabilities and BFF surfaces that belong together.  
- Code may span `src/app/(site)/`, `src/components/`, `src/app/api/`, and `src/contexts/`.  
- Use the global index in [feature-logic-summary.md](./feature-logic-summary.md) to pick the correct `<feature-area>` name and doc path.

## Module / feature documentation resolution order

**For AI agents and developers (before implementation):**

1. [ai-agent-instruction.md](./ai-agent-instruction.md)  
2. All files in [rules/](./rules/) listed as mandatory there  
3. `doc/features/<feature-area>/README.md`  
4. `doc/features/<feature-area>/domain-features.md`  
5. `doc/features/<feature-area>/feature-logic-summary.md`  
6. Detailed files under `doc/features/<feature-area>/features/`  
7. Related application code (pages, components, API routes, contexts, services)

If step 3–6 are missing for an area you are changing, create or extend them per [rules/feature-area-documentation.md](./rules/feature-area-documentation.md).

## Where feature-area docs live

All per-area business documentation:

```text
doc/features/<feature-area>/
```

See [rules/documentation.md](./rules/documentation.md) and [rules/feature-area-documentation.md](./rules/feature-area-documentation.md) for the required file layout.

## Root `doc/` vs `doc/features/`

| Location | Content |
|----------|---------|
| `doc/` | Shared standards, AI workflow, global index, lint/testing rules. **No** feature-specific business logic as the canonical source. |
| `doc/features/<feature-area>/` | **Canonical** feature behavior: flows, validation, API contracts from the app’s perspective, edge cases, links to code. |

When a BFF route or user flow changes, update the **feature area** docs that own that behavior—not only this README.
