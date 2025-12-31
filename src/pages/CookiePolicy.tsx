/**
 * Cookie Policy Page
 * GDPR/ePrivacy Compliant
 */

import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="container mx-auto max-w-4xl p-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
        Cookie Policy
      </h1>
      
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        <strong>Effective Date:</strong> December 15, 2024<br />
        <strong>Last Updated:</strong> December 15, 2024
      </p>

      <div className="space-y-8 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit websites. 
            They help websites remember your preferences and improve your experience.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            2. Cookies We Use
          </h2>
          
          <h3 className="mb-2 text-xl font-semibold">2.1 Strictly Necessary Cookies</h3>
          <p className="mb-4">
            These cookies are essential for the website to function. They include:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li><strong>Authentication Cookies:</strong> Keep you logged in across sessions</li>
            <li><strong>Security Cookies:</strong> Protect against cross-site request forgery</li>
            <li><strong>Session Cookies:</strong> Maintain your current session state</li>
          </ul>
          <p className="mb-4 text-sm italic">
            You cannot opt out of strictly necessary cookies as they are required for the service to work.
          </p>

          <h3 className="mb-2 text-xl font-semibold">2.2 Preference Cookies</h3>
          <p className="mb-4">
            These cookies remember your settings and preferences:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li><strong>Theme Preference:</strong> Light/dark mode selection</li>
            <li><strong>Accessibility Settings:</strong> Font size, reduced motion, etc.</li>
            <li><strong>Language Preference:</strong> Your selected language (if applicable)</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">2.3 Analytics Cookies</h3>
          <p className="mb-4">
            We use Google Analytics to understand how visitors use our site. These cookies collect:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Pages visited and time spent</li>
            <li>How you arrived at our site (referrer)</li>
            <li>General device and browser information</li>
          </ul>
          <p className="mb-4 text-sm">
            Analytics data is anonymized and aggregated. We do not track individual users.
            For EU/UK visitors, analytics cookies require your consent.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            3. Third-Party Cookies
          </h2>
          <p className="mb-4">The following third parties may set cookies:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Google Firebase:</strong> Authentication and session management</li>
            <li><strong>Google Analytics:</strong> Website analytics (with consent)</li>
            <li><strong>Stripe:</strong> Payment processing (only during checkout)</li>
          </ul>
          <p className="mt-4">
            We do not use advertising cookies or sell your data to advertisers.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            4. Managing Cookies
          </h2>
          <h3 className="mb-2 text-xl font-semibold">4.1 Cookie Consent</h3>
          <p className="mb-4">
            When you first visit our site, we ask for your consent to use non-essential cookies.
            You can change your preferences at any time by clicking the "Cookie Settings" link in the footer.
          </p>

          <h3 className="mb-2 text-xl font-semibold">4.2 Browser Settings</h3>
          <p className="mb-4">
            You can also control cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Block all cookies</li>
            <li>Block third-party cookies only</li>
            <li>Delete cookies when you close the browser</li>
            <li>Clear all cookies manually</li>
          </ul>
          <p className="mt-4 text-sm italic">
            Note: Blocking all cookies will prevent you from logging in and using most features.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            5. Cookie Retention
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
            <li><strong>Authentication Cookies:</strong> 30 days (or until you log out)</li>
            <li><strong>Preference Cookies:</strong> 1 year</li>
            <li><strong>Analytics Cookies:</strong> Up to 26 months (Google default)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            6. Your Rights (GDPR/CCPA)
          </h2>
          <p className="mb-4">
            Under GDPR (EU/UK) and CCPA (California), you have the right to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Know what cookies we use and why</li>
            <li>Opt out of non-essential cookies</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-4">
            See our <Link to="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link> for 
            full details on your data rights.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            7. Contact Us
          </h2>
          <p>
            For questions about our Cookie Policy:<br />
            <strong>Email:</strong> support@mycrochetkit.com
          </p>
        </section>
      </div>
      
    </div>
  );
}
