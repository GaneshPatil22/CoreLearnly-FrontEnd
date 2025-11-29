import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CurriculumModule } from '../../types';

const curriculumData: CurriculumModule[] = [
  // PHASE 1: Fundamentals to Intermediate (30 Classes)
  {
    id: '1',
    title: 'Module 1: Introduction & Problem-Solving Fundamentals',
    duration: '4 Classes',
    topics: [
      'Meet & Greet + Course Introduction',
      'HLD & LLD Basics (Overview of System Design)',
      'Introduction to Problem-Solving + Time Complexity - 1',
      'Time Complexity - 2 + Space Complexity + Asymptotic Analysis',
    ],
  },
  {
    id: '2',
    title: 'Module 2: Arrays & Bit Manipulation',
    duration: '7 Classes',
    topics: [
      'Introduction to Arrays + Prefix Sum Technique',
      'Carry Forward + Subarrays (Kadane\'s Algorithm)',
      '2D Arrays & Matrix Operations',
      'Array Interview Problems (Sliding Window, Two Pointers)',
      'Bit Manipulation - 1 (Basics, AND, OR, NOT, XOR)',
      'Bit Manipulation - 2 (Set/Unset Bits, Power of 2, Count Set Bits)',
      'Bit Manipulation - 3 (Advanced Applications & Problem Solving)',
    ],
  },
  {
    id: '3',
    title: 'Module 3: Mathematics & String Manipulation',
    duration: '6 Classes',
    topics: [
      'Modular Arithmetic & Prime Numbers (Sieve of Eratosthenes)',
      'GCD, LCM & Number Theory Fundamentals',
      'String Basics + String Operations (Reversal, Palindrome)',
      'String Pattern Matching (KMP, Rabin-Karp)',
      'Advanced String Problems (Anagrams, Subsequences)',
      'Combined Array & String Problem Solving',
    ],
  },
  {
    id: '4',
    title: 'Module 4: Recursion, Sorting & Hashing',
    duration: '8 Classes',
    topics: [
      'Recursion - 1 (Basics, Call Stack Visualization)',
      'Recursion - 2 (Backtracking Introduction, N-Queens Preview)',
      'Sorting - 1 (Bubble, Selection, Insertion Sort)',
      'Sorting - 2 (Merge Sort, Quick Sort)',
      'Sorting - 3 (Counting Sort, Radix Sort, Bucket Sort)',
      'Hashing - 1 (Maps, Sets, Hash Functions, Load Factor)',
      'Hashing - 2 (Collision Handling, Frequency Counting Problems)',
      'Subsequences & Subsets Generation',
    ],
  },
  {
    id: '5',
    title: 'Module 5: Linked Lists, Stacks & Queues',
    duration: '5 Classes',
    topics: [
      'Linked List - 1 (Singly, Doubly, Circular)',
      'Linked List - 2 (Reversal, Middle Element, Cycle Detection)',
      'Stack - 1 (Implementation & Classic Problems)',
      'Queue - 1 (Implementation, Circular Queue, Deque)',
      'Stack & Queue Advanced Problems (Next Greater Element, LRU Cache)',
    ],
  },

  // PHASE 2: Advanced Topics & System Design (60 Classes)
  {
    id: '6',
    title: 'Module 6: Advanced Arrays & Number Theory',
    duration: '6 Classes',
    topics: [
      'Advanced Array Techniques (Sliding Window, Kadane\'s Extensions)',
      'Negative Number Handling & Inverse Modulo',
      'Combinatorics & Advanced Modular Arithmetic (nCr, nPr)',
      'Sorting - 4 (Heap Sort, Quick Sort Optimization)',
      'Two Pointers - 1 (Basics, Pair Sum Problems)',
      'Two Pointers - 2 (3Sum, 4Sum, Container Problems)',
    ],
  },
  {
    id: '7',
    title: 'Module 7: Binary Search & Linked List Mastery',
    duration: '6 Classes',
    topics: [
      'Binary Search - 1 (Fundamentals, Search Space Reduction)',
      'Binary Search - 2 (Binary Search on Answer Space)',
      'Binary Search - 3 (Matrix Search, Rotated Arrays)',
      'Linked List - 3 (Advanced Problems: Merge K Lists, Clone with Random)',
      'Linked List - 4 (Flatten, Intersection, Add Numbers)',
      'Problem-Solving Session: Linked Lists',
    ],
  },
  {
    id: '8',
    title: 'Module 8: Trees & Tries',
    duration: '7 Classes',
    topics: [
      'Trees - 1 (Structure, Traversals: Inorder, Preorder, Postorder)',
      'Trees - 2 (Binary Search Tree, AVL Trees, Balance)',
      'Trees - 3 (Lowest Common Ancestor, Path Problems)',
      'Trees - 4 (Diameter, Height, Views, Serialize/Deserialize)',
      'Tries - 1 (Basics, Implementation, Insert/Search)',
      'Tries - 2 (Word Search, Dictionary Problems)',
      'Tries - 3 (Prefix Matching, Autocomplete, XOR Problems)',
    ],
  },
  {
    id: '9',
    title: 'Module 9: Heap & Greedy Algorithms',
    duration: '6 Classes',
    topics: [
      'Heap - 1 (Min Heap, Max Heap, Heapify Operations)',
      'Heap - 2 (Heap Sort, Priority Queue Implementation)',
      'Heap - 3 (Top K Elements, Median Stream, Merge K Lists)',
      'Greedy Algorithms - 1 (Introduction, Activity Selection)',
      'Greedy Algorithms - 2 (Fractional Knapsack, Job Sequencing)',
      'Greedy Algorithms - 3 (Huffman Coding, Gas Station, Jump Game)',
    ],
  },
  {
    id: '10',
    title: 'Module 10: Backtracking & Dynamic Programming',
    duration: '12 Classes',
    topics: [
      'Backtracking - 1 (N-Queens, Sudoku Solver)',
      'Backtracking - 2 (Permutations, Combinations, Rat in Maze)',
      'Dynamic Programming - 1 (Introduction, Memoization vs Tabulation)',
      'Dynamic Programming - 2 (Fibonacci, Climbing Stairs, Coin Change)',
      'Dynamic Programming - 3 (0/1 Knapsack, Unbounded Knapsack)',
      'Dynamic Programming - 4 (LCS, LIS, Edit Distance)',
      'Dynamic Programming - 5 (Matrix Chain Multiplication, Optimal BST)',
      'Dynamic Programming - 6 (Subset Sum, Partition Problems)',
      'Dynamic Programming - 7 (Palindrome Partitioning, Egg Drop)',
      'Dynamic Programming - 8 (DP on Trees, Digit DP)',
      'Dynamic Programming - 9 (Problem-Solving Marathon)',
      'Mock Interview: DP Mastery',
    ],
  },
  {
    id: '11',
    title: 'Module 11: Graph Algorithms',
    duration: '9 Classes',
    topics: [
      'Graph - 1 (Representation: Adjacency Matrix/List, Edge List)',
      'Graph - 2 (DFS, BFS, Connected Components)',
      'Graph - 3 (Cycle Detection in Directed/Undirected Graphs)',
      'Graph - 4 (Topological Sorting, Kahn\'s Algorithm)',
      'Graph - 5 (Minimum Spanning Tree: Prim\'s Algorithm)',
      'Graph - 6 (Dijkstra\'s Algorithm, Shortest Path)',
      'Graph - 7 (Bellman-Ford, Floyd-Warshall, Negative Cycles)',
      'Graph - 8 (Disjoint Set Union, Kruskal\'s Algorithm)',
      'Graph - 9 (Advanced Problems: Bridges, Articulation Points)',
    ],
  },
  {
    id: '12',
    title: 'Module 12: System Design & Final Preparation',
    duration: '8 Classes',
    topics: [
      'LLD - 1: SOLID Principles, Design Patterns (Singleton, Factory, Observer)',
      'LLD - 2: Object-Oriented Design (Parking Lot, Library Management System)',
      'LLD - 3: Design Chess Game, Elevator System, ATM Machine',
      'HLD - 1: System Design Fundamentals (Scalability, Load Balancing, Caching)',
      'HLD - 2: Database Design (SQL vs NoSQL, Sharding, Replication)',
      'HLD - 3: Design URL Shortener, Design Twitter, Design WhatsApp',
      'Mock Interview - 1: DSA Problem Solving (Arrays, Strings, Trees, DP)',
      'Mock Interview - 2: System Design Round (LLD + HLD)',
    ],
  },
];

