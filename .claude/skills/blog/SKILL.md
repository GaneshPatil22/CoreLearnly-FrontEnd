---
name: blog
description: Generate a complete blog post for CoreLearnly with all admin form fields ready to copy-paste
argument-hint: "[TOPIC] in [CODE LANGUAGE] covering [SUBTOPICS]"
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
---

## Instructions

1. Read the full prompt template at `prompts/blog-prompt.md`
2. Parse the user's arguments to extract: TOPIC, SUBTOPICS, CODE LANGUAGE, and PROBLEMS
3. Follow the prompt template exactly — generate ALL labeled fields in the OUTPUT FORMAT section
4. Use the 11-section blog content structure defined in the template

## User Input

$ARGUMENTS

## Defaults

- If no CODE LANGUAGE is specified, default to **Swift**
- If no PROBLEMS are specified, pick 5-8 relevant LeetCode-style problems for the topic
- If no SUBTOPICS are specified, pick 3-5 natural subtopics for the given topic

## Output Rules

- Generate every labeled field: TITLE, CATEGORY, TAGS, BRIEF SUMMARY (must end with a motivational quote + attribution), BLOG CONTENT
- BLOG CONTENT must follow all 11 sections in order
- All code must be complete and runnable — no pseudocode
- Keep the CoreLearnly voice: first-person, mentor-like, conversational
