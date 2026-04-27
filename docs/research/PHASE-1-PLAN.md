# Phase 1: Research Best Practices (Option D — Full Breadth)

**Part of:** Template build effort
**Phase:** 1 of 4 (Research)
**Effort budget:** 18-25 days (~3-4 weeks calendar at 4-6h/day)
**Total time:** ~70 hours
**Owner:** Logan (self-driven research)
**Output location:** `docs/research/` in template repo
**Approach:** Maximize learning breadth, build long-term mental model

---

## Why Option D (full breadth)

This phase prioritizes **learning depth and breadth** over immediate WOO applicability. Some references study patterns relevant to v2.0+ scale or alternative approaches not chosen for WOO. Investment justified by:

- Mental model compounds over career, not just WOO
- Premature references (Cal.com, Fly.io) build capacity for future scale
- Studying alternatives reveals trade-offs of chosen approaches
- Comprehensive understanding > pragmatic minimum

This is **learning investment**, not just WOO prep.

---

## Goal

Investigate 33 world-class implementations across 9 architectural layers. Document patterns, trade-offs, and learnings. Build comprehensive foundation of knowledge before designing template.

By end of Phase 1, you should have:
- 33 reference notes (3-6 per layer)
- Synthesis document identifying common patterns
- Mental model of solution space across full architecture
- Clarity on WOO-specific applications and broader patterns

---

## Phase 1 mindset

**This is learning phase, not building phase.**

Goals:
- Understand WHY references made their choices
- Identify trade-offs each pattern accepts
- Build broad mental model of solution space
- Spot patterns invisible from single-perspective study

NOT goals:
- Decide template implementation (Phase 2)
- Write template code (Phase 3)
- Validate against WOO (Phase 4)

If you find yourself wanting to start coding, resist. Phase 1 is research only.

---

## Phase 1 execution structure

### Distribution per layer

| Layer | References | Hours | Days |
|-------|------------|-------|------|
| 1 Code | 3 | 6-7 | 2 |
| 8 Knowledge & Workflow | 4 | 8-9 | 2-3 |
| 9 Operations | 3 | 6-7 | 2 |
| 6 Security | 4 | 8-9 | 2-3 |
| 2 API | 4 | 8-9 | 2-3 |
| 7 AI Integration | 6 | 13-14 | 4 |
| 5 Data | 3 | 5-6 | 1-2 |
| 3 Product/Design | 4 | 8-9 | 2-3 |
| 4 Localization | 2 | 3-4 | 1-2 |
| **Total** | **33** | **65-75** | **18-22** |

Plus Day 23 (or final day): synthesis document.

### Sequential by layer

Process one layer at a time. Sequence:

1. Foundation first (Layers 1, 8, 9): underpin everything
2. Constraints next (Layer 6): security shapes other layers
3. Contracts (Layer 2): API connects layers
4. Most complex (Layer 7): AI Integration is distinctive — biggest investment
5. Specifics (Layers 5, 3, 4): analytics, design, i18n

**Rationale:** Foundation references build context for later references. Layer 7 mid-sequence so you have framing from earlier layers but still have energy.

### Daily structure

**Days 1-2:** Layer 1 — 3 references
**Days 3-5:** Layer 8 — 4 references
**Days 6-7:** Layer 9 — 3 references
**Days 8-10:** Layer 6 — 4 references
**Days 11-13:** Layer 2 — 4 references
**Days 14-17:** Layer 7 — 6 references (most depth, longest stretch)
**Days 18-19:** Layer 5 — 3 references
**Days 20-22:** Layer 3 — 4 references
**Days 23-24:** Layer 4 — 2 references
**Day 25:** Synthesis

**Calendar:** 25 days at part-time. Sustained focused work could compress to 18-21 days.

---

## Per-reference workflow

For each reference, follow this workflow:

### Step 1: Initial scan (15-20 min)

- Read repo README or main documentation
- Browse top-level structure
- Note overall philosophy
- Identify 3-5 files/sections to dive into

### Step 2: Deep dive (60-90 min)

