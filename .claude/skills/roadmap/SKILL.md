---
name: roadmap
description: Generate a complete 3-phase interview prep roadmap for CoreLearnly with all admin form fields ready to copy-paste
argument-hint: "[paste existing pattern titles or say 'fetch from codebase']"
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
---

## Instructions

1. Read the full prompt template at `prompts/roadmap-prompt.md`
2. Determine the existing pattern list:
   - If the user provides pattern titles in their arguments, use those
   - If the user says "fetch from codebase" or similar, search the codebase for existing DSA pattern titles (check `src/types/index.ts`, any seed data, or Supabase migration files in `sql/`)
3. Follow the prompt template exactly — generate a complete 3-phase roadmap structure
4. Link nodes to existing patterns by exact title match. Mark missing patterns with `(NEW)`

## User Input

$ARGUMENTS

## Defaults

- If no pattern list is provided and none found in codebase, generate the roadmap with all patterns marked as `(NEW)`
- Phase 1 (Beginner): mostly `free` access level
- Phase 2 (Intermediate): mix of `free` and `preview`
- Phase 3 (Advanced): mostly `preview` and `full`

## Output Rules

- Generate 3 phases with 4-6 nodes each
- Every field must use the exact labeled format: PHASE TITLE, PHASE LEVEL, PHASE DESCRIPTION, ICON, DISPLAY ORDER, NODE TITLE, NODE DESCRIPTION, LINKED PATTERNS, ACCESS LEVEL, DISPLAY ORDER
- PHASE LEVEL must be exactly one of: beginner, intermediate, advanced
- ACCESS LEVEL must be exactly one of: free, preview, full
- Every pattern from the existing list should appear in at least one node
- A pattern should only appear in one phase (no cross-phase duplication)
- Each node should link to 2-4 patterns
