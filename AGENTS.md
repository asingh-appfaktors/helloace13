# AppFaktors Agent Ecosystem

This document describes the agent roster, their responsibilities, and the data contracts they share.

## Agent Roster

| Agent | Role | Trigger |
|-------|------|---------|
| `appfaktors-project-workflow` | Slim orchestrator — iterates over project tasks in topo order, delegates to task workflow | "work on project PRJ12345" |
| `appfaktors-task-workflow` | Slim orchestrator — drives a single task from status check through PR merge | "continue with TSK12345" |
| `ace-project-planner` | Fetches project, computes topological execution plan | Delegated by project-workflow |
| `ace-task-planner` | Loads spec from task attachment (mandatory); reads docker-compose / technologyContext; produces TaskPlan attached to task; caches app context and best practices locally | Delegated by task-workflow |
| `ace-developer` | Creates branch, writes tests first (immutable), drives Docker-sandboxed codegen loop until tests pass + app clean | Delegated by task-workflow |
| `ace-debugger` | Systematic root-cause investigation when codegen loop fails (4-state machine: ROOT_CAUSE → PATTERN → HYPOTHESIS → FIX) | Optional: invoked from ace-developer exhaustion |
| `ace-pr-finalizer` | Creates GitHub PR with correct metadata | Delegated by task-workflow |
| `ace-code-reviewer` | Reviews PR code for spec alignment, architectural conformity, clarity, correctness, and test quality | Delegated by task-workflow |
| `ace-merge-coordinator` | Marks task Done in AppFaktors, advances DAG ready queue | Delegated by project-workflow |
| `ace-scaffold-workspace` | Fetches stack from docker-compose / technologyContext; writes .gitignore, .dockerignore, directory tree, README local-dev, docker-compose.yml, and CLAUDE.md | Standalone invocation only |

---

## Data Contracts (Inter-Agent Communication)

The following objects flow between agents. For detailed field definitions, refer to each agent's **SKILL.md Output section**.

| Contract | Producer | Consumer | Definition |
|----------|----------|----------|------------|
| **ProjectPlan** | `ace-project-planner` | `appfaktors-project-workflow` | [ace-project-planner/SKILL.md](./ace-project-planner/SKILL.md) |
| **TaskPlan** | `ace-task-planner` | `ace-developer` | [ace-task-planner/SKILL.md](./ace-task-planner/SKILL.md) |
| **TaskContext** | `ace-developer` / `ace-pr-finalizer` | `appfaktors-task-workflow` | [ace-developer/SKILL.md](./ace-developer/SKILL.md) |
| **CodeReview** | `ace-code-reviewer` | `appfaktors-task-workflow` | [ace-code-reviewer/SKILL.md](./ace-code-reviewer/SKILL.md) |
| **DebugResult** | `ace-debugger` | `ace-developer` / user | [ace-debugger/SKILL.md](./ace-debugger/SKILL.md) |
| **MergeCoordinatorResult** | `ace-merge-coordinator` | `appfaktors-project-workflow` | [ace-merge-coordinator/SKILL.md](./ace-merge-coordinator/SKILL.md) |

---

## Local Cache Files

The following local cache files are written by ACE agents to avoid redundant API calls:

| File | Written By | Read By | Purpose |
|------|-----------|---------|---------|
| `PROJECT.md` | **ace-scaffold-workspace** | all agents, developers | **Product Vision & Overview** — business application description, architecture summary, and high-level guidance. Read first by developers to understand project intent and constraints. |
| `.app-context.json` | `ace-task-planner`, **ace-scaffold-workspace** | `ace-task-planner`, `ace-code-reviewer`, all downstream agents | Project-level cached application context (technology stack, architecture patterns) — written at scaffold time, reused by all tasks |
| `.tech-best-practices.md` | `ace-task-planner` | `ace-code-reviewer`, `ace-debugger` | Cached best practices for primary language — per-language cache, shared across all tasks |
| `.design-tokens.json` | `ace-task-planner`, **ace-scaffold-workspace** | `ace-developer`, `ace-code-reviewer`, `ace-debugger` | Project-level cached design tokens kit for UI components — written by scaffold if frontend detected, ensures tokens available for all UI tasks |
| `.build-plan.json` | **ace-scaffold-workspace** | all agents (optional) | Multi-service architecture blueprint with buildableDeployables and infraDeployables — reference for understanding service topology and infrastructure |

