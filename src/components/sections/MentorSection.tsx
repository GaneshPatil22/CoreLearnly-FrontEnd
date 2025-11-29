import { motion } from 'framer-motion';

const MentorSection = () => {
  const mentor = {
    name: 'Ganesh Patil',
    role: 'Sr. iOS Developer',
    company: 'MTailor',
    description:
      '8+ years of experience in software development with expertise in iOS, System Design, and Data Structures & Algorithms. Passionate about teaching and helping developers master complex concepts through hands-on learning. Specialized in building scalable mobile applications and designing robust systems. Strong background in multiple domains including web development, game development, and cross-platform solutions.',
    image: '/mentor.jpg',
    linkedin: 'https://linkedin.com/in/ganeshpatil',
    expertise: [
      'System Design (HLD & LLD)',
      'Data Structures & Algorithms',
      'iOS Development (Swift)',
      'ReactJS',
      'Java & Python',
      'Unity & C# (Game Development)',
      'Web Development',
      'Technical Interview Preparation',
    ],
  };

  return (
    <section id="mentors" className="section-container py-16 md:py-24 bg-dark-bg/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn Directly From{' '}
            <span className="text-gradient">Your Mentor</span>
          </h2>
          <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
            Get personalized guidance and live mentorship from an experienced professional
          </p>
        </div>

        {/* Mentor Profile */}
        <div className="max-w-5xl mx-auto">
          <div className="card border-primary/30">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
              {/* Left Side - Image */}
              <div className="lg:col-span-2">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 overflow-hidden border border-primary/30">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Info */}
              <div className="lg:col-span-3">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Name & Role */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {mentor.name}
                    </h3>
                    <p className="text-lg text-primary font-semibold mb-1">
                      {mentor.role}
                    </p>
                    <p className="text-dark-text-secondary mb-6">{mentor.company}</p>

                    {/* Description */}
                    <p className="text-dark-text-secondary leading-relaxed mb-6">
                      {mentor.description}
                    </p>

                    {/* Expertise Tags */}
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Areas of Expertise:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Link */}
                  <div>
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-400 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default MentorSection;
