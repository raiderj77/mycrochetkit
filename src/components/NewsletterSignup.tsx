import { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Save to Firestore 'newsletter' collection
      await addDoc(collection(db, 'newsletter'), {
        email: email.toLowerCase().trim(),
        subscribedAt: serverTimestamp(),
        source: 'blog_page',
        confirmed: false, // Can add email verification later
      });

      setStatus('success');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 text-green-800">
          <div className="bg-green-600 rounded-full p-2">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">You're subscribed! 🎉</h3>
            <p className="text-sm">Check your inbox for crochet tips, tutorials, and exclusive offers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 rounded-full p-3">
          <Mail className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">Get Crochet Tips Weekly</h3>
          <p className="opacity-90 mb-4">
            Join 1,000+ crocheters getting exclusive patterns, pricing tips, and tutorials.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                status === 'loading'
                  ? 'bg-white/50 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              }`}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </form>

          {status === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <p className="text-xs opacity-75 mt-3">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
