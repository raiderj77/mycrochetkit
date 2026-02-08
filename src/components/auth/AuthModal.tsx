import type { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  setUser: (user: User | null) => void;
}

export function AuthModal({ open, onClose, setUser }: AuthModalProps) {
  const handleSuccess = (user: User) => {
    setUser(user);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl max-h-[70vh] sm:max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2C1810]/10">
              <h2 className="text-lg font-semibold text-[#2C1810]">Sign In</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810] hover:bg-[#2C1810]/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-3 overflow-y-auto flex-1">
              <AuthForm onSuccess={handleSuccess} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
