/**
 * Terms of Service Page
 * Liability shield for zero-commission marketplace
 */


export default function Terms() {
  return (
    <div className="container mx-auto max-w-4xl p-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
        Terms of Service
      </h1>
      
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        <strong>Effective Date:</strong> December 5, 2024<br />
        <strong>Last Updated:</strong> December 5, 2024
      </p>

      <div className="space-y-8 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using My Crochet Kit ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            2. Service Description
          </h2>
          <p className="mb-4">My Crochet Kit provides:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Project tracking tools (counters, timers, notes)</li>
            <li>Pattern library management</li>
            <li>Pricing calculator</li>
            <li>Community feed and social features</li>
            <li>Zero-commission marketplace (Lifetime tier only)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            3. Account Responsibilities
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>You must be 13 years or older to create an account</li>
            <li>You are responsible for maintaining the security of your password</li>
            <li>You are responsible for all activity under your account</li>
            <li>You must provide accurate and truthful information</li>
            <li>One account per person; no automated account creation</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            4. Subscription & Pricing
          </h2>
          <h3 className="mb-2 text-xl font-semibold">4.1 Free Tier</h3>
          <p className="mb-4">
            The Free tier is ad-supported and limited to 3 projects and 3 patterns with local storage only.
            We reserve the right to display advertisements.
          </p>

          <h3 className="mb-2 text-xl font-semibold">4.2 Paid Tiers (Pro & Lifetime)</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Subscriptions are billed monthly or annually</li>
            <li>First month is free; you will be charged at the end of the trial period</li>
            <li>You can cancel anytime; no refunds for partial months</li>
            <li>Price changes will be communicated 30 days in advance</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">4.3 Downgrade Policy</h3>
          <p>
            If you downgrade from Pro/Lifetime to Free, projects/patterns exceeding the Free tier
            limit will be archived (read-only) but not deleted.
          </p>
        </section>

        <section className="rounded-lg border-2 border-red-500 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-4 text-2xl font-bold text-red-900 dark:text-red-50">
            5. ⚠️ MARKETPLACE TERMS (Critical - Read Carefully)
          </h2>
          
          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.1 We Are a Venue Only
          </h3>
          <p className="mb-4 font-bold">
            My Crochet Kit is NOT a party to any transaction between buyers and sellers.
            We provide a platform for sellers to list items. All transactions occur directly
            between buyers and sellers.
          </p>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.2 Zero Commission Model
          </h3>
          <p className="mb-4">
            We charge $0 in transaction fees (unlike Etsy's 6.5%). However, this means:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>We do NOT process payments (sellers provide their own PayPal/Venmo links)</li>
            <li>We do NOT handle shipping, refunds, or customer service</li>
            <li>We do NOT verify product quality, authenticity, or legality</li>
            <li>We are NOT liable for fraud, non-delivery, or disputes</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.3 Seller Responsibilities
          </h3>
          <p>As a seller, you agree to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Accurately describe your items</li>
            <li>Honor all sales (no bait-and-switch)</li>
            <li>Ship items within the stated timeframe</li>
            <li>Comply with all local, state, and federal laws</li>
            <li>Pay all applicable taxes (sales tax, income tax, etc.)</li>
            <li>Not sell prohibited items (see Section 5.5)</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.4 Buyer Responsibilities
          </h3>
          <p>As a buyer, you agree to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Pay sellers directly via their provided payment link</li>
            <li>Resolve disputes directly with the seller</li>
            <li>Understand that all sales are final (seller discretion)</li>
            <li>Report fraudulent listings to us</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.5 Prohibited Items
          </h3>
          <p className="mb-2">You may NOT sell:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Counterfeit or copyright-infringing items</li>
            <li>Illegal goods (drugs, weapons, etc.)</li>
            <li>Sexually explicit content</li>
            <li>Items that violate intellectual property rights</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.6 Dispute Resolution
          </h3>
          <p className="mb-4">
            <strong>We do not mediate disputes.</strong> If a transaction goes wrong:
          </p>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>Contact the seller directly</li>
            <li>If paid via PayPal, file a dispute through PayPal</li>
            <li>If fraud occurred, report to local authorities</li>
            <li>You may report the seller to us for account suspension</li>
          </ol>

          <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-50">
            5.7 Limitation of Liability
          </h3>
          <p className="font-bold">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MY CROCHET KIT SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM
            MARKETPLACE TRANSACTIONS, INCLUDING BUT NOT LIMITED TO: LOST PROFITS, NON-DELIVERY,
            FRAUD, PRODUCT DEFECTS, OR PERSONAL INJURY.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            6. User-Generated Content
          </h2>
          <h3 className="mb-2 text-xl font-semibold">6.1 Your License to Us</h3>
          <p className="mb-4">
            By posting content (projects, photos, comments), you grant us a non-exclusive,
            worldwide, royalty-free license to display and distribute that content on our platform.
            You retain ownership of your content.
          </p>

          <h3 className="mb-2 text-xl font-semibold">6.2 Content Moderation</h3>
          <p className="mb-4">We reserve the right to remove content that:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Violates these Terms</li>
            <li>Is offensive, harassing, or spam</li>
            <li>Infringes on intellectual property rights</li>
            <li>Is reported by multiple users</li>
          </ul>

          <h3 className="mb-2 text-xl font-semibold">6.3 Copyright (DMCA)</h3>
          <p className="mb-4">
            If you believe your copyright is infringed, email us at <strong>support@mycrochetkit.com</strong>
            with:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Your contact information</li>
            <li>Link to the infringing content</li>
            <li>Proof of ownership (link to original work)</li>
            <li>Statement that you believe the use is unauthorized</li>
          </ul>
          <p className="mt-4">We will remove content within 48 hours of valid requests.</p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            7. Prohibited Conduct
          </h2>
          <p className="mb-4">You may NOT:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Harass, abuse, or threaten other users</li>
            <li>Spam or post unsolicited advertising</li>
            <li>Impersonate others or create fake accounts</li>
            <li>Use bots or automated tools (except our official API)</li>
            <li>Attempt to hack, scrape, or reverse-engineer the Service</li>
            <li>Violate any laws or regulations</li>
          </ul>
          <p className="mt-4">
            <strong>Penalty:</strong> Account suspension or permanent ban.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            8. Termination
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>You can delete your account anytime from Settings</li>
            <li>We can suspend/terminate accounts that violate these Terms</li>
            <li>Upon termination, your data will be deleted within 30 days</li>
            <li>No refunds for partial subscription periods</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            9. Disclaimers
          </h2>
          <p className="mb-4 font-bold">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
            WE DO NOT GUARANTEE UPTIME, DATA ACCURACY, OR LOSS PREVENTION.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            10. Limitation of Liability
          </h2>
          <p className="font-bold">
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE LAST 12 MONTHS.
            WE ARE NOT LIABLE FOR INDIRECT DAMAGES (LOST DATA, LOST PROFITS, ETC.).
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            11. Changes to Terms
          </h2>
          <p>
            We may update these Terms. We will notify you 30 days before significant changes.
            Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            12. Governing Law & Disputes
          </h2>
          <p>
            These Terms are governed by the laws of the State of California, USA.
            Any disputes shall be resolved through binding arbitration (not class action lawsuits).
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            13. Contact
          </h2>
          <p className="mb-4">
            For questions about these Terms:<br />
            <strong>Email:</strong> support@mycrochetkit.com
          </p>
        </section>

        <section className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
          <h2 className="mb-4 text-2xl font-bold text-primary-900 dark:text-primary-50">
            14. Referral Rewards Program
          </h2>
          <p className="mb-4">
            Lifetime users are eligible to participate in our Referral Rewards Program.
          </p>
          <ul className="list-disc space-y-2 pl-6 mb-4">
            <li><strong>Reward:</strong> For every three (3) new users you refer who purchase a Lifetime plan, you earn a $10 Amazon Gift Card.</li>
            <li><strong>Verification Period:</strong> All rewards are subject to a 30-day verification period to prevent fraud and account for potential refunds/chargebacks.</li>
            <li><strong>Lifetime Cap:</strong> Rewards are capped at a total of $100 per user.</li>
            <li><strong>Fraud Prevention:</strong> We reserve the right to void rewards if we suspect fraudulent activity, self-referrals, or violations of these Terms.</li>
            <li><strong>Changes:</strong> We reserve the right to modify or terminate the referral program at any time with 30 days notice.</li>
          </ul>
        </section>
      </div>
      
    </div>
  );
}