**Note:** These files are **checked into version control** and shared with all team members. They are authoritative project artifacts that define architecture, design system, and technology context.

**Cache invalidation:** If you need to refresh these caches (e.g., after updating the application context in AppFaktors):
1. Re-run `ace-scaffold-workspace` to regenerate the caches
2. Commit the updated files to version control
3. All team members pull the fresh caches
- Or delete all to force fresh API calls across the board

---

## Cache-First Pattern

All agents follow a **cache-first pattern** to minimize API calls and improve resilience:

1. **ace-task-planner (FETCH_CONTEXT):**
   - Check if `.app-context.json` exists → read and use
   - If not: call `get_business_application_context` → write cache
   - Same pattern for `.tech-best-practices.md` and `.design-tokens.json`

2. **ace-code-reviewer (FETCH_TASK_CONTEXT):**
   - Check if `.app-context.json` exists → read and use
   - Check if `.tech-best-practices.md` exists → read and use
   - If not: call MCP tools → write cache

3. **ace-scaffold-workspace (FETCH_CONTEXT):**
   - Calls `get_business_application_context` to detect tech stack
   - Writes result to `.app-context.json` for downstream agents
   - If frontend detected: calls `get_ui_template_kit_content` → writes `.design-tokens.json`

4. **ace-developer (CODEGEN_LOOP):**
   - Reads `.design-tokens.json` if present and no design_tokens in TaskPlan
   - Uses tokens for UI code generation guidance

**Benefits:**
- Reduced API calls within a project (one `get_business_application_context` call per project)
- Consistent context across all tasks
- Offline fallback if SaaS API unavailable
- Guaranteed design tokens available for all UI tasks (even if ace-task-planner's detection misses)

---

## Shared MCP Tools

All agents use these via the AppFaktors MCP server (Tool interface, never bash):

| Tool | Used By | Notes |
|------|---------|-------|
| `get_task_details` | task-workflow, ace-task-planner, ace-developer | |
| `update_task_attribute` | task-workflow, ace-developer, merge-coordinator | |
| `update_task_checklist_item` | ace-developer | |
| `add_task_comment` | ace-developer | |
| `add_task_attachment` | ace-task-planner, **ace-developer** (for test report) | |
| `get_all_project_tasks` | project-planner | |
| `list_all_projects` | project-workflow | |
| `get_business_application_context` | **ace-scaffold-workspace** (project-level), ace-task-planner, ace-code-reviewer | Cached to `.app-context.json` — project-level cache written by scaffold, reused by all agents |
| `get_tech_best_practices` | ace-task-planner, ace-code-reviewer | Cached to `.tech-best-practices.md` after first call per language |
| `get_ui_template_kit_content` | **ace-scaffold-workspace** (if frontend detected), ace-task-planner (UI tasks) | Cached to `.design-tokens.json` — ensures tokens available for all UI tasks in project |

**Note:** Code generation execution is entirely local (in the skill). No MCP codegen tools exist. PR creation uses `gh` CLI locally — no MCP tool mirroring.

---

## Composition Pattern

```
appfaktors-project-workflow
  └─► ace-project-planner           (plan)
  └─► appfaktors-task-workflow       (per task, in topo order)
        └─► ace-task-planner         (produces TaskPlan, attaches to task)
        └─► ace-developer            (branch + WRITE_TESTS + CODEGEN_LOOP)
              └─► ace-debugger       (optional: systematic debugging if codegen exhausts)
        └─► ace-pr-finalizer         (create PR)
        └─► ace-code-reviewer        (review code before merge)
  └─► ace-merge-coordinator          (mark done, unblock next)

ace-scaffold-workspace               (standalone invocation only)
ace-compliance-checker               (standalone invocation only)
ace-debugger                         (also callable standalone for ad-hoc debugging)
```

Orchestrators hold state. ACE agents are stateless workers — they receive a context object and return a result object.
