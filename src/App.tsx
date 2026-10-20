import React, { useState, useEffect } from 'react';
import { User, MediaItem, StorageStats, StoragePlugin, PluginType } from './types/storage';
import { StorageDB, formatBytes } from './services/db';
import { Language, translations } from './translations';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { StorageOverview } from './components/StorageOverview';
import { PdfStorePlugin } from './components/plugins/PdfStorePlugin';
import { PhotoStorePlugin } from './components/plugins/PhotoStorePlugin';
import { DocumentStorePlugin } from './components/plugins/DocumentStorePlugin';
import { VideoStorePlugin } from './components/plugins/VideoStorePlugin';
import { UploadModal } from './components/UploadModal';
import { PluginManagerModal } from './components/PluginManagerModal';

import { 
  Cloud, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Film, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Layers,
  Zap,
  Globe
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [plugins, setPlugins] = useState<StoragePlugin[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | PluginType>('dashboard');
  const [lang, setLang] = useState<Language>('hi'); // Default to Hindi as user requested in Hindi, easily toggled

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPluginsManagerOpen, setIsPluginsManagerOpen] = useState(false);
  const [uploadTargetPlugin, setUploadTargetPlugin] = useState<PluginType>('pdf');

  // Preview / Quick view states
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<MediaItem | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const user = StorageDB.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const items = StorageDB.getUserMedia(user.id);
      setMediaItems(items);
    }
    const pluginsConfig = StorageDB.getPluginsConfig();
    setPlugins(pluginsConfig);
  }, []);

  // When user changes
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    const items = StorageDB.getUserMedia(user.id);
    setMediaItems(items);
    setIsAuthOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    StorageDB.setCurrentUser(null);
    setCurrentUser(null);
    setMediaItems([]);
    setActiveTab('dashboard');
  };

  const handleToggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  // Add Item
  const handleAddItem = (newItemData: Omit<MediaItem, 'id' | 'userId' | 'dateAdded'>) => {
    if (!currentUser) return;
    const created = StorageDB.addMediaItem(currentUser.id, newItemData);
    setMediaItems(prev => [created, ...prev]);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (!currentUser) return;
    StorageDB.deleteMediaItem(currentUser.id, id);
    setMediaItems(prev => prev.filter(i => i.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    if (!currentUser) return;
    const updated = StorageDB.toggleFavorite(currentUser.id, id);
    if (updated) {
      setMediaItems(prev => prev.map(i => (i.id === id ? updated : i)));
    }
  };

  // Update Document
  const handleUpdateDoc = (item: MediaItem) => {
    if (!currentUser) return;
    StorageDB.updateMediaItem(currentUser.id, item);
    setMediaItems(prev => prev.map(i => (i.id === item.id ? item : i)));
  };

  // Create New Doc
  const handleCreateNewDoc = (title: string, textContent: string, category: string) => {
    if (!currentUser) return;
    const words = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const created = StorageDB.addMediaItem(currentUser.id, {
      pluginType: 'document',
      title,
      originalName: title,
      sizeBytes: new Blob([textContent]).size || 1024,
      mimeType: 'text/markdown',
      tags: ['Document', 'Notes'],
      category: category || 'Work Notes',
      isFavorite: false,
      textContent,
      metadata: {
        wordCount: words,
        author: currentUser.name,
      }
    });
    setMediaItems(prev => [created, ...prev]);
  };

  // Toggle plugin on/off
  const handleTogglePlugin = (pluginId: string) => {
    const updated = plugins.map(p => p.id === pluginId ? { ...p, isEnabled: !p.isEnabled } : p);
    setPlugins(updated);
    StorageDB.savePluginsConfig(updated);
  };

  // Storage Stats
  const stats: StorageStats = currentUser
    ? StorageDB.calculateStats(currentUser.storageQuotaMB, mediaItems)
    : {
        totalAllocatedMB: 51200,
        totalUsedBytes: 0,
        byPlugin: {
          pdf: { count: 0, usedBytes: 0 },
          photo: { count: 0, usedBytes: 0 },
          document: { count: 0, usedBytes: 0 },
          video: { count: 0, usedBytes: 0 },
        }
      };

  const t = translations[lang];

  // Filter items by plugin
  const pdfItems = mediaItems.filter(i => i.pluginType === 'pdf');
  const photoItems = mediaItems.filter(i => i.pluginType === 'photo');
  const docItems = mediaItems.filter(i => i.pluginType === 'document');
  const videoItems = mediaItems.filter(i => i.pluginType === 'video');

  const handleDownloadDirect = (item: MediaItem) => {
    if (item.contentUrl) {
      const a = document.createElement('a');
      a.href = item.contentUrl;
      a.download = item.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob([item.textContent || ''], { type: item.mimeType || 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-[#090c17] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onOpenUpload={() => {
          setUploadTargetPlugin(activeTab !== 'dashboard' ? activeTab : 'pdf');
          setIsUploadOpen(true);
        }}
        onOpenPluginsManager={() => setIsPluginsManagerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser ? (
          /* ================= Authenticated Website Vault ================= */
          <div className="animate-fadeIn">
            {activeTab === 'dashboard' && (
              <StorageOverview
                currentUser={currentUser}
                stats={stats}
                recentItems={mediaItems}
                lang={lang}
                onSelectPlugin={(plugin) => setActiveTab(plugin)}
                onOpenUpload={() => {
                  setUploadTargetPlugin('pdf');
                  setIsUploadOpen(true);
                }}
                onOpenCreateDoc={() => {
                  setActiveTab('document');
                }}
                onPreviewItem={(item) => {
                  setActiveTab(item.pluginType);
                }}
                onDownloadItem={handleDownloadDirect}
              />
            )}

            {activeTab === 'pdf' && (
              <PdfStorePlugin
                items={pdfItems}
                lang={lang}
                onUploadClick={() => {
                  setUploadTargetPlugin('pdf');
                  setIsUploadOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'photo' && (
              <PhotoStorePlugin
                items={photoItems}
                lang={lang}
                onUploadClick={() => {
                  setUploadTargetPlugin('photo');
                  setIsUploadOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'document' && (
              <DocumentStorePlugin
                items={docItems}
                lang={lang}
                onUploadClick={() => {
                  setUploadTargetPlugin('document');
                  setIsUploadOpen(true);
                }}
                onCreateNewDoc={handleCreateNewDoc}
                onUpdateDoc={handleUpdateDoc}
                onDeleteItem={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'video' && (
              <VideoStorePlugin
                items={videoItems}
                lang={lang}
                onUploadClick={() => {
                  setUploadTargetPlugin('video');
                  setIsUploadOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        ) : (
          /* ================= Unauthenticated Landing & Registration Gateway ================= */
          <div className="space-y-12 py-4 sm:py-8">
            {/* Colorful Hero Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-rose-500/10 to-amber-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {lang === 'hi' 
                      ? 'रजिस्टर करें और तुरंत अपना पर्सनल क्लाउड वॉल्ट खोलें' 
                      : 'Register & open your private cloud sanctuary instantly'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
                  {lang === 'hi' ? (
                    <>
                      कलरफुल क्लाउड स्टोरेज <br />
                      <span className="bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                        4 पावरफुल मीडिया प्लगइन्स के साथ
                      </span>
                    </>
                  ) : (
                    <>
                      Colorful Cloud Storage <br />
                      <span className="bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                        With 4 Modular Media Plugins
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {lang === 'hi'
                    ? 'पीडीएफ (PDF Store), हाई-रेसोल्यूशन फोटो (Photo Store), नोट्स और वर्ड फाइल्स (Document Store), तथा एचडी वीडियो (Video Store) के लिए अलग-अलग विशेष प्लगइन।'
                    : 'A complete personal file vault with dedicated plugins for PDFs, photo galleries, rich editable documents, and cinematic video playback.'}
                </p>

                {/* Primary Registration / Instant Login CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{t.hero.getStarted}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <span>{t.hero.exploreDemo}</span>
                  </button>
                </div>

                {/* Bullet Proof Trust Markers */}
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'hi' ? 'मुफ्त 50 GB स्टोरेज' : 'Free 50 GB Vault'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>{lang === 'hi' ? 'क्लाइंट-साइड एन्क्रिप्शन' : 'Encrypted Storage'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'hi' ? 'तुरंत व्यूअर और एडिटर' : 'Live In-App Editors'}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Hero Visual Frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-black p-2">
                  <img
                    src="/src/assets/images/hero_cloud_vault_1792509416127.jpg"
                    alt="PrismVault Hologram Architecture"
                    className="w-full rounded-2xl object-cover shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Micro Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">4 Active Storage Plugins</p>
                        <p className="text-[10px] text-slate-400">PDF · Photos · Documents · Video</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthOpen(true);
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      {lang === 'hi' ? 'लॉग इन' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Storage Plugins Showcase Feature Cards */}
            <div>
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl font-bold font-display text-white">
                  {lang === 'hi' ? 'वेबसाइट के 4 मुख्य स्टोरेज प्लगइन्स' : '4 Built-in Storage Plugins'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'hi'
                    ? 'प्रत्येक प्रकार के मीडिया के लिए समर्पित इंटरफेस और इन-ऐप टूल्स'
                    : 'Tailored interfaces with built-in readers, viewers, and media players'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Plugin 1 */}
                <div className="rounded-2xl bg-[#111728] border border-emerald-500/30 p-6 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-950/30">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Plugin 01</span>
                    <h3 className="text-lg font-bold text-white mt-1 font-display">{t.plugins.pdfTitle}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.plugins.pdfDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-emerald-300 font-medium">
                    ✓ {lang === 'hi' ? 'लाइव पीडीएफ रीडर & ज़ूम' : 'Built-in Zoom & Page Reader'}
                  </div>
                </div>

                {/* Plugin 2 */}
                <div className="rounded-2xl bg-[#111728] border border-rose-500/30 p-6 flex flex-col justify-between hover:border-rose-400 transition-all shadow-lg hover:shadow-rose-950/30">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 tracking-wider uppercase">Plugin 02</span>
                    <h3 className="text-lg font-bold text-white mt-1 font-display">{t.plugins.photoTitle}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.plugins.photoDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-rose-300 font-medium">
                    ✓ {lang === 'hi' ? 'लाइटबॉक्स & 6 कलर फिल्टर' : 'Lightbox & 6 Color Filter FX'}
                  </div>
                </div>

                {/* Plugin 3 */}
                <div className="rounded-2xl bg-[#111728] border border-violet-500/30 p-6 flex flex-col justify-between hover:border-violet-400 transition-all shadow-lg hover:shadow-violet-950/30">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase">Plugin 03</span>
                    <h3 className="text-lg font-bold text-white mt-1 font-display">{t.plugins.docTitle}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.plugins.docDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-violet-300 font-medium">
                    ✓ {lang === 'hi' ? 'लाइव इन-ऐप नोट एडिटर' : 'In-App Live Markdown Editor'}
                  </div>
                </div>

                {/* Plugin 4 */}
                <div className="rounded-2xl bg-[#111728] border border-amber-500/30 p-6 flex flex-col justify-between hover:border-amber-400 transition-all shadow-lg hover:shadow-amber-950/30">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">Plugin 04</span>
                    <h3 className="text-lg font-bold text-white mt-1 font-display">{t.plugins.videoTitle}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.plugins.videoDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
                    ✓ {lang === 'hi' ? 'स्पीड कंट्रोल 0.5x - 2x' : 'Speed Scrubbing 0.5x - 2x'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Registration Gateway Card */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-rose-900/40 border border-indigo-500/30 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {lang === 'hi' ? 'अभी रजिस्टर करें और अपना वॉल्ट खोलें' : 'Register Now & Unlock Your Vault'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                {lang === 'hi'
                  ? 'केवल अपना नाम और ईमेल डालें, और सभी 4 प्लगइन्स का तुरंत उपयोग शुरू करें।'
                  : 'Enter your credentials or test with 1-click instant demo account.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  {t.nav.register}
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  {t.nav.login}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070912] py-6 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-display">PrismVault</span>
            <span>·</span>
            <span>PDF · Photo · Document · Video Storage</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{lang === 'hi' ? 'सुरक्षित पर्सनल क्लाउड' : 'Secure Personal Storage'}</span>
            <span>·</span>
            <span>50 GB Cloud Quota</span>
          </div>
        </div>
      </footer>

      {/* Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        lang={lang}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Multi-Format Smart Upload Modal */}
      {currentUser && (
        <UploadModal
          isOpen={isUploadOpen}
          currentUserId={currentUser.id}
          defaultPlugin={uploadTargetPlugin}
          lang={lang}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleAddItem}
        />
      )}

      {/* Plugin Configuration Manager */}
      <PluginManagerModal
        isOpen={isPluginsManagerOpen}
        plugins={plugins}
        stats={stats}
        lang={lang}
        onClose={() => setIsPluginsManagerOpen(false)}
        onTogglePlugin={handleTogglePlugin}
      />
    </div>
  );
}