- Read identified files in depth
- Understand patterns chosen
- Note specific code examples
- Identify why patterns chosen (architectural rationale)

### Step 3: Document notes (30-60 min)

- Use note template (`REFERENCE-NOTE-TEMPLATE.md`)
- Capture: what's notable, learnings, what to adopt, what to skip
- Concrete examples (code snippets) where useful
- Be honest about uncertainty

**Total: 1.5-2.5 hours per reference average. Range 1-3 hours depending on complexity.**

Layer 7 (AI Integration) references warrant longer per reference (2-3 hours each).

---

## Reference list per layer (Option D — Full Breadth)

### Layer 1: Code (3 references — 6-7 hours)

#### Reference 1.1: Vercel Turborepo Examples

- **URL:** https://github.com/vercel/turborepo/tree/main/examples
- **Why:** Direct relevance, official Turborepo patterns
- **Focus:** `with-tailwind`, `with-shell-commands` examples
- **Time:** 2 hours
- **Priority:** Critical (our tool)

#### Reference 1.2: T3 Stack (`create-t3-app`)

- **URL:** https://github.com/t3-oss/create-t3-app
- **Why:** Opinionated full-stack template, documented decisions
- **Focus:** Project structure, dependency choices, tsconfig setup
- **Time:** 2 hours
- **Priority:** High (similar scope to template)

#### Reference 1.3: Cal.com Repo

- **URL:** https://github.com/calcom/cal.com
- **Why:** Mature large-scale Next.js application
- **Focus:** `apps/` and `packages/` structure, complexity management
- **Time:** 2.5-3 hours
- **Priority:** Forward-looking (v2.0+ scale patterns)

---

### Layer 8: Knowledge & Workflow (4 references — 8-9 hours)

#### Reference 8.1: ADR GitHub Organization

- **URL:** https://adr.github.io/
- **Why:** Canonical ADR resource
- **Focus:** Different ADR template variants
- **Time:** 1.5 hours
- **Priority:** Critical (template structure)

#### Reference 8.2: GitLab Handbook (Engineering)

- **URL:** https://about.gitlab.com/handbook/
- **Why:** Most documented engineering culture publicly
- **Focus:** Engineering section, "How we work"
- **Time:** 2.5 hours
- **Priority:** High (culture model)

#### Reference 8.3: Stripe Engineering Blog

- **URL:** https://stripe.com/blog/engineering
- **Why:** Decision-making in action
- **Focus:** Architecture decisions, internal tooling posts
- **Time:** 2 hours (selective reading)
- **Priority:** High (case studies)

#### Reference 8.4: Basecamp's Shape Up

- **URL:** https://basecamp.com/shapeup
- **Why:** Different paradigm for product cycles
- **Focus:** Shaping process, betting table, 6-week cycles
- **Time:** 2-2.5 hours (read book online)
- **Priority:** Forward-looking (team scale prep)

---

### Layer 9: Operations (3 references — 5-7 hours)

#### Reference 9.1: Vercel Deployment Documentation

- **URL:** https://vercel.com/docs/deployments
- **Why:** Direct relevance, our deployment platform
- **Focus:** Preview deployments, env management, rollback
- **Time:** 1.5-2 hours
- **Priority:** Critical (our tool)

#### Reference 9.2: GitHub Actions Best Practices

- **URL:** https://docs.github.com/en/actions/learn-github-actions/best-practices
- **Why:** Direct relevance, our CI tool
- **Focus:** Workflow design, secrets, caching
- **Time:** 1.5 hours
- **Priority:** Critical (our tool)

#### Reference 9.3: Fly.io Documentation

- **URL:** https://fly.io/docs/
- **Why:** Multi-region paradigm, modern deployment
- **Focus:** Deployment philosophy, health checks, observability
- **Time:** 2-3 hours
- **Priority:** Forward-looking (v2.5+ multi-region)

---

### Layer 6: Security (4 references — 8-9 hours)

#### Reference 6.1: Supabase Security Documentation

