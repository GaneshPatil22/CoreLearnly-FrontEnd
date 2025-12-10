-- CoreLearnly Syllabus Data Seed
-- This script populates the database with real course content from syllabus.pdf
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Delete existing dummy topics and lessons
-- (Keep AI module dummy data intact)
-- ============================================

-- Delete lessons for beginner and advanced modules only
DELETE FROM lessons
WHERE topic_id IN (
  SELECT id FROM topics
  WHERE module_id IN (
    'b0000000-0000-0000-0000-000000000001',  -- Beginner module
    'b0000000-0000-0000-0000-000000000002'   -- Advanced module
  )
);

-- Delete topics for beginner and advanced modules only
DELETE FROM topics
WHERE module_id IN (
  'b0000000-0000-0000-0000-000000000001',  -- Beginner module
  'b0000000-0000-0000-0000-000000000002'   -- Advanced module
);

-- ============================================
-- STEP 2: Insert Topics (12 total)
-- Phase 1 (Beginner): Modules 1-5
-- Phase 2 (Advanced): Modules 6-12
-- ============================================

-- BEGINNER MODULE TOPICS (Modules 1-5)
INSERT INTO topics (id, module_id, name, description, display_order) VALUES
-- Module 1: Introduction & Problem-Solving Fundamentals (4 Classes)
('c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
 'Introduction & Problem-Solving Fundamentals',
 'Course introduction, HLD & LLD basics overview, time and space complexity analysis', 1),

-- Module 2: Arrays & Bit Manipulation (7 Classes)
('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',
 'Arrays & Bit Manipulation',
 'Arrays, prefix sum, subarrays, 2D matrices, sliding window, two pointers, and bit manipulation techniques', 2),

-- Module 3: Mathematics & String Manipulation (6 Classes)
('c1000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001',
 'Mathematics & String Manipulation',
 'Modular arithmetic, prime numbers, GCD/LCM, string operations, pattern matching algorithms', 3),

-- Module 4: Recursion, Sorting & Hashing (8 Classes)
('c1000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001',
 'Recursion, Sorting & Hashing',
 'Recursion fundamentals, backtracking introduction, sorting algorithms, hashing techniques', 4),

-- Module 5: Linked Lists, Stacks & Queues (5 Classes)
('c1000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001',
 'Linked Lists, Stacks & Queues',
 'Linked list operations, stack and queue implementations, classic problems', 5);

-- ADVANCED MODULE TOPICS (Modules 6-12)
INSERT INTO topics (id, module_id, name, description, display_order) VALUES
-- Module 6: Advanced Arrays & Number Theory (6 Classes)
('c2000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',
 'Advanced Arrays & Number Theory',
 'Advanced array techniques, combinatorics, modular arithmetic, two pointers mastery', 1),

-- Module 7: Binary Search & Linked List Mastery (6 Classes)
('c2000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002',
 'Binary Search & Linked List Mastery',
 'Binary search variations, search space reduction, advanced linked list problems', 2),

-- Module 8: Trees & Tries (7 Classes)
('c2000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002',
 'Trees & Tries',
 'Tree traversals, BST, AVL trees, LCA, tries implementation and applications', 3),

-- Module 9: Heap & Greedy Algorithms (6 Classes)
('c2000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002',
 'Heap & Greedy Algorithms',
 'Heap operations, priority queues, greedy algorithm strategies and classic problems', 4),

-- Module 10: Backtracking & Dynamic Programming (12 Classes)
('c2000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002',
 'Backtracking & Dynamic Programming',
 'Backtracking techniques, DP fundamentals, memoization, tabulation, classic DP problems', 5),

-- Module 11: Graph Algorithms (9 Classes)
('c2000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002',
 'Graph Algorithms',
 'Graph representations, BFS, DFS, shortest paths, MST, advanced graph problems', 6),

-- Module 12: System Design & Final Preparation (8 Classes)
('c2000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002',
 'System Design & Final Preparation',
 'Low-level design, high-level design, design patterns, mock interviews', 7);

