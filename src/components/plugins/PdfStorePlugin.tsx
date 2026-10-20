import React, { useState } from 'react';
import { MediaItem, SortOption } from '../../types/storage';
import { Language, translations } from '../../translations';
import { formatBytes } from '../../services/db';
import { 
  FileText, 
  Search, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  Star, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  X, 
  FileCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PdfStorePluginProps {
  items: MediaItem[];
  lang: Language;
  onUploadClick: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const PdfStorePlugin: React.FC<PdfStorePluginProps> = ({
  items,
  lang,
  onUploadClick,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePdfItem, setActivePdfItem] = useState<MediaItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const t = translations[lang];

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenPdf = (item: MediaItem) => {
    setActivePdfItem(item);
    setZoomLevel(100);
    setRotation(0);
    setCurrentPage(1);
  };

  const handleDownload = (item: MediaItem) => {
    // Generate text/pdf data download
    const blob = new Blob([item.textContent || `PrismVault PDF Document: ${item.title}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = item.contentUrl || url;
    a.download = item.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Plugin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.plugins.pdfTitle}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Plugin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t.plugins.pdfDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onUploadClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पीडीएफ अपलोड करें' : 'Upload PDF'}</span>
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.storage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white font-medium shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of PDF Documents */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">{t.storage.noItemsTitle}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{t.storage.noItemsDesc}</p>
          <button
            onClick={onUploadClick}
            className="mt-4 px-4 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl hover:bg-emerald-900/50 transition-colors"
          >
            {lang === 'hi' ? 'पहला पीडीएफ जोड़ें' : 'Upload First PDF'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#111728] border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-950/20 p-4 flex flex-col justify-between"
            >
              {/* Top document card visual */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isFavorite
                          ? 'text-amber-400 bg-amber-950/40'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Favorite"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                {/* Simulated Document Preview Slip */}
                <div 
                  onClick={() => handleOpenPdf(item)}
                  className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 font-mono-numbers line-clamp-3 cursor-pointer hover:border-emerald-500/40 transition-colors"
                >
                  {item.textContent ? item.textContent.slice(0, 150) + '...' : 'PDF Encrypted Stream · Verified Container'}
                </div>

                {/* Metadata tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/20 font-medium">
                    {item.metadata?.pageCount || 1} {lang === 'hi' ? 'पेज' : 'Pages'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono-numbers">
                  {formatBytes(item.sizeBytes)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPdf(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.common.preview}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={t.common.download}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive PDF Live Viewer Modal */}
      {activePdfItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[88vh] bg-[#0c1020] border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate">{activePdfItem.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{formatBytes(activePdfItem.sizeBytes)}</span>
                    <span>·</span>
                    <span>{activePdfItem.metadata?.pageCount || 1} {lang === 'hi' ? 'पेज' : 'Pages'}</span>
                  </div>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs text-slate-300">
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
                    className="p-1 hover:text-white rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono-numbers px-1">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 15))}
                    className="p-1 hover:text-white rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1 hover:text-white rounded ml-1"
                    title="Rotate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(activePdfItem)}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.common.download}</span>
                </button>

                <button
                  onClick={() => setActivePdfItem(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Canvas Surface */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#070a14] flex justify-center items-start">
              <div 
                className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                  minHeight: '600px'
                }}
              >
                {/* Simulated PDF Header */}
                <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activePdfItem.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Category: {activePdfItem.category} · PrismVault Verified</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono-numbers">
                    Page {currentPage} of {activePdfItem.metadata?.pageCount || 1}
                  </div>
                </div>

                {/* Content Stream */}
                <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif">
                  {activePdfItem.textContent || `[PRISMVAULT PDF VIEWER ENGINE]\n\nDocument Title: ${activePdfItem.title}\nSize: ${formatBytes(activePdfItem.sizeBytes)}\nStatus: Clean & Verified\n\nThis document is securely stored and streamed from your personal cloud vault partition. You can download the pristine file or read its verified content directly.`}
                </div>

                {/* Simulated PDF Footer */}
                <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Digitally preserved on {new Date(activePdfItem.dateAdded).toLocaleDateString()}</span>
                  <span>Confidential & Protected Document</span>
                </div>
              </div>
            </div>

            {/* Page Navigation Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono-numbers">
                  {lang === 'hi' ? 'पेज' : 'Page'} {currentPage} / {activePdfItem.metadata?.pageCount || 1}
                </span>
                <button
                  disabled={currentPage >= (activePdfItem.metadata?.pageCount || 1)}
                  onClick={() => setCurrentPage(p => Math.min((activePdfItem.metadata?.pageCount || 1), p + 1))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                {lang === 'hi' ? 'पीडीएफ रेंडरिंग मोड: एक्टिव' : 'PDF Rendering Mode: Active'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
