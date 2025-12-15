import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who is this program for?",
    answer: "This program is designed for students preparing for placements, working professionals preparing for interviews, career switchers entering tech, and anyone looking to strengthen their DSA and system design skills."
  },
  {
    question: "What is the duration of the program?",
    answer: "The complete program runs for 6 months. This includes comprehensive coverage of DSA, Low Level Design (LLD), High Level Design (HLD), and AI fundamentals."
  },
  {
    question: "What is the class schedule?",
    answer: "Weekdays: 3 live DSA classes per week. Weekends: AI fundamentals and language-specific DSA bridge sessions (Java, JavaScript, Python, Swift). All classes are conducted live online, allowing for real-time interaction and doubt clearing."
  },
  {
    question: "Are the classes live or recorded?",
    answer: "All classes are conducted LIVE online. This ensures you can interact directly, ask questions in real-time, and get personalized guidance. Recordings are provided for revision."
  },
  {
    question: "Do I need prior programming experience?",
    answer: "Basic programming knowledge in any language is recommended. You should be comfortable with variables, loops, and functions. The program will build everything else from the ground up."
  },
  {
    question: "Will there be coding projects?",
    answer: "This program focuses on DSA problem-solving and system design case studies rather than building applications. All projects are design-focused — you'll work on real-world system design exercises like designing Uber, Netflix, etc."
  },
  {
    question: "What topics are covered in the curriculum?",
    answer: "The curriculum covers: DSA (Data Structures & Algorithms), LLD (Low Level Design & Design Patterns), HLD (High Level Design & Scalable Systems), and AI Fundamentals (tools, productivity, practical applications)."
  },
  {
    question: "How is this different from other courses?",
    answer: "Direct mentorship from me — not a large team or pre-recorded content. Live classes with real-time interaction. Focus on interview preparation with practical system design case studies. Plus, you learn AI tools that actually help in your day-to-day work."
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-dark-text-secondary">
            Everything you need to know about the program
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card border-dark-border hover:border-primary/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-primary"
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
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-dark-text-secondary mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
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

export default FAQSection;
