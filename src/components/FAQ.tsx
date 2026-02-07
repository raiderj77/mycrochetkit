export const FAQ = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#2C1810]/60 text-lg">
            Everything you need to know about MyCrochetKit
          </p>
        </div>

        <div className="space-y-6">
          <details className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#2C1810]/5">
            <summary className="font-semibold text-[#2C1810] text-lg cursor-pointer">
              How does the voice-activated row counter work?
            </summary>
            <p className="mt-4 text-[#2C1810]/70">
              MyCrochetKit uses your device's microphone to listen for commands like 'next' or
              'back'. Count rows hands-free while crocheting. Works offline once installed.
            </p>
          </details>

          <details className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#2C1810]/5">
            <summary className="font-semibold text-[#2C1810] text-lg cursor-pointer">
              Is MyCrochetKit really free?
            </summary>
            <p className="mt-4 text-[#2C1810]/70">
              Yes! Currently free while in beta. All core features available during beta testing.
            </p>
          </details>

          <details className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#2C1810]/5">
            <summary className="font-semibold text-[#2C1810] text-lg cursor-pointer">
              Can I use MyCrochetKit offline?
            </summary>
            <p className="mt-4 text-[#2C1810]/70">
              Absolutely! Works offline as a PWA. Track projects and count rows without internet.
              Syncs when you're back online.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};
