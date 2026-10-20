import React, { useState } from 'react';
import { User, PluginType } from '../types/storage';
import { Language, translations } from '../translations';
import { 
  Cloud, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Film, 
  LayoutDashboard, 
  Sliders, 
  LogOut, 
  User as UserIcon, 
  Globe, 
  Upload,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'dashboard' | PluginType;
  onSelectTab: (tab: 'dashboard' | PluginType) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenUpload: () => void;
  onOpenPluginsManager: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  lang,
  onToggleLang,
  onOpenAuth,
  onOpenUpload,
  onOpenPluginsManager,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0f1d]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0c0f1d] rounded-[10px] flex items-center justify-center">
              <Cloud className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-rose-300 bg-clip-text text-transparent font-display font-extrabold text-xl">
              PrismVault
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line navigation links/tabs */}
        {currentUser ? (
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>{t.nav.dashboard}</span>
            </button>

            <button
              onClick={() => onSelectTab('pdf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'pdf'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/20'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{t.nav.pdfVault}</span>
            </button>

            <button
              onClick={() => onSelectTab('photo')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'photo'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/20'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-rose-400" />
              <span>{t.nav.photoVault}</span>
            </button>

            <button
              onClick={() => onSelectTab('document')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'document'
                  ? 'bg-violet-950/60 text-violet-300 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-violet-400 hover:bg-violet-950/20'
              }`}
            >
              <FileCode className="w-4 h-4 text-violet-400" />
              <span>{t.nav.docVault}</span>
            </button>

            <button
              onClick={() => onSelectTab('video')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'video'
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-amber-950/20'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>{t.nav.videoVault}</span>
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <span className="whitespace-nowrap shrink-0 text-slate-300">
              {lang === 'hi' ? 'सुरक्षित क्लाउड स्टोरेज & 4 मीडिया प्लगइन्स' : 'Secure Cloud Storage & 4 Modular Plugins'}
            </span>
          </div>
        )}

        {/* Zone 3: 1 primary action / Profile Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Toggle English / हिंदी"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'en' ? 'EN' : 'हिंदी'}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Quick Upload Action */}
              <button
                onClick={onOpenUpload}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-600 hover:from-indigo-500 hover:to-rose-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t.storage.uploadNew}</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition-colors focus:outline-none"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-400/50"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#11162a] border border-slate-700/80 shadow-2xl py-2 z-50 text-xs">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="font-semibold text-white text-sm truncate">{currentUser.name}</p>
                        <p className="text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{currentUser.role.toUpperCase()} Plan (50 GB)</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenPluginsManager();
                          }}
                          className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                        >
                          <Sliders className="w-4 h-4 text-indigo-400" />
                          <span>{t.plugins.managePlugins}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenUpload();
                          }}
                          className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors sm:hidden"
                        >
                          <Upload className="w-4 h-4 text-rose-400" />
                          <span>{t.storage.uploadNew}</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-800 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t.nav.logout}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                {t.nav.register}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for logged-in users */}
      {currentUser && (
        <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800 bg-[#090c17]/95 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.nav.dashboard}</span>
          </button>
          <button
            onClick={() => onSelectTab('pdf')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pdf' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => onSelectTab('photo')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'photo' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'hi' ? 'फोटो' : 'Photo'}</span>
          </button>
          <button
            onClick={() => onSelectTab('document')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'document' ? 'bg-violet-950 text-violet-300 font-medium' : 'text-slate-400'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-violet-400" />
            <span>{lang === 'hi' ? 'दस्तावेज' : 'Doc'}</span>
          </button>
          <button
            onClick={() => onSelectTab('video')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'video' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'वीडियो' : 'Video'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
