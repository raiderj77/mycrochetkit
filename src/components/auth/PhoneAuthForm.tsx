import { useState, useEffect, useRef, useId } from 'react';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import type { User, ConfirmationResult } from 'firebase/auth';
import { auth } from '../../firebase';
import { Phone, Loader2 } from 'lucide-react';

interface PhoneAuthFormProps {
  onSuccess: (user: User) => void;
}

const COUNTRY_CODES = [
  { code: '+1', label: 'US +1' },
  { code: '+1', label: 'CA +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+61', label: 'AU +61' },
  { code: '+91', label: 'IN +91' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+81', label: 'JP +81' },
  { code: '+52', label: 'MX +52' },
  { code: '+55', label: 'BR +55' },
];

function mapError(code: string): string {
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/invalid-verification-code':
      return 'Invalid code. Please try again.';
    case 'auth/code-expired':
      return 'Code expired. Please request a new one.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function PhoneAuthForm({ onSuccess }: PhoneAuthFormProps) {
  const instanceId = useId();
  const containerId = `recaptcha-${instanceId.replace(/:/g, '')}`;

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      // Create fresh reCAPTCHA verifier
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
      });

      const fullNumber = `${countryCode}${digits}`;
      const result = await signInWithPhoneNumber(auth, fullNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setStep('code');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setError(null);

    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      onSuccess(result.user);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('phone');
    setVerificationCode('');
    setConfirmationResult(null);
    setError(null);
  };

  if (step === 'code') {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-3">
        <p className="text-sm text-[#2C1810]/70 text-center">
          Enter the 6-digit code sent to{' '}
          <span className="font-medium text-[#2C1810]">{countryCode}{phoneNumber}</span>
        </p>

        {error && (
          <div className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          autoFocus
          className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-center text-lg tracking-[0.3em] font-mono placeholder:text-[#2C1810]/20 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
        />

        <button
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
        </button>

        <p className="text-center text-sm text-[#2C1810]/60">
          <button
            type="button"
            onClick={handleReset}
            className="text-[#E86A58] font-medium hover:underline"
          >
            Use a different number
          </button>
        </p>

        <div id={containerId} />
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="space-y-3">
      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-24 px-2 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
        >
          {COUNTRY_CODES.map((cc) => (
            <option key={cc.label} value={cc.code}>
              {cc.label}
            </option>
          ))}
        </select>

        <div className="relative flex-1">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1810]/30" />
          <input
            type="tel"
            inputMode="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            required
            className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Code'}
      </button>

      <div id={containerId} />
    </form>
  );
}
