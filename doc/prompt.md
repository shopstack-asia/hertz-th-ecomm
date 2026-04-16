# Agent session hint — hertz-th-ecomm

Before you implement anything in this repo:

1. Open and follow **[doc/ai-agent-instruction.md](./ai-agent-instruction.md)** end-to-end.  
2. Read **all** files in **[doc/rules/](./rules/)** listed there (`coding`, `testing`, `lint`, `documentation`, `feature-area-documentation`).  
3. Identify the **feature area**, then read **`doc/features/<feature-area>/`** in order: `README.md` → `domain-features.md` → `feature-logic-summary.md` → `features/*.md`. Create missing docs if you are changing behavior.  
4. Reuse **TypeScript types and helpers** from existing modules—**never guess** names or response shapes.  
5. **Never** call external backend APIs from client code; only **`/api/*`** Route Handlers in `src/app/api/` may integrate upstream.
6. See **[doc/README.md § Team implementation principles](./README.md#team-implementation-principles)** for the five stakeholder expectations (structure, docs, standards, CMS, BFF/proxy).

---

.... WHAT DO YOU WANT TO IMPLEMENT .....
