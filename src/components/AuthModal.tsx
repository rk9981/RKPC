import React, { useState } from 'react';
import { StorageDB, DEMO_USER } from '../services/db';
import { User } from '../types/storage';
import { Language, translations } from '../translations';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  lang: Language;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AVATAR_OPTIONS = [
  { id: '1', label: 'Tech Lead', url: '/src/assets/images/avatar_user_profile_1792509417118.jpg' },
  { id: '2', label: 'Indigo Cloud', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PrismVault&backgroundColor=6366f1' },
  { id: '3', label: 'Rose Creative', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&backgroundColor=f43f5e' },
  { id: '4', label: 'Emerald Pro', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Rohan&backgroundColor=10b981' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  lang,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error(lang === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
        }
        if (password.length < 4) {
          throw new Error(lang === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters.');
        }

        const newUser = StorageDB.registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          avatarUrl: selectedAvatar,
        });

        onSuccess(newUser);
      } else {
        if (!email.trim()) {
          throw new Error(lang === 'hi' ? 'कृपया ईमेल दर्ज करें।' : 'Please enter your email.');
        }

        const user = StorageDB.loginUser(email.trim(), password);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setError(null);
    StorageDB.setCurrentUser(DEMO_USER);
    // ensure seed data exists
    StorageDB.getUserMedia(DEMO_USER.id);
    onSuccess(DEMO_USER);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#101426] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glow bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">
              {mode === 'login' ? t.auth.signInTitle : t.auth.registerTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {mode === 'login' ? t.auth.signInSubtitle : t.auth.registerSubtitle}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-900/90 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.nav.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.nav.register}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.auth.nameLabel}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.auth.namePlaceholder}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.auth.chooseAvatar}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`relative p-1.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                          selectedAvatar === av.url
                            ? 'border-indigo-400 bg-indigo-950/40 shadow-sm'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-slate-300 truncate w-full text-center">
                          {av.label}
                        </span>
                        {selectedAvatar === av.url && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 absolute top-1 right-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {t.auth.passwordLabel}
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? t.auth.submitLogin
                : t.auth.submitRegister}
            </button>
          </form>

          {/* Quick Demo Action Box */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">
              {t.auth.demoLoginNotice}
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.auth.quickDemoBtn}</span>
              <span className="text-[10px] text-slate-400 ml-1">(Ramesh Pandey)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
