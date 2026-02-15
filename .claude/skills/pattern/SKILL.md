---
name: pattern
description: Generate a complete DSA pattern entry for CoreLearnly with all admin form fields ready to copy-paste
argument-hint: "[PATTERN NAME] [CATEGORY] [DIFFICULTY] in [CODE LANGUAGE]"
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
---

## Instructions

1. Read the full prompt template at `prompts/pattern-prompt.md`
2. Parse the user's arguments to extract: PATTERN NAME, CATEGORY, DIFFICULTY, and CODE LANGUAGE
3. Follow the prompt template exactly — generate ALL labeled fields in the OUTPUT FORMAT section
4. Use the hybrid tone: reference-style for code/complexity, blog-style for when-to-use and detailed explanation
5. The DETAILED EXPLANATION must include all 6 sections: Core Concept, Step-by-Step Walkthrough, Visual Explanation, Variations, Common Pitfalls, Interview Tips

## User Input

$ARGUMENTS

## Defaults

- If no CODE LANGUAGE is specified, default to **Swift**
- If no CATEGORY is specified, infer from the pattern name
- If no DIFFICULTY is specified, infer from the pattern complexity

## Output Rules

- Generate every labeled field: TITLE, EXCERPT, CATEGORY, DIFFICULTY, WHEN TO USE, TEMPLATE CODE, TEMPLATE LANGUAGE, TIME COMPLEXITY, SPACE COMPLEXITY, EXAMPLE PROBLEMS, TAGS, DETAILED EXPLANATION
- CATEGORY must be exactly one of: Arrays, Strings, Linked Lists, Stacks & Queues, Trees, Graphs, Dynamic Programming, Searching, Sorting, Recursion & Backtracking, Greedy, Two Pointers, Sliding Window, Hashing, Bit Manipulation, Math
- DIFFICULTY must be exactly one of: easy, medium, hard
- Template code must be clean, commented, and reusable — not tied to one specific problem
- Visual Explanation must use text-based diagrams showing pointer positions or state changes
