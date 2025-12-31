/**
 * Privacy Policy Page
 * GDPR & CCPA Compliant
 */


export default function Privacy() {
  const lastUpdated = "December 26, 2025";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 font-sans">
      <div className="container mx-auto max-w-4xl p-6 py-20 text-slate-700 dark:text-slate-300">
        <div className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Effective Date: December 25, 2024 | Last Updated: {lastUpdated}
          </p>
        </div>
        
        <div className="space-y-12 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              1. Who We Are
            </h2>
            <p>
              My Crochet Kit ("we," "us," or "our") is a digital platform designed for crochet enthusiasts to track progress and manage their craft. 
              Our contact email for privacy matters is <span className="text-purple-600 dark:text-purple-400 font-bold">support@mycrochetkit.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              2. Data We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Details:</strong> Email address provided via Firebase Auth.</li>
                  <li><strong>Payment Info:</strong> While we do not store credit card details, our payment processor (Stripe) collects necessary billing information.</li>
                  <li><strong>Project Content:</strong> Photos, notes, and counter data you upload to track your projects.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">2.2 Automatically Collected Data</h3>
                <p>We use Google Analytics and Firebase to collect anonymized usage data, device types, and interaction metrics to help us improve the app.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              3. Social Sharing Features
            </h2>
            <p>
              Our application utilizes the <strong>Web Share API</strong>, a native browser technology that allows you to share your progress using your device's built-in sharing menu. 
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Zero Tracking:</strong> We do not use third-party "sticky" share bars or scripts that track your browsing habits across other websites.</li>
              <li><strong>Native Choice:</strong> Sharing is entirely under your control. The destination app (e.g., Instagram, WhatsApp, or Email) only receives the text and link you explicitly chose to share.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              4. Administrative Access & Security
            </h2>
            <p>
              To maintain a safe community and ensure platform stability, authorized personnel (Admins) may have limited access to data under specific circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Moderation:</strong> If a post is reported for violating community guidelines, an admin will review the reported content to determine appropriate action.</li>
              <li><strong>Troubleshooting:</strong> With your explicit permission, we may access account data to resolve technical issues you've reported.</li>
              <li><strong>Internal Security:</strong> High-level admin routes are hidden and protected by multi-factor authentication to ensure your data remains secure from unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              5. Data Processors (Third Parties)
            </h2>
            <p className="mb-4">To provide our services, we share necessary data with the following trusted third-party processors:</p>
            <div className="grid gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-black text-slate-900 dark:text-white">Google (Firebase & Analytics)</span>
                <p className="text-sm mt-1">Used for user authentication, database storage, and usage analytics.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-black text-slate-900 dark:text-white">Stripe</span>
                <p className="text-sm mt-1">Handles all payment processing and subscription management. We never see or store your full credit card details.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              6. Your Rights & GDPR Compliance
            </h2>
            <p className="mb-4">Under GDPR, you have significant rights over your data. We respect and facilitate these rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> You can request a summary of the data we hold about you.</li>
              <li><strong>Rectification:</strong> You can request that we correct any inaccurate or incomplete personal data.</li>
              <li><strong>Right to Erasure:</strong> You can request full deletion of your account and all associated data via the account settings or by email.</li>
              <li><strong>Portability:</strong> You can request an export of your project data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              7. Cookies & Tracking
            </h2>
            <p>
              We use essential cookies for session management and authentication (keeping you logged in). 
              While you can disable cookies in your browser, doing so will prevent the application from functioning correctly as we will be unable to maintain your secure session.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              8. Children's Privacy
            </h2>
            <p>
              My Crochet Kit is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13 years of age.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              9. Contact for Privacy
            </h2>
            <p>
              If you have any questions about this policy or wish to exercise your data rights, please contact our privacy coordinator at:<br />
              <strong className="text-purple-600 dark:text-purple-400 text-xl block mt-2">support@mycrochetkit.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
