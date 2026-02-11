import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Check, Bug, Lightbulb, Heart } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';

type FeedbackType = 'bug' | 'feature' | 'feedback';

const TYPES: { id: FeedbackType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" />, color: 'text-red-500' },
  { id: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" />, color: 'text-yellow-500' },
  { id: 'feedback', label: 'General Feedback', icon: <Heart className="w-4 h-4" />, color: 'text-pink-500' },
];

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'loading') return;

    setStatus('loading');
    const result = await submitFeedback(type, message, email || undefined);

    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setEmail('');
        setStatus('idle');
      }, 2000);
    } else {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-full shadow-lg shadow-[#E86A58]/25 flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Send Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed right-6 bottom-24 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#2C1810]/5">
                <h3 className="font-semibold text-[#2C1810]">Send Feedback</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#2C1810]/50 hover:text-[#2C1810]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {status === 'success' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#7FBFA0]/15 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#7FBFA0]" />
                  </div>
                  <h4 className="font-semibold text-[#2C1810] mb-2">Thank you!</h4>
                  <p className="text-sm text-[#2C1810]/70">Your feedback helps us make MyCrochetKit better.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  {/* Type Selection */}
                  <div className="flex gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          type === t.id
                            ? 'bg-[#E86A58] text-white'
                            : 'bg-[#2C1810]/5 text-[#2C1810]/60 hover:bg-[#2C1810]/10'
                        }`}
                      >
                        <span className={type === t.id ? 'text-white' : t.color}>{t.icon}</span>
                        <span className="hidden sm:inline">{t.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        type === 'bug'
                          ? 'Describe what went wrong...'
                          : type === 'feature'
                            ? 'What feature would help you?'
                            : 'Tell us what you think...'
                      }
                      className="w-full h-28 px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 resize-none text-sm"
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                    <p className="text-xs text-[#2C1810]/40 mt-1 text-right">{message.length}/2000</p>
                  </div>

                  {/* Email (optional) */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (optional, for follow-up)"
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 text-sm"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading' || message.length < 10}
                    className="w-full py-3 bg-[#E86A58] hover:bg-[#D35A4A] disabled:bg-[#E86A58]/50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Feedback
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
