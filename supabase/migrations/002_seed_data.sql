-- ============================================================================
-- CORELEARNLY SEED DATA
-- Version: 2.0
-- Created: December 2024
--
-- This creates initial curriculum content and a test batch
-- Execute AFTER 001_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- SECTION 1: CURRICULUM VERSION
-- ============================================================================

INSERT INTO curriculum_versions (id, version, description, is_active, published_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'v1.0',
    'Initial curriculum - DSA + System Design (6 months) + AI Fundamentals',
    true,
    now()
);


-- ============================================================================
-- SECTION 2: COURSE MODULES
-- ============================================================================

-- Beginner Module (2 months)
INSERT INTO course_modules (id, curriculum_version_id, name, description, type, duration_months, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Beginner DSA & System Design',
    'Foundation course covering Arrays, Pointers, Prefix Sum, Recursion, and Basic System Design concepts.',
    'beginner',
    2,
    1
);

-- Advanced Module (4 months)
INSERT INTO course_modules (id, curriculum_version_id, name, description, type, duration_months, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Advanced DSA & System Design',
    'Advanced topics including Dynamic Programming, Graphs, Trees, OS concepts, Database internals, and Distributed Systems.',
    'advanced',
    4,
    2
);

-- AI Module (parallel - weekends)
INSERT INTO course_modules (id, curriculum_version_id, name, description, type, duration_months, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'AI Fundamentals',
    'Weekend classes covering AI concepts, tools, and practical applications for developers.',
    'ai',
    6,
    3
);


-- ============================================================================
-- SECTION 3: TOPICS
-- ============================================================================

-- BEGINNER MODULE TOPICS
-- ----------------------

-- Topic 1: Arrays & Pointers
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Arrays & Pointers',
    'Master array manipulation, two-pointer technique, and sliding window patterns.',
    'array',
    1
);

-- Topic 2: Prefix Sum
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'Prefix Sum',
    'Learn prefix sum technique for efficient range queries and subarray problems.',
    'sum',
    2
);

-- Topic 3: Recursion
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'Recursion & Backtracking',
    'Understand recursion fundamentals, call stack, and backtracking algorithms.',
    'recursion',
    3
);

-- Topic 4: Basic System Design
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000001',
    'Basic System Design',
    'Introduction to system design concepts, scalability basics, and common patterns.',
    'system',
    4
);

-- ADVANCED MODULE TOPICS
-- ----------------------

-- Topic 5: Dynamic Programming
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000002',
    'Dynamic Programming',
    'Master DP patterns including 1D, 2D, string DP, and tree DP.',
    'dp',
    1
);

-- Topic 6: Graphs
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000002',
    'Graphs',
    'BFS, DFS, shortest path algorithms, topological sort, and graph problems.',
    'graph',
    2
);

-- Topic 7: Trees
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000007',
    'b0000000-0000-0000-0000-000000000002',
    'Trees & BST',
    'Binary trees, BST operations, tree traversals, LCA, and tree DP.',
    'tree',
    3
);

-- Topic 8: Advanced System Design
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000008',
    'b0000000-0000-0000-0000-000000000002',
    'Advanced System Design',
    'Distributed systems, database design, caching, message queues, and real-world case studies.',
    'distributed',
    4
);

-- AI MODULE TOPICS
-- ----------------

-- Topic 9: AI Concepts
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000009',
    'b0000000-0000-0000-0000-000000000003',
    'AI Concepts',
    'Understanding AI fundamentals, machine learning basics, and how AI works.',
    'ai',
    1
);

-- Topic 10: AI Tools
INSERT INTO topics (id, module_id, name, description, icon, display_order)
VALUES (
    'c0000000-0000-0000-0000-000000000010',
    'b0000000-0000-0000-0000-000000000003',
    'AI Tools & Productivity',
    'Using ChatGPT, Claude, Copilot, and other AI tools effectively.',
    'tools',
    2
);


-- ============================================================================
-- SECTION 4: LESSONS
-- ============================================================================

-- ARRAYS & POINTERS LESSONS
-- -------------------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Introduction to Arrays',
    'Understanding arrays, memory layout, and basic operations.',
    90,
    1,
    '{"notes": "", "slides": ""}'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'Two Pointer Technique',
    'Master the two-pointer approach for solving array problems efficiently.',
    120,
    2,
    '{"notes": "", "problems": "https://leetcode.com/tag/two-pointers/"}'
),
(
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'Sliding Window',
    'Learn fixed and variable size sliding window patterns.',
    120,
    3,
    '{"notes": "", "problems": "https://leetcode.com/tag/sliding-window/"}'
),
(
    'd0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'Array Problem Solving',
    'Practice session solving medium-level array problems.',
    120,
    4,
    '{"problems": "https://leetcode.com/tag/array/"}'
);

