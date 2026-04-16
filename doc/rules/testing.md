# Testing standards — hertz-th-ecomm

## 0. Test runner

Commands:

- `npm test` — run all tests once  
- `npm run test:watch` — watch mode during development  
- `npm run test:ci` — CI run with coverage  

Framework: Jest + React Testing Library + jest-dom  
Config: `jest.config.ts` at repo root  
Setup file: `jest.setup.ts` (imports `@testing-library/jest-dom`)

## 1. Mandatory rules

- **Every meaningful change** to logic must include **new or updated tests** that prove the behavior.  
- **Skipping tests** to finish faster is not allowed when conventions in this document apply.  
- When introducing a new runner or conventions, **add tests in the same effort** that wires the runner; do not leave a gap between tooling and coverage.

## 2. Test scope

| Area | What to test |
|------|----------------|
| **API route handlers** | Happy path, upstream failure / timeout handling, **auth guard** behavior, status codes and **mapped** error bodies. |
| **Utility functions** | All branches, boundary inputs, and stable outputs. |
| **Context providers** | Important **state transitions** and side effects (e.g. login/logout, locale change) using React Testing Library or the project’s chosen approach. |
| **Components** | **Complex** interactions: multi-step forms, conditional rendering from props/state, accessibility-critical controls. Skip trivial presentational-only snapshots unless they add value. |

## 3. Required test cases

For each meaningful unit of behavior, include where applicable:

- **Happy path** — expected success input and output.  
- **Error path** — failures from upstream or validation; assert **user-visible or API contract** outcomes, not only thrown errors.  
- **Edge cases** — empty lists, missing optional fields, boundary dates/numbers.  
- **Validation** — invalid input rejected with the correct shape/message.

## 4. Test quality rules

- Assertions target **observable behavior** (returned JSON, rendered text, callbacks invoked), not private implementation details unless necessary.  
- **Test names** read as behavior: `it('returns 401 when session cookie is missing', ...)`.  
- Avoid **flaky** timing; use deterministic clocks/mocks when testing time-sensitive logic.

## 5. Output and reporting requirement

Task completion reports must list:

- **Test files** added or changed.  
- **What behavior** each new test covers.  
- **Test command** executed (e.g. `npm test`) and **pass/fail** result.

If tests cannot be run in the current environment, the report must state that explicitly and still list the test files and intended command.
