# Copy archive

Original case-study copy preserved before rewrites, in case it's wanted back.
Everything here is also recoverable from git history — the relevant commits are
referenced under each section (`git show <commit>:<file>` shows the full file
as it was at that point).

---

## Commission (`src/pages/commission.astro`)

### Original copy (before commit `3fb6e54`, 2 Jun 2026)

**Page description:**

> A court ruling made Close Brothers' broker commission process non-compliant overnight. I led the design of a new Commission Disclosure and Consent service - built and launched in seven weeks.

**"The process" — paragraph 1:**

> I led discovery, ideation, and design from day one. I mapped the existing onboarding ecosystem to understand where a standalone service could sit without breaking broker relationships, then built out the service blueprint to align over 50 people across product, engineering, legal, compliance, and customer insight.

**"The process" — paragraph 2:**

> I designed the end-to-end journey - low fidelity through to production-ready - keeping FCA consent requirements central to every decision. I ran 22 customer interviews and over 45 broker walkthroughs throughout delivery, feeding findings directly back into the design. Post-launch, behavioural data identified a login issue - a fix I designed reduced errors by 85%.

### Intermediate version (after `3fb6e54`, before the 10 Jun 2026 collaborative rewrite in `0cf969f`)

Same as the original except:

- Description: "I led the design" → "I drove the design"
- Paragraph 2 ending: "a fix I designed reduced errors by 85%" → "I owned the fix that reduced errors by 85%"

### Final sentence history (10 Jun 2026)

- `0cf969f` rewrote both process paragraphs to collaborative framing ("Discovery was led by my Head of Design…", "I collaborated with a Senior Designer…")
- `41aa12c` / `96f1d96`: "I owned the fix" → "we owned the fix"

---

## Ekeg (`src/pages/ekeg.astro`)

### Original copy (before commit `3fb6e54`, 2 Jun 2026)

**"The process" — paragraph 1:**

> I was the sole designer on the project for 18 months, embedded in the delivery team alongside one BA and one developer. I led discovery end to end - running customer interviews, conducting site visits at breweries, running workshops, and shadowing front-office teams to understand how the existing manual process actually worked.

**"The process" — paragraph 2:**

> From there I led ideation, produced low and high fidelity designs, and supported implementation. I kept a continuous feedback loop throughout - observing training calls, gathering quantitative data, and feeding it back into the backlog. Features like Help Mode for new users and keg-fill warnings to prevent production stoppages came directly from that research.

### Changes in `3fb6e54` (2 Jun 2026)

- Paragraph 1: "I led discovery end to end" → "I owned discovery end to end"
- Paragraph 2: "From there I led ideation" → "From there I drove ideation"