- **URL:** https://supabase.com/docs/guides/auth, https://supabase.com/docs/guides/database/postgres/row-level-security
- **Why:** Direct relevance, our database
- **Focus:** RLS patterns, auth flows, JWT handling
- **Time:** 2.5-3 hours
- **Priority:** Critical (our tool)

#### Reference 6.2: OWASP Top 10

- **URL:** https://owasp.org/www-project-top-ten/
- **Why:** Industry-standard security risks
- **Focus:** Injection, broken auth, sensitive data exposure
- **Time:** 2 hours
- **Priority:** Critical (security baseline)

#### Reference 6.3: Auth.js (NextAuth) Documentation

- **URL:** https://authjs.dev/
- **Why:** Alternative auth approach
- **Focus:** Provider patterns, session management, callbacks
- **Time:** 2 hours
- **Priority:** Comparative (understand alternative)

#### Reference 6.4: Clerk Documentation

- **URL:** https://clerk.com/docs
- **Why:** Polished auth-as-a-service, UX patterns
- **Focus:** User management UI, multi-factor flows
- **Time:** 1.5-2 hours
- **Priority:** UX-focused (modern patterns)

---

### Layer 2: API (4 references — 8 hours)

#### Reference 2.1: Stripe API Documentation

- **URL:** https://stripe.com/docs/api
- **Why:** Industry-standard API design
- **Focus:** Resource modeling, error responses, idempotency
- **Time:** 2.5 hours
- **Priority:** High (principles)

#### Reference 2.2: tRPC Documentation

- **URL:** https://trpc.io/docs
- **Why:** Direct relevance, our API tool
- **Focus:** Procedure design, error handling, middleware
- **Time:** 2 hours
- **Priority:** Critical (our tool)

#### Reference 2.3: GitHub REST API

- **URL:** https://docs.github.com/en/rest
- **Why:** Long-evolved API, versioning history
- **Focus:** Versioning strategy, pagination, rate limiting
- **Time:** 2 hours
- **Priority:** Forward-looking (v2.0+ public API patterns)

#### Reference 2.4: OpenAPI Specification

- **URL:** https://swagger.io/specification/
- **Why:** Industry-standard API documentation format
- **Focus:** Schema definitions, security schemes, components
- **Time:** 1.5 hours
- **Priority:** Critical (we auto-generate this)

---

### Layer 7: AI Integration (6 references — 13-14 hours)

This layer gets most depth. Allocate 4 days. Don't rush.

#### Reference 7.1: Anthropic Claude Code Documentation

- **URL:** https://docs.claude.com/en/docs/claude-code/
- **Why:** Direct relevance, skills + agents architecture
- **Focus:** Skills, subagents, hooks, sessions
- **Time:** 3 hours
- **Priority:** Critical (our tool)

#### Reference 7.2: Anthropic SDK Documentation

- **URL:** https://docs.claude.com/en/api/
- **Why:** Direct relevance, our SDK
- **Focus:** API patterns, streaming, tool use, prompt caching
- **Time:** 2 hours
- **Priority:** Critical (our SDK)

#### Reference 7.3: Vercel AI SDK

- **URL:** https://sdk.vercel.ai/docs
- **Why:** Production-grade AI integration patterns for Next.js
- **Focus:** Streaming, tools, function calling, error handling
- **Time:** 2 hours
- **Priority:** High (production patterns)

#### Reference 7.4: OpenAI Cookbook

- **URL:** https://cookbook.openai.com/
- **Why:** Practical patterns for LLM integration
- **Focus:** Prompt patterns, evals, function calling
- **Time:** 2 hours
- **Priority:** High (transferable patterns)

#### Reference 7.5: LangChain Documentation

- **URL:** https://js.langchain.com/docs
- **Why:** Multi-step agents, chain patterns
- **Focus:** Agent architecture, retrieval, memory
- **Time:** 2.5 hours
- **Priority:** Forward-looking (multi-step pedagogy)

#### Reference 7.6: AI Eval Framework — Promptfoo

