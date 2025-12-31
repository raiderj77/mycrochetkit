/**
 * Billing Terms Page
 * Subscription, Trial, Refund, and Payment Policies
 */

import { Link } from 'react-router-dom';

export default function BillingTerms() {
  return (
    <div className="container mx-auto max-w-4xl p-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
        Billing Terms & Refund Policy
      </h1>
      
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        <strong>Effective Date:</strong> December 15, 2024<br />
        <strong>Last Updated:</strong> December 15, 2024
      </p>

      <div className="space-y-8 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            1. Subscription Plans
          </h2>
          <h3 className="mb-2 text-xl font-semibold">1.1 Free Tier</h3>
          <p className="mb-4">
            The Free tier is available at no cost and includes limited features. 
            No credit card is required. Free tier access is subject to our 
            <Link to="/terms" className="text-blue-600 hover:underline dark:text-blue-400"> Terms of Service</Link>.
          </p>

          <h3 className="mb-2 text-xl font-semibold">1.2 Pro Subscription</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li><strong>Monthly:</strong> $9.99/month, billed monthly</li>
            <li><strong>Yearly:</strong> $79/year, billed annually (save $40)</li>
            <li>Includes 30-day money-back guarantee</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">1.3 Lifetime Pro (Founders)</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Price:</strong> $79.99 one-time payment</li>
            <li>Limited to 500 spots (Founders offer)</li>
            <li>Includes all current and future Pro features</li>
            <li>No recurring charges ever</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            2. 30-Day Money-Back Guarantee
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Duration:</strong> 30 days from your first payment</li>
            <li><strong>Eligibility:</strong> New subscribers only</li>
            <li><strong>Policy:</strong> If you're not satisfied, we'll provide a full refund, no questions asked</li>
            <li><strong>How to claim:</strong> Email support@mycrochetkit.com within 30 days of purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            3. Payment Processing
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>All payments are processed securely by <strong>Stripe</strong></li>
            <li>We accept major credit/debit cards (Visa, Mastercard, Amex, etc.)</li>
            <li>Prices are displayed in USD</li>
            <li>Applicable taxes (VAT/GST) may be added based on your location</li>
            <li>You will receive an email receipt for every payment</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            4. Cancellation Policy
          </h2>
          <h3 className="mb-2 text-xl font-semibold">4.1 How to Cancel</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Go to Settings → Subscription → Manage Billing</li>
            <li>Or email us at support@mycrochetkit.com</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">4.2 When Cancellation Takes Effect</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Monthly:</strong> Access continues until the end of your current billing period</li>
            <li><strong>Yearly:</strong> Access continues until the end of your annual term</li>
            <li><strong>Lifetime:</strong> Cannot be cancelled (one-time purchase)</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">4.3 After Cancellation</h3>
          <p>
            Your account reverts to the Free tier. Your data is retained for 30 days, 
            after which it may be deleted. You can export your data before cancellation.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            5. Refund Policy
          </h2>
          
          <h3 className="mb-2 text-xl font-semibold">5.1 Subscription Refunds</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li><strong>Within 30 days:</strong> Full refund, no questions asked (Money-Back Guarantee)</li>
            <li><strong>After 30 days:</strong> Prorated refund at our discretion</li>
            <li><strong>Annual plans:</strong> Refunds calculated based on unused months</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">5.2 Lifetime Purchase Refunds</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li><strong>Within 30 days:</strong> Full refund, no questions asked (Money-Back Guarantee)</li>
            <li><strong>After 30 days:</strong> No refunds (it's a lifetime purchase)</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">5.3 How to Request a Refund</h3>
          <p>
            Email <strong>support@mycrochetkit.com</strong> with your account email and reason for refund.
            Refunds are processed within 5-10 business days to your original payment method.
          </p>

          <h3 className="mb-2 text-xl font-semibold mt-4">5.4 EU/UK Consumer Rights</h3>
          <p>
            If you're in the EU/UK, you have a 14-day "cooling off" period for digital services.
            However, by using the service, you acknowledge that you're waiving your right to 
            cancel once access to digital content has been provided.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            6. Price Changes
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>We may change prices with 30 days notice</li>
            <li>Existing subscriptions are not affected until renewal</li>
            <li>Lifetime purchases are never affected by price changes</li>
            <li>You will be notified by email of any price changes</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            7. Taxes
          </h2>
          <p className="mb-4">
            Depending on your location, we may be required to collect:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>VAT:</strong> European Union member states</li>
            <li><strong>GST:</strong> Australia, New Zealand, and others</li>
            <li><strong>Sales Tax:</strong> Certain US states</li>
          </ul>
          <p className="mt-4">
            Tax is calculated and displayed at checkout. We use Stripe Tax for compliance.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            8. Failed Payments
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>If payment fails, we'll attempt to charge again over 7 days</li>
            <li>You'll receive email notifications about failed payments</li>
            <li>After 3 failed attempts, your subscription may be cancelled</li>
            <li>You can update your payment method in Settings → Subscription</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            9. Referral Rewards (Lifetime Members)
          </h2>
          <p className="mb-4">
            Lifetime members may earn referral rewards when new customers purchase a Lifetime plan 
            using the member's referral link or code. A referral is counted only after the referred 
            customer completes a successful <strong>paid Lifetime purchase</strong>.
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Self-referrals, fraudulent activity, or attempts to game the program are not eligible</li>
            <li>For every three (3) qualified referrals, we may issue one (1) $10 Amazon gift card or equivalent reward</li>
            <li>Rewards are reviewed and issued manually and may take up to 14 days to process</li>
          </ul>
          <p className="text-sm italic">
            We reserve the right to modify, suspend, or terminate the referral program at any time, 
            including withholding rewards where we reasonably suspect abuse, chargebacks, or policy violations.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            10. Contact Us
          </h2>
          <p>
            For billing questions, refund requests, or payment issues:<br />
            <strong>Email:</strong> support@mycrochetkit.com<br />
            <strong>Response Time:</strong> Within 24-48 hours
          </p>
        </section>
      </div>
      
    </div>
  );
}
