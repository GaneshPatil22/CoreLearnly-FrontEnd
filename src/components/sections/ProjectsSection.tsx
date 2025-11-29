import { motion } from 'framer-motion';
import type { Project } from '../../types';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Design Ticket Booking System (BookMyShow)',
    description: 'Design a scalable ticket booking platform with seat selection, payment processing, concurrent booking handling, and real-time availability updates.',
    technologies: ['HLD', 'LLD', 'System Design', 'Database Design', 'Concurrency'],
    difficulty: 'Advanced',
  },
  {
    id: '2',
    title: 'Design Notification System',
    description: 'Build a multi-channel notification service supporting push notifications, SMS, email with rate limiting, retry mechanisms, and delivery tracking.',
    technologies: ['HLD', 'Message Queue', 'Microservices', 'Rate Limiting', 'Webhooks'],
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Design URL Shortener Service',
    description: 'Create a URL shortening service like bit.ly with custom aliases, analytics, expiration, and high-throughput read/write operations.',
    technologies: ['LLD', 'HLD', 'Caching', 'Database Sharding', 'Load Balancing'],
    difficulty: 'Intermediate',
  },
  {
    id: '4',
    title: 'Design Parking Lot System',
    description: 'Design a parking lot management system with floor management, slot allocation strategies, payment processing, and vehicle tracking.',
    technologies: ['LLD', 'OOP', 'Design Patterns', 'State Management', 'SOLID Principles'],
    difficulty: 'Intermediate',
  },
  {
    id: '5',
    title: 'Design Rate Limiter Service',
    description: 'Implement a distributed rate limiter for API throttling with multiple algorithms (token bucket, sliding window) and Redis-based coordination.',
    technologies: ['HLD', 'Distributed Systems', 'Redis', 'Algorithms', 'Scalability'],
    difficulty: 'Advanced',
  },
  {
    id: '6',
    title: 'Design Elevator System',
    description: 'Design an elevator control system with optimal scheduling algorithms, direction management, and handling multiple elevator coordination.',
    technologies: ['LLD', 'Algorithms', 'State Machines', 'Optimization', 'OOP'],
    difficulty: 'Intermediate',
  },
  {
    id: '7',
    title: 'Design Food Delivery App (Swiggy/Zomato)',
    description: 'Design end-to-end food delivery platform with restaurant management, order matching, delivery tracking, and real-time updates.',
    technologies: ['HLD', 'Microservices', 'Geospatial', 'Real-time Systems', 'Websockets'],
    difficulty: 'Advanced',
  },
  {
    id: '8',
    title: 'Design Twitter/X Feed System',
    description: 'Build a social media feed system with timeline generation, fanout strategies, caching, and handling high read/write throughput.',
    technologies: ['HLD', 'Caching', 'Database Design', 'Feed Ranking', 'Scalability'],
    difficulty: 'Advanced',
  },
  {
    id: '9',
    title: 'Design Library Management System',
    description: 'Create a library management system with book inventory, member management, lending, returns, and fine calculation.',
    technologies: ['LLD', 'OOP', 'Database Design', 'Business Logic', 'Design Patterns'],
    difficulty: 'Beginner',
  },
];

const difficultyColors = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
  Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Advanced: 'text-primary bg-primary/10 border-primary/30',
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            System Design <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
            Master HLD & LLD through real-world system design problems from top tech companies
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="card border-dark-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* Project Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white flex-1">
                    {project.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      difficultyColors[project.difficulty]
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-dark-text-secondary text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-dark-bg border border-dark-border text-dark-text-secondary px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Icon */}
              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <span>Hands-on Project</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-dark-text-secondary mb-4">
            Each case study includes architecture diagrams, design documents, and detailed analysis
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