-- ============================================
-- STEP 3: Insert Lessons (90 total)
-- ============================================

-- =============================================
-- MODULE 1: Introduction & Problem-Solving (4 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d1010000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
 'Meet & Greet + Course Introduction',
 'Welcome session, course overview, expectations, and learning roadmap', 1, true),

('d1010000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001',
 'HLD & LLD Basics (Overview of System Design)',
 'Introduction to high-level and low-level design concepts', 2, true),

('d1010000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001',
 'Introduction to Problem-Solving + Time Complexity - 1',
 'Problem-solving approach and introduction to time complexity analysis', 3, true),

('d1010000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001',
 'Time Complexity - 2 + Space Complexity + Asymptotic Analysis',
 'Advanced complexity analysis with Big-O, Big-Theta, and Big-Omega notations', 4, true);

-- =============================================
-- MODULE 2: Arrays & Bit Manipulation (7 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d1020000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002',
 'Introduction to Arrays + Prefix Sum Technique',
 'Array fundamentals and prefix sum technique for range queries', 1, true),

('d1020000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002',
 'Carry Forward + Subarrays (Kadane''s Algorithm)',
 'Carry forward technique and maximum subarray sum using Kadane''s algorithm', 2, true),

('d1020000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002',
 '2D Arrays & Matrix Operations',
 'Working with 2D arrays, matrix traversals and operations', 3, true),

('d1020000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002',
 'Array Interview Problems (Sliding Window, Two Pointers)',
 'Common interview patterns: sliding window and two pointer techniques', 4, true),

('d1020000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002',
 'Bit Manipulation - 1 (Basics, AND, OR, NOT, XOR)',
 'Introduction to bitwise operators and their applications', 5, true),

('d1020000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002',
 'Bit Manipulation - 2 (Set/Unset Bits, Power of 2, Count Set Bits)',
 'Bit manipulation tricks for checking powers of 2 and counting bits', 6, true),

('d1020000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002',
 'Bit Manipulation - 3 (Advanced Applications & Problem Solving)',
 'Advanced bit manipulation techniques and interview problems', 7, true);

-- =============================================
-- MODULE 3: Mathematics & String Manipulation (6 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d1030000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003',
 'Modular Arithmetic & Prime Numbers (Sieve of Eratosthenes)',
 'Modular arithmetic fundamentals and efficient prime number generation', 1, true),

('d1030000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003',
 'GCD, LCM & Number Theory Fundamentals',
 'Euclidean algorithm, GCD/LCM calculations, and number theory basics', 2, true),

('d1030000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003',
 'String Basics + String Operations (Reversal, Palindrome)',
 'String fundamentals, reversal techniques, and palindrome detection', 3, true),

('d1030000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003',
 'String Pattern Matching (KMP, Rabin-Karp)',
 'Efficient pattern matching algorithms: KMP and Rabin-Karp', 4, true),

('d1030000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003',
 'Advanced String Problems (Anagrams, Subsequences)',
 'Solving complex string problems involving anagrams and subsequences', 5, true),

('d1030000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003',
 'Combined Array & String Problem Solving',
 'Practice session combining array and string techniques', 6, true);

-- =============================================
-- MODULE 4: Recursion, Sorting & Hashing (8 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d1040000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004',
 'Recursion - 1 (Basics, Call Stack Visualization)',
 'Understanding recursion fundamentals and visualizing the call stack', 1, true),

('d1040000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004',
 'Recursion - 2 (Backtracking Introduction, N-Queens Preview)',
 'Introduction to backtracking with N-Queens problem preview', 2, true),

('d1040000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004',
 'Sorting - 1 (Bubble, Selection, Insertion Sort)',
 'Basic sorting algorithms: bubble, selection, and insertion sort', 3, true),

('d1040000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004',
 'Sorting - 2 (Merge Sort, Quick Sort)',
 'Divide and conquer sorting: merge sort and quick sort algorithms', 4, true),

('d1040000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004',
 'Sorting - 3 (Counting Sort, Radix Sort, Bucket Sort)',
 'Non-comparison based sorting algorithms', 5, true),

