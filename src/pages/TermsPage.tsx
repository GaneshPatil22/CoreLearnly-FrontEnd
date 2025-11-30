import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="section-container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <p className="text-dark-text-secondary">
            Last Updated: November 29, 2024
          </p>
        </div>

        {/* Content */}
        <div className="card border-dark-border p-8 md:p-12">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-dark-text-secondary">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="mb-3">
                  Welcome to CoreLearnly ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, workshops, and courses. By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p>
                  If you do not agree with these Terms, please do not use our services.
                </p>
              </section>

              {/* Definitions */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">"Services"</strong> refers to our workshops, courses, website, and all related content and materials.</li>
                  <li><strong className="text-white">"Workshop"</strong> refers to our FREE 2-day online workshop on DSA, System Design, and AI.</li>
                  <li><strong className="text-white">"Course"</strong> refers to our paid 6-month CoreLearnly program.</li>
                  <li><strong className="text-white">"User," "You,"</strong> or <strong className="text-white">"Your"</strong> refers to any individual or entity accessing our Services.</li>
                  <li><strong className="text-white">"Content"</strong> refers to all materials, videos, slides, code, assignments, and resources provided through our Services.</li>
                </ul>
              </section>

              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Acceptance of Terms</h2>
                <p className="mb-3">
                  By registering for our Workshop or Course, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p>
                  If you are registering on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </section>

              {/* Workshop Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. FREE Workshop Terms</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Registration</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Workshop registration is free and open to all.</li>
                  <li>You must provide accurate and complete information during registration.</li>
                  <li>We reserve the right to refuse registration to anyone for any reason.</li>
                  <li>Registration does not guarantee admission to the full Course.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.2 Attendance</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Workshop is scheduled for January 11-12, 2025, from 10:00 AM to 2:00 PM IST each day.</li>
                  <li>Attendance is optional but recommended for both days.</li>
                  <li>We will provide recordings to registered participants who cannot attend live.</li>
                  <li>We reserve the right to reschedule the workshop due to unforeseen circumstances.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.3 Workshop Content</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All workshop materials are provided for educational purposes only.</li>
                  <li>You may not record, redistribute, or commercialize workshop content without written permission.</li>
                  <li>We reserve the right to modify workshop content, schedule, or instructors without prior notice.</li>
                </ul>
              </section>

              {/* Course Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Paid Course Terms</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.1 Enrollment</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Course enrollment is subject to availability and acceptance of your application.</li>
                  <li>The first 20 students who enroll get the Basic Module (2 months) FREE.</li>
                  <li>Standard course fee is ₹2,000 per month for 6 months (total ₹12,000).</li>
                  <li>With the promotional offer, first 20 students pay ₹8,000 (4 months only).</li>
                  <li>Enrollment is confirmed only upon receipt of payment.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.2 Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>All fees are in Indian Rupees (₹) unless otherwise stated.</li>
                  <li>Payment must be made through our authorized payment gateway (Razorpay).</li>
                  <li>Monthly payments are due on or before the 1st of each month.</li>
                  <li>Late payments may result in access suspension until payment is received.</li>
                  <li>We reserve the right to change pricing with 30 days' notice to existing students.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.3 Refund Policy</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong className="text-white">7-Day Money-Back Guarantee:</strong> Full refund if requested within 7 days of enrollment and before attending 2nd class.</li>
                  <li><strong className="text-white">After 7 Days:</strong> No refunds will be provided.</li>
                  <li><strong className="text-white">Partial Completion:</strong> No refunds for partially completed months.</li>
                  <li><strong className="text-white">Promotional Offers:</strong> Discounted amounts (2 months free) are non-refundable.</li>
                  <li>Refunds will be processed within 7-10 business days to the original payment method.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.4 Course Access</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Course duration is 6 months from the start date (January 27, 2025).</li>
                  <li>Classes are held 4 times per week (3 DSA + 1 AI session).</li>
                  <li>All classes are live online via Zoom.</li>
                  <li>Recordings will be available for 30 days after each class.</li>
                  <li>Access to course materials is limited to the enrollment period unless otherwise stated.</li>
                  <li>Lifetime access to select course materials may be provided at our discretion.</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. User Responsibilities</h2>
                <p className="mb-3">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and truthful information during registration.</li>
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Not share your account access with others.</li>
                  <li>Not record, copy, or distribute our Content without permission.</li>
                  <li>Not use our Services for any illegal or unauthorized purpose.</li>
                  <li>Not disrupt or interfere with the Services or servers.</li>
                  <li>Respect the intellectual property rights of CoreLearnly and third parties.</li>
                  <li>Behave professionally and respectfully towards instructors and other students.</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.1 Our Content</h3>
                <p className="mb-3">
                  All Content provided through our Services, including but not limited to videos, slides, code, assignments, designs, logos, and trademarks, is owned by CoreLearnly or licensed to us. This Content is protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.2 Limited License</h3>
                <p className="mb-3">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our Content solely for your personal educational purposes. You may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Reproduce, distribute, or publicly display our Content.</li>
                  <li>Create derivative works based on our Content.</li>
                  <li>Sell, rent, lease, or sublicense our Content.</li>
                  <li>Use our Content for commercial purposes.</li>
                  <li>Remove or alter any copyright, trademark, or proprietary notices.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.3 Your Content</h3>
                <p>
                  You retain ownership of any content you create or submit through our Services (e.g., assignments, projects). By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content for educational and promotional purposes.
                </p>
              </section>

              {/* Code of Conduct */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Code of Conduct</h2>
                <p className="mb-3">We expect all users to maintain a professional and respectful learning environment. Prohibited conduct includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Harassment, discrimination, or offensive behavior towards others.</li>
                  <li>Plagiarism or academic dishonesty.</li>
                  <li>Spamming, advertising, or soliciting other students.</li>
                  <li>Sharing false or misleading information.</li>
                  <li>Attempting to hack, disrupt, or compromise our Services.</li>
                </ul>
                <p className="mt-3">
                  Violation of this Code of Conduct may result in immediate termination of your access without refund.
                </p>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.1 Educational Purpose</h3>
                <p className="mb-4">
                  Our Services are provided for educational purposes only. We do not guarantee job placement, specific outcomes, or results from completing our Workshop or Course.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.2 No Warranties</h3>
                <p className="mb-4">
                  Our Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.3 Technical Issues</h3>
                <p>
                  We strive to maintain uninterrupted access to our Services, but we do not guarantee that our Services will be error-free, secure, or available at all times. We are not responsible for technical failures, internet outages, or third-party service disruptions.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                <p className="mb-3">
                  To the fullest extent permitted by law, CoreLearnly, its instructors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Your use or inability to use our Services.</li>
                  <li>Unauthorized access to or alteration of your data.</li>
                  <li>Any conduct or content of third parties on our Services.</li>
                  <li>Any content obtained from our Services.</li>
                </ul>
                <p>
                  Our total liability to you for any claim arising from these Terms or our Services shall not exceed the amount you paid to us in the 6 months preceding the claim.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless CoreLearnly, its instructors, employees, and affiliates from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your violation of these Terms.</li>
                  <li>Your violation of any rights of another party.</li>
                  <li>Your use or misuse of our Services.</li>
                  <li>Your content submitted through our Services.</li>
                </ul>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">12.1 By You</h3>
                <p className="mb-4">
                  You may stop using our Services at any time. To cancel your Course enrollment, contact us in writing. Refunds are subject to our Refund Policy (Section 5.3).
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">12.2 By Us</h3>
                <p className="mb-3">
                  We reserve the right to suspend or terminate your access to our Services at any time for any reason, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Violation of these Terms.</li>
                  <li>Non-payment of fees.</li>
                  <li>Fraudulent or illegal activity.</li>
                  <li>Disruptive behavior.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">12.3 Effect of Termination</h3>
                <p>
                  Upon termination, your right to access and use our Services will immediately cease. You will lose access to all Content, materials, and recordings. Sections of these Terms that by their nature should survive termination will survive, including intellectual property rights, disclaimers, limitation of liability, and dispute resolution.
                </p>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as described in the Privacy Policy.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">14. Changes to These Terms</h2>
                <p className="mb-3">
                  We reserve the right to modify these Terms at any time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Posting the updated Terms on our website.</li>
                  <li>Sending an email notification to registered users.</li>
                  <li>Displaying a notice on our Services.</li>
                </ul>
                <p>
                  Your continued use of our Services after the changes become effective constitutes your acceptance of the revised Terms. If you do not agree to the changes, you must stop using our Services.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law & Dispute Resolution</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">15.1 Governing Law</h3>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">15.2 Dispute Resolution</h3>
                <p className="mb-3">
                  In the event of any dispute arising from these Terms or our Services, both parties agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>First attempt to resolve the dispute through good-faith negotiation.</li>
                  <li>If negotiation fails, submit the dispute to mediation.</li>
                  <li>If mediation fails, submit the dispute to binding arbitration in accordance with Indian arbitration laws.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">15.3 Jurisdiction</h3>
                <p>
                  Any legal action or proceeding related to these Terms shall be brought exclusively in the courts located in [Your City/State], India, and you consent to the jurisdiction of such courts.
                </p>
              </section>

              {/* Miscellaneous */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">16. Miscellaneous</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">16.1 Entire Agreement</h3>
                <p className="mb-4">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and CoreLearnly regarding our Services and supersede all prior agreements.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">16.2 Severability</h3>
                <p className="mb-4">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">16.3 Waiver</h3>
                <p className="mb-4">
                  Our failure to enforce any right or provision of these Terms will not constitute a waiver of that right or provision.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">16.4 Assignment</h3>
                <p className="mb-4">
                  You may not assign or transfer these Terms or your rights under these Terms without our prior written consent. We may assign these Terms without restriction.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">16.5 Headings</h3>
                <p>
                  The section headings in these Terms are for convenience only and have no legal or contractual effect.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">17. Contact Information</h2>
                <p className="mb-3">
                  If you have any questions, concerns, or complaints about these Terms, please contact us:
                </p>
                <div className="bg-dark-bg p-4 rounded-lg">
                  <p className="mb-2"><strong className="text-white">CoreLearnly</strong></p>
                  <p className="mb-2">Email: <a href="mailto:hello@corelearn.ly" className="text-primary hover:underline">hello@corelearn.ly</a></p>
                  <p>Website: <a href="https://corelearn.ly" className="text-primary hover:underline">https://corelearn.ly</a></p>
                </div>
              </section>

              {/* Acknowledgment */}
              <section className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                <h3 className="text-xl font-semibold text-white mb-3">Acknowledgment</h3>
                <p>
                  BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE OUR SERVICES.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