- **URL:** https://www.promptfoo.dev/docs
- **Why:** Open-source eval framework, framework-agnostic
- **Focus:** Eval methodology, regression detection, dataset management
- **Time:** 2 hours
- **Priority:** High (AI quality)

Alternative options if Promptfoo doesn't appeal:
- Braintrust — https://www.braintrust.dev/docs
- Helicone — https://docs.helicone.ai/

Pick one (Promptfoo recommended). Don't study all three.

---

### Layer 5: Data (3 references — 5-6 hours)

#### Reference 5.1: PostHog Documentation

- **URL:** https://posthog.com/docs
- **Why:** Direct relevance, our analytics
- **Focus:** Event taxonomy, identify patterns, product analytics
- **Time:** 2 hours
- **Priority:** Critical (our tool)

#### Reference 5.2: Segment Analytics Academy

- **URL:** https://segment.com/academy/
- **Why:** Foundational analytics theory
- **Focus:** Event naming, identify spec, tracking plan
- **Time:** 2 hours
- **Priority:** High (theory)

#### Reference 5.3: Mixpanel Documentation

- **URL:** https://docs.mixpanel.com/
- **Why:** Alternative tool, different patterns
- **Focus:** Event properties, funnel analysis
- **Time:** 1.5 hours
- **Priority:** Comparative

---

### Layer 3: Product/Design (4 references — 8-9 hours)

#### Reference 3.1: shadcn/ui

- **URL:** https://ui.shadcn.com/
- **Why:** Modern component approach, copy-paste philosophy
- **Focus:** Component patterns, theming, accessibility
- **Time:** 2.5 hours
- **Priority:** Critical (our pattern)

#### Reference 3.2: Radix UI Primitives

- **URL:** https://www.radix-ui.com/primitives
- **Why:** Headless component library, foundation for shadcn/ui
- **Focus:** Accessibility patterns, composability
- **Time:** 2 hours
- **Priority:** Critical (foundation)

#### Reference 3.3: Vercel Geist Design System

- **URL:** https://vercel.com/design
- **Why:** Production design system at scale
- **Focus:** Token system, component variants
- **Time:** 2 hours
- **Priority:** High (production patterns)

#### Reference 3.4: Material UI Documentation

- **URL:** https://mui.com/
- **Why:** Mature alternative, different philosophy
- **Focus:** Theming system, customization
- **Time:** 2 hours
- **Priority:** Comparative (CSS-in-JS vs Tailwind)

---

### Layer 4: Localization (2 references — 3-4 hours)

#### Reference 4.1: next-intl Documentation

- **URL:** https://next-intl-docs.vercel.app/
- **Why:** Direct relevance, our i18n tool
- **Focus:** Routing, message formats, server components
- **Time:** 2 hours
- **Priority:** Critical (our tool)

#### Reference 4.2: i18next Documentation

- **URL:** https://www.i18next.com/
- **Why:** Mature alternative, different patterns
- **Focus:** Plugin system, namespace organization
- **Time:** 1.5-2 hours
- **Priority:** Comparative

---

## Synthesis (Final day)

After all 33 references studied, write `docs/research/synthesis.md`.

Synthesis is critical for Option D specifically — with 33 references, integration is harder. Allocate full day for synthesis.

**Synthesis activities:**