('d1040000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000004',
 'Hashing - 1 (Maps, Sets, Hash Functions, Load Factor)',
 'Hash table fundamentals, hash functions, and load factor concepts', 6, true),

('d1040000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004',
 'Hashing - 2 (Collision Handling, Frequency Counting Problems)',
 'Collision resolution techniques and frequency counting applications', 7, true),

('d1040000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004',
 'Subsequences & Subsets Generation',
 'Generating all subsequences and subsets using recursion', 8, true);

-- =============================================
-- MODULE 5: Linked Lists, Stacks & Queues (5 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d1050000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005',
 'Linked List - 1 (Singly, Doubly, Circular)',
 'Introduction to different types of linked lists', 1, true),

('d1050000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005',
 'Linked List - 2 (Reversal, Middle Element, Cycle Detection)',
 'Classic linked list operations and Floyd''s cycle detection', 2, true),

('d1050000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005',
 'Stack - 1 (Implementation & Classic Problems)',
 'Stack implementation and solving classic stack problems', 3, true),

('d1050000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000005',
 'Queue - 1 (Implementation, Circular Queue, Deque)',
 'Queue implementations: linear, circular, and double-ended queues', 4, true),

('d1050000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005',
 'Stack & Queue Advanced Problems (Next Greater Element, LRU Cache)',
 'Advanced problems including NGE and LRU cache implementation', 5, true);

-- =============================================
-- MODULE 6: Advanced Arrays & Number Theory (6 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2010000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001',
 'Advanced Array Techniques (Sliding Window, Kadane''s Extensions)',
 'Advanced sliding window patterns and Kadane''s algorithm variations', 1, true),

('d2010000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001',
 'Negative Number Handling & Inverse Modulo',
 'Handling negative numbers and modular multiplicative inverse', 2, true),

('d2010000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001',
 'Combinatorics & Advanced Modular Arithmetic (nCr, nPr)',
 'Combinations, permutations, and advanced modular operations', 3, true),

('d2010000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000001',
 'Sorting - 4 (Heap Sort, Quick Sort Optimization)',
 'Heap sort algorithm and quick sort optimizations', 4, true),

('d2010000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000001',
 'Two Pointers - 1 (Basics, Pair Sum Problems)',
 'Two pointer technique fundamentals and pair sum variations', 5, true),

('d2010000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000001',
 'Two Pointers - 2 (3Sum, 4Sum, Container Problems)',
 'Advanced two pointer problems: 3Sum, 4Sum, and container problems', 6, true);

-- =============================================
-- MODULE 7: Binary Search & Linked List Mastery (6 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2020000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002',
 'Binary Search - 1 (Fundamentals, Search Space Reduction)',
 'Binary search fundamentals and search space reduction technique', 1, true),

('d2020000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002',
 'Binary Search - 2 (Binary Search on Answer Space)',
 'Applying binary search on answer space for optimization problems', 2, true),

('d2020000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000002',
 'Binary Search - 3 (Matrix Search, Rotated Arrays)',
 'Binary search in 2D matrices and rotated sorted arrays', 3, true),

('d2020000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000002',
 'Linked List - 3 (Advanced Problems: Merge K Lists, Clone with Random)',
 'Merging K sorted lists and cloning linked list with random pointers', 4, true),

('d2020000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000002',
 'Linked List - 4 (Flatten, Intersection, Add Numbers)',
 'Flattening multilevel lists, finding intersection, adding numbers', 5, true),

('d2020000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000002',
 'Problem-Solving Session: Linked Lists',
 'Practice session for linked list interview problems', 6, true);

-- =============================================
-- MODULE 8: Trees & Tries (7 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2030000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000003',
 'Trees - 1 (Structure, Traversals: Inorder, Preorder, Postorder)',
 'Tree structure and implementing all tree traversal methods', 1, true),

('d2030000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000003',
 'Trees - 2 (Binary Search Tree, AVL Trees, Balance)',
 'BST operations and self-balancing AVL trees', 2, true),

