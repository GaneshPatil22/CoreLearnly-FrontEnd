const PrivacyPolicyPage = () => {
  return (
    <div className="section-container py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-dark-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Introduction</h2>
            <p>
              At CoreLearnly, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Information We Collect</h2>
            <p className="mb-2">When you apply to our program, we collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Educational background or professional information</li>
              <li>Additional messages or queries</li>
              <li>Source of referral</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Process your application</li>
              <li>Communicate with you about our programs</li>
              <li>Improve our services</li>
              <li>Send program updates and announcements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from
              unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:contact@corelearnly.com" className="text-primary hover:underline">
                contact@corelearnly.com
              </a>
            </p>
          </section>

          <section className="pt-4 border-t border-dark-border">
            <p className="text-sm text-dark-text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