const CurriculumSection = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<'basic' | 'advanced'>('basic');

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Split curriculum into two phases
  const basicModules = curriculumData.slice(0, 5); // First 5 modules (30 classes)
  const advancedModules = curriculumData.slice(5); // Remaining modules (60 classes)

  const displayedModules = activePhase === 'basic' ? basicModules : advancedModules;

  return (
    <section id="curriculum" className="section-container py-16 md:py-24 bg-dark-bg/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete <span className="text-gradient">Curriculum</span>
          </h2>
          <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
            180 days (6 months) intensive training - 90 classes covering DSA, System Design, and Design Case Studies
          </p>
        </div>

        {/* Phase Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-dark-card border border-dark-border p-1">
            <button
              onClick={() => {
                setActivePhase('basic');
                setExpandedModule(null);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activePhase === 'basic'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              Basic (Phase 1)
              <span className="block text-xs mt-1 opacity-80">30 Classes - Fundamentals</span>
            </button>
            <button
              onClick={() => {
                setActivePhase('advanced');
                setExpandedModule(null);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activePhase === 'advanced'
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              Advanced (Phase 2)
              <span className="block text-xs mt-1 opacity-80">60 Classes - Advanced Topics</span>
            </button>
          </div>
        </div>

        {/* Curriculum Modules */}
        <div className="max-w-4xl mx-auto space-y-4">
          {displayedModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card border-dark-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between text-left p-6 focus:outline-none group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                      {module.duration}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                    expandedModule === module.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Module Content */}
              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-dark-border">
                      <ul className="space-y-3 mt-4">
                        {module.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-dark-text-secondary">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CurriculumSection;