('d2030000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003',
 'Trees - 3 (Lowest Common Ancestor, Path Problems)',
 'Finding LCA and solving tree path problems', 3, true),

('d2030000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000003',
 'Trees - 4 (Diameter, Height, Views, Serialize/Deserialize)',
 'Tree diameter, height, views, and serialization techniques', 4, true),

('d2030000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000003',
 'Tries - 1 (Basics, Implementation, Insert/Search)',
 'Trie data structure implementation and basic operations', 5, true),

('d2030000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000003',
 'Tries - 2 (Word Search, Dictionary Problems)',
 'Using tries for word search and dictionary applications', 6, true),

('d2030000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000003',
 'Tries - 3 (Prefix Matching, Autocomplete, XOR Problems)',
 'Advanced trie applications: autocomplete and XOR maximum', 7, true);

-- =============================================
-- MODULE 9: Heap & Greedy Algorithms (6 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2040000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000004',
 'Heap - 1 (Min Heap, Max Heap, Heapify Operations)',
 'Heap fundamentals: min heap, max heap, and heapify operations', 1, true),

('d2040000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000004',
 'Heap - 2 (Heap Sort, Priority Queue Implementation)',
 'Heap sort algorithm and priority queue using heaps', 2, true),

('d2040000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000004',
 'Heap - 3 (Top K Elements, Median Stream, Merge K Lists)',
 'Classic heap problems: top K, running median, and merge K lists', 3, true),

('d2040000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000004',
 'Greedy Algorithms - 1 (Introduction, Activity Selection)',
 'Greedy approach fundamentals and activity selection problem', 4, true),

('d2040000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000004',
 'Greedy Algorithms - 2 (Fractional Knapsack, Job Sequencing)',
 'Fractional knapsack and job sequencing with deadlines', 5, true),

('d2040000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000004',
 'Greedy Algorithms - 3 (Huffman Coding, Gas Station, Jump Game)',
 'Huffman coding and classic greedy problems', 6, true);

-- =============================================
-- MODULE 10: Backtracking & Dynamic Programming (12 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2050000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000005',
 'Backtracking - 1 (N-Queens, Sudoku Solver)',
 'Classic backtracking: N-Queens and Sudoku solver', 1, true),

('d2050000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000005',
 'Backtracking - 2 (Permutations, Combinations, Rat in Maze)',
 'Generating permutations, combinations, and maze problems', 2, true),

('d2050000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 1 (Introduction, Memoization vs Tabulation)',
 'DP fundamentals: understanding memoization and tabulation approaches', 3, true),

('d2050000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 2 (Fibonacci, Climbing Stairs, Coin Change)',
 'Classic DP problems: Fibonacci, climbing stairs, coin change', 4, true),

('d2050000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 3 (0/1 Knapsack, Unbounded Knapsack)',
 'Knapsack variations: 0/1 and unbounded knapsack problems', 5, true),

('d2050000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 4 (LCS, LIS, Edit Distance)',
 'String DP: longest common subsequence, LIS, edit distance', 6, true),

('d2050000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 5 (Matrix Chain Multiplication, Optimal BST)',
 'MCM pattern and optimal binary search tree construction', 7, true),

('d2050000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 6 (Subset Sum, Partition Problems)',
 'Subset sum and partition equal subset problems', 8, true),

('d2050000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 7 (Palindrome Partitioning, Egg Drop)',
 'Palindrome partitioning and egg drop optimization', 9, true),

('d2050000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 8 (DP on Trees, Digit DP)',
 'Advanced DP: tree DP and digit DP techniques', 10, true),

('d2050000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000005',
 'Dynamic Programming - 9 (Problem-Solving Marathon)',
 'DP problem-solving marathon with mixed difficulty', 11, true),

('d2050000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000005',
 'Mock Interview: DP Mastery',
 'Mock interview session focused on dynamic programming', 12, true);

-- =============================================
-- MODULE 11: Graph Algorithms (9 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2060000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 1 (Representation: Adjacency Matrix/List, Edge List)',
 'Graph representations and when to use each approach', 1, true),