1. List common patterns across references (10-15 patterns expected)
2. Identify divergent approaches (5-7 areas of disagreement)
3. Note surprising learnings (things you didn't expect)
4. Extract WOO-specific recommendations
5. Extract general patterns transferable to future projects
6. Open questions for Phase 2

### Synthesis template

```markdown
# Phase 1 Synthesis (Option D)

**Date:** YYYY-MM-DD
**Total references:** 33
**Total research time:** ~70 hours

---

## Common patterns across references

[Patterns visible in 3+ references]

### Pattern: {Name}

**Seen in:** [References list]

**Description:** ...

**Variations:** ...

**Implications for template:** ...

---

## Divergent approaches

[Areas where references take different approaches]

### Topic: {Name}

**Approach A:** [Pattern from references X, Y]
**Approach B:** [Pattern from references Z, W]

**Trade-offs:**
- Approach A favors X over Y
- Approach B favors Y over X

**Decision for template:** [To debate in Phase 2]

---

## Surprising learnings

[Patterns or decisions you didn't expect]

---

## WOO-specific recommendations

[Patterns directly applicable to WOO platform]

### For v0.1 architecture build

- ...

### For v0.2 validation

- ...

### For v1.0 MVP

- ...

### For v2.0+ scale

- ...

---

## General learnings transferable beyond WOO

[Mental model expansions]

---

## Open questions for Phase 2

[Questions to discuss per layer]

### Layer 1 (Code)

- ...

### Layer 2 (API)

- ...

[etc. per layer]
```

---

## Daily progress tracking

Maintain `docs/research/progress.md` (template in `PROGRESS-TRACKER.md`).

Update at end of each day. Critical for Option D given longer duration.

**Mid-phase reflection (Day 11-13 — halfway):**
- Are you on schedule?
- Any references taking 2x estimate?
- Cognitive fatigue level?
- Adjustments needed?

---

## Pacing guidance for Option D

### Time-boxing strict

With 33 references and 70 hours, time-boxing critical:

- **Per reference:** 1-3 hours hard cap. If exceeding, document what understood, move on.
- **Per layer:** Stay within layer's allocated days. Don't extend.
- **Per week:** ~22-25 hours. If exceeding, slow down rather than burn out.

### When to cut scope

If by Day 12 (about halfway), you've completed only 12-13 references:
- You're significantly behind
- Cut: drop 1-2 references per remaining layer (lowest priority ones)
- Acceptable: Option D becomes Option B+ in practice
- Document scope reduction in `progress.md`

If overwhelmed:
- Phase can split: 2 weeks intense, break, then continue
- Or: reduce scope mid-phase, save additional refs for later

### Cognitive fatigue management

Option D = sustained intellectual work. Manage fatigue:

- Don't chain 3+ references same day (max 2)
- Take 1 day off between layers if needed
- Mid-phase break (Day 12-13) explicitly: rest, don't research
- Note fatigue in progress.md — early warning signal

### Layer 7 special handling

Layer 7 has 6 references over 4 days. Most demanding stretch.

**Day 14:** Reference 7.1 (Claude Code Docs) — 3 hours
**Day 15:** References 7.2 + 7.3 (Anthropic SDK + Vercel AI SDK) — 4 hours
**Day 16:** References 7.4 + 7.5 (OpenAI Cookbook + LangChain) — 4.5 hours
**Day 17:** Reference 7.6 (Promptfoo eval) — 2 hours, then half-day break

If exhausted after Day 17, take Day 18 off. Resume Day 19.

### When inspired

If a reference triggers strong implementation idea:
- Note in research file
- Don't start implementing
- Save for Phase 2/3

If a layer's references trigger questions about other layers:
- Note in synthesis draft
- Don't jump ahead — complete current layer first

### When stuck on a reference

If a reference doesn't make sense or feels overwhelming:
- Time-box at 3 hours max
- Note what you understood
- Move on; come back if needed during synthesis

---

## Setup before starting

### Step 1: Create template repo

```bash
gh repo create logan-woo-tech/woo-platform-template --public \
  --description "AI-native platform template based on 9-layer architecture"
```

### Step 2: Initialize structure

```bash
git clone https://github.com/logan-woo-tech/woo-platform-template.git
cd woo-platform-template

mkdir -p docs/research/{layer-1-code,layer-2-api,layer-3-product-design,layer-4-localization,layer-5-data,layer-6-security,layer-7-ai-integration,layer-8-knowledge-workflow,layer-9-operations}

touch docs/research/progress.md
touch docs/research/synthesis.md
touch README.md
```

### Step 3: Copy 3 plan files into repo

Copy from outputs folder:
- `PHASE-1-PLAN.md` (this file) → `docs/research/PHASE-1-PLAN.md`
- `REFERENCE-NOTE-TEMPLATE.md` → `docs/research/REFERENCE-NOTE-TEMPLATE.md`
- `PROGRESS-TRACKER.md` → `docs/research/PROGRESS-TRACKER.md`

### Step 4: Initial commit

```bash
git add docs/
git commit -m "docs(research): add Phase 1 research plan (Option D - full breadth)"
git push origin main
```

### Step 5: Ready to start Day 1

Open Layer 1 reference list. Pick first reference (Turborepo Examples). Begin.

---

## What "Phase 1 done" looks like

After completion, you have:
- 33 reference notes (markdown files)
- 1 synthesis document (substantial — 10-20 pages)
- 1 progress log
- Comprehensive understanding across 9 layers
- List of architectural decisions needed (for Phase 2)
- Open questions documented

You should NOT have:
- Template code (Phase 3)
- Final architectural decisions (Phase 2)
- WOO-specific implementation (Phase 4)

---

## After Phase 1 done

Return to discussion with Claude (this session or fresh chat). Phase 2 begins:

- Per-layer discussion sessions (9 sessions)
- Each session ~60-90 min
- Total Phase 2: ~10-15 hours discussion time

Phase 2 estimated: 1.5-2 weeks calendar.

Then Phase 3 (build): 3-4 weeks.

Then Phase 4 (validate via WOO instantiation): 1-2 weeks.

**Total template effort:** 8-11 weeks (~2-3 months) including Option D Phase 1.

---

## Reference index quick view

| # | Layer | Reference | Hours |
|---|-------|-----------|-------|
| 1.1 | Code | Vercel Turborepo Examples | 2 |
| 1.2 | Code | T3 Stack | 2 |
| 1.3 | Code | Cal.com | 2.5-3 |
| 8.1 | Knowledge | ADR GitHub Org | 1.5 |
| 8.2 | Knowledge | GitLab Handbook | 2.5 |
| 8.3 | Knowledge | Stripe Engineering Blog | 2 |
| 8.4 | Knowledge | Shape Up | 2-2.5 |
| 9.1 | Operations | Vercel Docs | 1.5-2 |
| 9.2 | Operations | GitHub Actions Best Practices | 1.5 |
| 9.3 | Operations | Fly.io Docs | 2-3 |
| 6.1 | Security | Supabase Security | 2.5-3 |
| 6.2 | Security | OWASP Top 10 | 2 |
| 6.3 | Security | Auth.js | 2 |
| 6.4 | Security | Clerk | 1.5-2 |
| 2.1 | API | Stripe API | 2.5 |
| 2.2 | API | tRPC | 2 |
| 2.3 | API | GitHub REST API | 2 |
| 2.4 | API | OpenAPI Spec | 1.5 |
| 7.1 | AI | Claude Code Docs | 3 |
| 7.2 | AI | Anthropic SDK | 2 |
| 7.3 | AI | Vercel AI SDK | 2 |
| 7.4 | AI | OpenAI Cookbook | 2 |
| 7.5 | AI | LangChain | 2.5 |
| 7.6 | AI | Promptfoo | 2 |
| 5.1 | Data | PostHog | 2 |
| 5.2 | Data | Segment Academy | 2 |
| 5.3 | Data | Mixpanel | 1.5 |
| 3.1 | Design | shadcn/ui | 2.5 |
| 3.2 | Design | Radix UI | 2 |
| 3.3 | Design | Vercel Geist | 2 |
| 3.4 | Design | Material UI | 2 |
| 4.1 | i18n | next-intl | 2 |
| 4.2 | i18n | i18next | 1.5-2 |

**Total: 33 references, 65-75 hours**

---

## Final note

Phase 1 Option D is significant time investment. ~70 hours spread across 18-25 days.

This investment compounds:
- Better Phase 2 discussions (richer reference base)
- Better Phase 3 implementation (deeper understanding)
- Long-term mental model for future projects (not just WOO)

If at any point fatigue or scope feels untenable, scale back to Option B+ (drop marginal references). Better to complete reduced scope than burn out on full scope.

Trust your judgment during execution. The structure here is guideline, not prescription.

---

*End of PHASE-1-PLAN.md (Option D — Full Breadth)*