-- PREFIX SUM LESSONS
-- ------------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000002',
    'Prefix Sum Basics',
    'Understanding prefix sum concept and basic applications.',
    90,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000002',
    'Range Query Problems',
    'Solving range sum queries and subarray problems using prefix sum.',
    120,
    2,
    '{"problems": "https://leetcode.com/tag/prefix-sum/"}'
);

-- RECURSION LESSONS
-- -----------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000003',
    'Recursion Fundamentals',
    'Understanding recursion, base cases, and call stack.',
    120,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000003',
    'Backtracking',
    'Learn backtracking pattern with permutations, combinations, and subsets.',
    120,
    2,
    '{"problems": "https://leetcode.com/tag/backtracking/"}'
);

-- BASIC SYSTEM DESIGN LESSONS
-- ---------------------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000004',
    'System Design Basics',
    'Introduction to system design, scalability, and common terminology.',
    120,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000004',
    'Database Fundamentals',
    'SQL vs NoSQL, indexing, and basic database design.',
    120,
    2,
    '{"notes": ""}'
);

-- DYNAMIC PROGRAMMING LESSONS (ADVANCED)
-- --------------------------------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000011',
    'c0000000-0000-0000-0000-000000000005',
    '1D Dynamic Programming',
    'Introduction to DP with 1D problems like climbing stairs, house robber.',
    120,
    1,
    '{"notes": "", "problems": "https://leetcode.com/tag/dynamic-programming/"}'
),
(
    'd0000000-0000-0000-0000-000000000012',
    'c0000000-0000-0000-0000-000000000005',
    '2D Dynamic Programming',
    'Grid-based DP problems and matrix chain multiplication.',
    120,
    2,
    '{"problems": ""}'
),
(
    'd0000000-0000-0000-0000-000000000013',
    'c0000000-0000-0000-0000-000000000005',
    'String DP',
    'LCS, Edit Distance, and string manipulation DP problems.',
    120,
    3,
    '{"problems": ""}'
);

-- GRAPH LESSONS (ADVANCED)
-- ------------------------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000014',
    'c0000000-0000-0000-0000-000000000006',
    'Graph Representation & BFS',
    'Adjacency list, adjacency matrix, and BFS traversal.',
    120,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000015',
    'c0000000-0000-0000-0000-000000000006',
    'DFS & Applications',
    'DFS traversal, cycle detection, and connected components.',
    120,
    2,
    '{"problems": "https://leetcode.com/tag/depth-first-search/"}'
),
(
    'd0000000-0000-0000-0000-000000000016',
    'c0000000-0000-0000-0000-000000000006',
    'Shortest Path Algorithms',
    'Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms.',
    120,
    3,
    '{"notes": ""}'
);

-- AI LESSONS
-- ----------

INSERT INTO lessons (id, topic_id, title, description, duration_minutes, display_order, resources)
VALUES
(
    'd0000000-0000-0000-0000-000000000017',
    'c0000000-0000-0000-0000-000000000009',
    'What is AI?',
    'Understanding AI, ML, and deep learning basics.',
    90,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000018',
    'c0000000-0000-0000-0000-000000000010',
    'Using ChatGPT Effectively',
    'Prompt engineering and getting the best out of ChatGPT.',
    90,
    1,
    '{"notes": ""}'
),
(
    'd0000000-0000-0000-0000-000000000019',
    'c0000000-0000-0000-0000-000000000010',
    'AI for Developers',
    'Using Copilot, Claude, and AI tools for coding productivity.',
    90,
    2,
    '{"notes": ""}'
);


-- ============================================================================
-- SECTION 5: ASSIGNMENTS
-- ============================================================================

-- Two Pointer Assignments
INSERT INTO assignments (id, lesson_id, title, url, platform, difficulty, display_order)
VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000002',
    'Two Sum',
    'https://leetcode.com/problems/two-sum/',
    'leetcode',
    'easy',
    1
),
(
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    '3Sum',
    'https://leetcode.com/problems/3sum/',
    'leetcode',
    'medium',
    2
),
(
    'e0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000002',
    'Container With Most Water',
    'https://leetcode.com/problems/container-with-most-water/',
    'leetcode',
    'medium',
    3
);