('d2060000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 2 (DFS, BFS, Connected Components)',
 'Graph traversals: DFS, BFS, and finding connected components', 2, true),

('d2060000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 3 (Cycle Detection in Directed/Undirected Graphs)',
 'Detecting cycles in both directed and undirected graphs', 3, true),

('d2060000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 4 (Topological Sorting, Kahn''s Algorithm)',
 'Topological sorting using DFS and Kahn''s BFS approach', 4, true),

('d2060000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 5 (Minimum Spanning Tree: Prim''s Algorithm)',
 'Finding MST using Prim''s algorithm', 5, true),

('d2060000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 6 (Dijkstra''s Algorithm, Shortest Path)',
 'Single source shortest path using Dijkstra''s algorithm', 6, true),

('d2060000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 7 (Bellman-Ford, Floyd-Warshall, Negative Cycles)',
 'Handling negative weights and all-pairs shortest paths', 7, true),

('d2060000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 8 (Disjoint Set Union, Kruskal''s Algorithm)',
 'Union-Find data structure and Kruskal''s MST algorithm', 8, true),

('d2060000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000006',
 'Graph - 9 (Advanced Problems: Bridges, Articulation Points)',
 'Finding bridges and articulation points in graphs', 9, true);

-- =============================================
-- MODULE 12: System Design & Final Preparation (8 Classes)
-- =============================================
INSERT INTO lessons (id, topic_id, title, description, display_order, is_active) VALUES
('d2070000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000007',
 'LLD - 1: SOLID Principles, Design Patterns (Singleton, Factory, Observer)',
 'SOLID principles and essential design patterns', 1, true),

('d2070000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000007',
 'LLD - 2: Object-Oriented Design (Parking Lot, Library Management System)',
 'Designing real-world systems: parking lot, library management', 2, true),

('d2070000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000007',
 'LLD - 3: Design Chess Game, Elevator System, ATM Machine',
 'Complex LLD problems: chess, elevator, ATM design', 3, true),

('d2070000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000007',
 'HLD - 1: System Design Fundamentals (Scalability, Load Balancing, Caching)',
 'System design basics: scalability, load balancers, caching strategies', 4, true),

('d2070000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000007',
 'HLD - 2: Database Design (SQL vs NoSQL, Sharding, Replication)',
 'Database design: SQL vs NoSQL, sharding, and replication', 5, true),

('d2070000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000007',
 'HLD - 3: Design URL Shortener, Design Twitter, Design WhatsApp',
 'Classic system design problems: URL shortener, Twitter, WhatsApp', 6, true),

('d2070000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000007',
 'Mock Interview - 1: DSA Problem Solving (Arrays, Strings, Trees, DP)',
 'Mock interview: comprehensive DSA problem solving', 7, true),

('d2070000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000007',
 'Mock Interview - 2: System Design Round (LLD + HLD)',
 'Mock interview: combined LLD and HLD system design round', 8, true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count topics per module
SELECT
  cm.name as module_name,
  cm.type as module_type,
  COUNT(t.id) as topic_count
FROM course_modules cm
LEFT JOIN topics t ON t.module_id = cm.id
GROUP BY cm.id, cm.name, cm.type, cm.display_order
ORDER BY cm.display_order;

-- Count lessons per topic
SELECT
  t.name as topic_name,
  cm.type as module_type,
  COUNT(l.id) as lesson_count
FROM topics t
JOIN course_modules cm ON cm.id = t.module_id
LEFT JOIN lessons l ON l.topic_id = t.id
WHERE cm.type IN ('beginner', 'advanced')
GROUP BY t.id, t.name, cm.type, cm.display_order, t.display_order
ORDER BY cm.display_order, t.display_order;

-- Total lessons count
SELECT
  cm.type as module_type,
  COUNT(l.id) as total_lessons
FROM course_modules cm
JOIN topics t ON t.module_id = cm.id
JOIN lessons l ON l.topic_id = t.id
WHERE cm.type IN ('beginner', 'advanced')
GROUP BY cm.type;
