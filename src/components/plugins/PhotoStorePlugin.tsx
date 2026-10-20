import React, { useState } from 'react';
import { MediaItem } from '../../types/storage';
import { Language, translations } from '../../translations';
import { formatBytes } from '../../services/db';
import { 
  Image as ImageIcon, 
  Search, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  Star, 
  X, 
  Sparkles, 
  SlidersHorizontal,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface PhotoStorePluginProps {
  items: MediaItem[];
  lang: Language;
  onUploadClick: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

type FilterPreset = 'none' | 'vivid' | 'warm' | 'cyber' | 'bw' | 'vintage';

const FILTER_STYLES: Record<FilterPreset, { label: string; filter: string }> = {
  none: { label: 'Original', filter: 'none' },
  vivid: { label: 'Vivid Pop', filter: 'saturate(1.4) contrast(1.1)' },
  warm: { label: 'Golden Warm', filter: 'sepia(0.2) saturate(1.2) hue-rotate(-10deg)' },
  cyber: { label: 'Cyber Glow', filter: 'contrast(1.2) hue-rotate(15deg) saturate(1.3)' },
  bw: { label: 'B & W Fine', filter: 'grayscale(1) contrast(1.2)' },
  vintage: { label: 'Retro Film', filter: 'sepia(0.35) contrast(0.95) brightness(1.05)' },
};

export const PhotoStorePlugin: React.FC<PhotoStorePluginProps> = ({
  items,
  lang,
  onUploadClick,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<MediaItem | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterPreset>('none');
  const [lightboxZoom, setLightboxZoom] = useState<number>(100);

  const t = translations[lang];

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenPhoto = (item: MediaItem) => {
    setActivePhoto(item);
    setCurrentFilter('none');
    setLightboxZoom(100);
  };

  const handleDownload = (item: MediaItem) => {
    if (!item.contentUrl) return;
    const a = document.createElement('a');
    a.href = item.contentUrl;
    a.download = item.originalName || `${item.title}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Plugin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/60 via-pink-950/40 to-slate-900 border border-rose-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/10">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.plugins.photoTitle}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Live Gallery
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t.plugins.photoDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onUploadClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo'}</span>
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="mt-6 pt-4 border-t border-rose-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.storage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white font-medium shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Photos */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">{t.storage.noItemsTitle}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{t.storage.noItemsDesc}</p>
          <button
            onClick={onUploadClick}
            className="mt-4 px-4 py-2 text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-500/30 rounded-xl hover:bg-rose-900/50 transition-colors"
          >
            {lang === 'hi' ? 'पहली फोटो जोड़ें' : 'Upload First Photo'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#111728] border border-slate-800 hover:border-rose-500/50 overflow-hidden transition-all hover:shadow-xl hover:shadow-rose-950/30 flex flex-col"
            >
              {/* Image Preview Container */}
              <div 
                className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                onClick={() => handleOpenPhoto(item)}
              >
                {item.contentUrl ? (
                  <img
                    src={item.contentUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-950/40 to-slate-900 text-rose-300">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-60" />
                    <span className="text-xs">{item.title}</span>
                  </div>
                )}

                {/* Overlay Action Bar */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                      {item.metadata?.resolution || 'HD Photo'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        item.isFavorite
                          ? 'bg-amber-500 text-white'
                          : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{t.common.preview}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Meta Description */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono-numbers">{formatBytes(item.sizeBytes)}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={t.common.download}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Lightbox / Editor Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl h-[90vh] bg-[#0c1020] border border-rose-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate">{activePhoto.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono-numbers">{formatBytes(activePhoto.sizeBytes)}</span>
                    <span>·</span>
                    <span>{activePhoto.metadata?.resolution || 'Original Resolution'}</span>
                  </div>
                </div>
              </div>

              {/* Lightbox Controls */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs text-slate-300">
                  <button
                    onClick={() => setLightboxZoom(Math.max(50, lightboxZoom - 20))}
                    className="p-1 hover:text-white rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono-numbers px-1">{lightboxZoom}%</span>
                  <button
                    onClick={() => setLightboxZoom(Math.min(250, lightboxZoom + 20))}
                    className="p-1 hover:text-white rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(activePhoto)}
                  className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.common.download}</span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo Canvas Stage */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#070913] relative select-none">
              {activePhoto.contentUrl ? (
                <img
                  src={activePhoto.contentUrl}
                  alt={activePhoto.title}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-200"
                  style={{
                    filter: FILTER_STYLES[currentFilter].filter,
                    transform: `scale(${lightboxZoom / 100})`,
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-40" />
                  <p>Photo stream rendered</p>
                </div>
              )}
            </div>

            {/* Color Filter Presets Bar */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <SlidersHorizontal className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {lang === 'hi' ? 'कलर फिल्टर इफेक्ट्स:' : 'Color Filter FX:'}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(Object.keys(FILTER_STYLES) as FilterPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCurrentFilter(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      currentFilter === preset
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {FILTER_STYLES[preset].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
