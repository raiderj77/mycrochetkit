import type { WithContext, FAQPage } from 'schema-dts';

/**
 * MyCrochetKit FAQ Schema
 *
 * This schema enables FAQ rich results in Google Search.
 * When someone searches "how does MyCrochetKit work" or similar questions,
 * Google can display your answers directly in search results.
 *
 * CRITICAL: The FAQ content on your actual FAQ page MUST match this schema
 * exactly for Google to display rich results. Keep them in sync!
 *
 * Usage: Import and inject into FAQPage component
 */

export const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the voice-activated row counter work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "MyCrochetKit uses your device's built-in microphone and the Web Speech API to listen for simple voice commands like 'next' or 'back'. You can count rows completely hands-free while crocheting. The app provides audio feedback to confirm each count. Voice counting works offline once the app is installed - no internet connection required.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is MyCrochetKit really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! MyCrochetKit is completely free to use with no hidden fees or subscriptions. All core features including voice-activated row counting, pattern storage, project tracking, and offline functionality are available at no cost. We believe every crocheter deserves access to quality tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is MyCrochetKit different from Ravelry?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "MyCrochetKit and Ravelry serve complementary purposes. Ravelry excels at pattern discovery with its massive database and community features - it's the best place to find patterns and connect with other crafters. MyCrochetKit focuses on active project work with features like voice-activated row counting, offline functionality, and mobile-first design. Many crocheters use both: Ravelry for finding patterns, MyCrochetKit for actually working on projects.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use MyCrochetKit offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Absolutely! MyCrochetKit is a Progressive Web App (PWA) designed to work offline. Once installed, you can track projects, count rows with voice commands, and access saved patterns without any internet connection. Your data automatically syncs when you're back online. This is perfect for crafting while traveling, in yarn stores with poor signal, or anywhere without reliable WiFi.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does MyCrochetKit work on mobile devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! MyCrochetKit is mobile-first and works on iOS, Android, and any modern web browser. You can install it as a Progressive Web App directly from your browser - no app store required. The interface is optimized for one-handed use, and the voice counter eliminates the need to touch your screen with yarn-covered hands.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my Ravelry patterns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "MyCrochetKit allows you to store pattern PDFs and add pattern details manually. While we don't have direct Ravelry import yet, you can easily build your pattern library by uploading PDFs, adding pattern URLs, or manually entering pattern information. We're exploring import tools for future releases.",
      },
    },
    {
      '@type': 'Question',
      name: 'What makes the voice counter better than manual counting apps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "MyCrochetKit's voice-activated counter eliminates the need to touch your screen, which means no more stopping to tap with yarn-covered hands. It provides audio feedback so you can count without looking at your device, works completely offline, supports multiple counters for complex patterns, and automatically saves your progress. The voice system is far more convenient than physical clickers or manual tap-counting apps.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I track multiple projects at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyCrochetKit supports unlimited simultaneous projects. Each project has its own row counter (or multiple counters for complex patterns), pattern storage, yarn details, notes, and progress photos. You can easily switch between projects from your dashboard, and the app remembers exactly where you left off on each one. Perfect for managing multiple WIPs (works in progress).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data safe? What if the app shuts down?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Your data is stored locally on your device first (offline-first architecture), then synced to secure cloud storage. You can export all your data at any time - we never lock you in. If MyCrochetKit were to shut down, you'd still have access to your local data and export files. We built trust and data safety into the core of the app after seeing too many crocheters lose their work to app shutdowns.",
      },
    },
  ],
};
