import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const PrivacyPolicyPage = () => {
  return (
    <div className="section-container py-16 md:py-24">
      <SEO
        title="Privacy Policy"
        description="CoreLearnly's privacy policy. Learn how we collect, use, and protect your personal information."
        path="/privacy-policy"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy <span className="text-gradient">Policy</span>
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
                  Welcome to CoreLearnly. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information when you use our website, workshops, and courses.
                </p>
                <p>
                  By using our Services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Information You Provide to Us</h3>
                <p className="mb-3">When you register for our Workshop or Course, we collect:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong className="text-white">Personal Information:</strong> Full name, email address, phone number</li>
                  <li><strong className="text-white">Professional Information:</strong> Educational background, current status (student/working professional), LinkedIn profile</li>
                  <li><strong className="text-white">Communication Data:</strong> Messages, queries, feedback, and correspondence with us</li>
                  <li><strong className="text-white">Payment Information:</strong> Billing details, transaction history (processed securely through Razorpay)</li>
                  <li><strong className="text-white">Referral Source:</strong> How you heard about us</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Information We Collect Automatically</h3>
                <p className="mb-3">When you visit our website or use our Services, we automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent, clicks, navigation paths</li>
                  <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system, device type</li>
                  <li><strong className="text-white">Location Data:</strong> General geographic location based on IP address</li>
                  <li><strong className="text-white">Cookies & Tracking:</strong> See Section 5 for details</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Information from Third Parties</h3>
                <p className="mb-3">We may receive information from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Payment Processors:</strong> Razorpay (transaction confirmations)</li>
                  <li><strong className="text-white">Analytics Providers:</strong> Google Analytics (website usage data)</li>
                  <li><strong className="text-white">Social Media:</strong> If you interact with our social media posts</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-3">We use your information for the following purposes:</p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.1 To Provide Our Services</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Process your Workshop/Course registration</li>
                  <li>Provide access to classes, materials, and recordings</li>
                  <li>Send Zoom links, reminders, and class notifications</li>
                  <li>Respond to your inquiries and provide support</li>
                  <li>Process payments and issue refunds</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.2 To Communicate with You</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Send confirmation emails and receipts</li>
                  <li>Provide course updates and announcements</li>
                  <li>Send educational content and tips</li>
                  <li>Request feedback and testimonials</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.3 To Improve Our Services</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Analyze usage patterns and preferences</li>
                  <li>Monitor and improve website performance</li>
                  <li>Develop new features and content</li>
                  <li>Conduct research and analytics</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.4 For Legal and Security Purposes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enforce our Terms and Conditions</li>
                  <li>Prevent fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect our rights and property</li>
                </ul>
              </section>

              {/* How We Share Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
                <p className="mb-3">We do not sell your personal information. We may share your information with:</p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Service Providers</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong className="text-white">Payment Processing:</strong> Razorpay (for secure payment transactions)</li>
                  <li><strong className="text-white">Email Services:</strong> Brevo/SendGrid (for sending emails)</li>
                  <li><strong className="text-white">Analytics:</strong> Google Analytics (for website analytics)</li>
                  <li><strong className="text-white">Video Conferencing:</strong> Zoom (for live classes)</li>
                  <li><strong className="text-white">Cloud Storage:</strong> Google Drive (for materials and recordings)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.2 Legal Requirements</h3>
                <p className="mb-4">
                  We may disclose your information if required by law, court order, or government authority, or to protect our rights, property, or safety.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.3 Business Transfers</h3>
                <p>
                  If CoreLearnly is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </p>
              </section>

              {/* Cookies and Tracking */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking Technologies</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.1 What Are Cookies?</h3>
                <p className="mb-4">
                  Cookies are small text files stored on your device when you visit our website. We use cookies to improve your experience, analyze usage, and deliver relevant content.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.2 Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for website functionality (e.g., session management)</li>
                  <li><strong className="text-white">Analytics Cookies:</strong> Google Analytics to understand how you use our website</li>
                  <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong className="text-white">Marketing Cookies:</strong> Track your activity for advertising purposes (with consent)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.3 Managing Cookies</h3>
                <p>
                  You can control and delete cookies through your browser settings. However, disabling certain cookies may affect website functionality.
                </p>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                <p className="mb-3">
                  We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Secure HTTPS encryption for data transmission</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits and updates</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
                <p>
                  While we strive to protect your data, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                <p className="mb-3">We retain your personal information for as long as necessary to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Provide our Services to you</li>
                  <li>Comply with legal obligations (e.g., tax records for 7 years)</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records</li>
                </ul>
                <p className="mb-3">
                  After your enrollment ends:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Course Materials:</strong> Access may be retained for a specified period or lifetime (as per our policy)</li>
                  <li><strong className="text-white">Personal Data:</strong> Retained for up to 3 years for support and legal purposes, then anonymized or deleted</li>
                  <li><strong className="text-white">Payment Data:</strong> Retained for 7 years for tax and accounting purposes</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
                <p className="mb-3">You have the following rights regarding your personal information:</p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.1 Access and Portability</h3>
                <p className="mb-4">
                  You have the right to request a copy of your personal data in a structured, commonly used format.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.2 Correction</h3>
                <p className="mb-4">
                  You can request that we correct inaccurate or incomplete personal information.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.3 Deletion</h3>
                <p className="mb-4">
                  You can request that we delete your personal information, subject to legal retention requirements.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.4 Opt-Out of Marketing</h3>
                <p className="mb-4">
                  You can unsubscribe from marketing emails at any time by clicking the "unsubscribe" link in our emails.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.5 Withdraw Consent</h3>
                <p className="mb-4">
                  Where we rely on your consent, you can withdraw it at any time.
                </p>

                <p className="mt-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:hello@corelearn.ly" className="text-primary hover:underline">
                    hello@corelearn.ly
                  </a>
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                <p>
                  Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              {/* International Data Transfers */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
                <p className="mb-3">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
                </p>
                <p>
                  We ensure appropriate safeguards are in place to protect your data during international transfers, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Using service providers that comply with international data protection standards</li>
                  <li>Implementing standard contractual clauses</li>
                  <li>Ensuring adequate security measures</li>
                </ul>
              </section>

              {/* Third-Party Links */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites (e.g., LinkedIn, YouTube, GitHub). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any information.
                </p>
              </section>

              {/* Changes to This Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
                <p className="mb-3">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
                </p>
                <p className="mb-3">
                  When we make material changes, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Update the "Last Updated" date at the top of this policy</li>
                  <li>Notify you via email</li>
                  <li>Display a prominent notice on our website</li>
                </ul>
                <p>
                  Your continued use of our Services after changes become effective constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p className="mb-3">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-dark-bg p-4 rounded-lg">
                  <p className="mb-2"><strong className="text-white">CoreLearnly</strong></p>
                  <p className="mb-2">Email: <a href="mailto:hello@corelearn.ly" className="text-primary hover:underline">hello@corelearn.ly</a></p>
                  <p>Website: <a href="https://corelearn.ly" className="text-primary hover:underline">https://corelearn.ly</a></p>
                </div>
              </section>

              {/* Consent */}
              <section className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                <h3 className="text-xl font-semibold text-white mb-3">Your Consent</h3>
                <p className="mb-3">
                  By using our Services, you consent to the collection, use, and sharing of your information as described in this Privacy Policy.
                </p>
                <p>
                  For more information about how we handle your data in specific contexts, please refer to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>.
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

export default PrivacyPolicyPage;
