import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { authService, UserProfileData } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: User, profile: UserProfileData) => void;
}

type AuthTab = 'signin' | 'signup' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setDisplayName('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const { data, error } = await authService.signIn(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (data?.user && data?.profile) {
      setSuccessMsg(`Welcome back, ${data.profile.displayName || data.profile.username}!`);
      setTimeout(() => {
        onAuthSuccess?.(data.user, data.profile);
        onClose();
        resetForm();
      }, 700);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password || !username.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const { data, error } = await authService.signUp(email, password, username, displayName);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (data?.user && data?.profile) {
      setSuccessMsg(`Account created! Logged in as ${data.profile.username}.`);
      setTimeout(() => {
        onAuthSuccess?.(data.user, data.profile);
        onClose();
        resetForm();
      }, 700);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your account email.');
      return;
    }

    setIsLoading(true);
    const { success, error } = await authService.resetPassword(email);
    setIsLoading(false);

    if (!success) {
      setErrorMsg(error || 'Failed to send password reset email.');
      return;
    }

    setSuccessMsg('Password reset instructions sent. Please check your inbox.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono select-none">
      <div 
        className="w-full max-w-md rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              {activeTab === 'signin' && 'Sign In'}
              {activeTab === 'signup' && 'Create Account'}
              {activeTab === 'reset' && 'Reset Password'}
            </h2>
          </div>

          <button
            onClick={() => { onClose(); resetForm(); }}
            className="p-1 rounded text-[#646669] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E5E5] dark:border-[#222222] text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === 'signin'
                ? 'border-[#FF5A00] text-[#FF5A00]'
                : 'border-transparent text-[#646669] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === 'signup'
                ? 'border-[#FF5A00] text-[#FF5A00]'
                : 'border-transparent text-[#646669] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="p-3 mb-4 rounded border border-[#FF3B5C]/30 bg-[#FF3B5C]/10 text-[#FF3B5C] text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-4 rounded border border-[#FF5A00]/40 bg-[#FF5A00]/10 text-[#FF5A00] text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="racer@domain.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#646669] uppercase font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('reset'); setErrorMsg(null); }}
                    className="text-[10px] text-[#646669] hover:text-[#FF5A00] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  maxLength={20}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="e.g. velocity_racer"
                />
                <span className="text-[10px] text-[#646669] block mt-0.5">Letters, numbers, underscores only</span>
              </div>

              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="racer@domain.com"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={30}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="Display name on leaderboard"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-[#646669] leading-relaxed">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>

              <div>
                <label className="text-[11px] text-[#646669] uppercase font-bold block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono focus:outline-none focus:border-[#FF5A00]"
                  placeholder="racer@domain.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="w-full text-center text-xs text-[#646669] hover:underline cursor-pointer pt-2"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