-- Sliding Window Assignments
INSERT INTO assignments (id, lesson_id, title, url, platform, difficulty, display_order)
VALUES
(
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000003',
    'Maximum Subarray',
    'https://leetcode.com/problems/maximum-subarray/',
    'leetcode',
    'medium',
    1
),
(
    'e0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000003',
    'Longest Substring Without Repeating Characters',
    'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    'leetcode',
    'medium',
    2
);

-- Recursion Assignments
INSERT INTO assignments (id, lesson_id, title, url, platform, difficulty, display_order)
VALUES
(
    'e0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000008',
    'Subsets',
    'https://leetcode.com/problems/subsets/',
    'leetcode',
    'medium',
    1
),
(
    'e0000000-0000-0000-0000-000000000007',
    'd0000000-0000-0000-0000-000000000008',
    'Permutations',
    'https://leetcode.com/problems/permutations/',
    'leetcode',
    'medium',
    2
);

-- DP Assignments
INSERT INTO assignments (id, lesson_id, title, url, platform, difficulty, display_order)
VALUES
(
    'e0000000-0000-0000-0000-000000000008',
    'd0000000-0000-0000-0000-000000000011',
    'Climbing Stairs',
    'https://leetcode.com/problems/climbing-stairs/',
    'leetcode',
    'easy',
    1
),
(
    'e0000000-0000-0000-0000-000000000009',
    'd0000000-0000-0000-0000-000000000011',
    'House Robber',
    'https://leetcode.com/problems/house-robber/',
    'leetcode',
    'medium',
    2
);


-- ============================================================================
-- SECTION 6: TEST BATCH (January 2025)
-- ============================================================================

INSERT INTO batches (id, name, description, curriculum_version_id, start_date, end_date, max_seats, max_free_seats, community_type, is_active)
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'January 2025 Batch',
    'First batch of 2025. 6-month intensive program starting January 15th.',
    'a0000000-0000-0000-0000-000000000001',
    '2025-01-15',
    '2025-07-15',
    40,
    15,
    'whatsapp',
    true
);


-- ============================================================================
-- SECTION 7: SAMPLE SESSIONS FOR TEST BATCH
-- ============================================================================

-- Session 1: Arrays Introduction
INSERT INTO sessions (id, batch_id, title, description, scheduled_at, duration_minutes, session_type)
VALUES (
    'g0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'Arrays - Introduction',
    'First class covering array basics and memory layout.',
    '2025-01-15 19:00:00+05:30',
    90,
    'beginner'
);

-- Session 2: Two Pointer
INSERT INTO sessions (id, batch_id, title, description, scheduled_at, duration_minutes, session_type)
VALUES (
    'g0000000-0000-0000-0000-000000000002',
    'f0000000-0000-0000-0000-000000000001',
    'Arrays - Two Pointer Technique',
    'Master the two-pointer approach.',
    '2025-01-17 19:00:00+05:30',
    120,
    'beginner'
);

-- Session 3: Sliding Window
INSERT INTO sessions (id, batch_id, title, description, scheduled_at, duration_minutes, session_type)
VALUES (
    'g0000000-0000-0000-0000-000000000003',
    'f0000000-0000-0000-0000-000000000001',
    'Arrays - Sliding Window',
    'Fixed and variable size sliding window patterns.',
    '2025-01-20 19:00:00+05:30',
    120,
    'beginner'
);

-- Session 4: AI Weekend Class
INSERT INTO sessions (id, batch_id, title, description, scheduled_at, duration_minutes, session_type)
VALUES (
    'g0000000-0000-0000-0000-000000000004',
    'f0000000-0000-0000-0000-000000000001',
    'AI - Introduction to AI Tools',
    'Weekend class on using AI tools effectively.',
    '2025-01-18 10:00:00+05:30',
    90,
    'ai'
);


-- Link sessions to lessons
INSERT INTO session_lessons (session_id, lesson_id, display_order)
VALUES
('g0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 1),
('g0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 1),
('g0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 1),
('g0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000018', 1);


-- Set current session for the batch
UPDATE batches
SET current_session_id = 'g0000000-0000-0000-0000-000000000001'
WHERE id = 'f0000000-0000-0000-0000-000000000001';


-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
