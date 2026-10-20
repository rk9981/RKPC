import React from 'react';
import { User, MediaItem, StorageStats, PluginType } from '../types/storage';
import { Language, translations } from '../translations';
import { formatBytes } from '../services/db';
import { 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Film, 
  Upload, 
  Plus, 
  ArrowUpRight, 
  Database, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Clock,
  Eye,
  Download
} from 'lucide-react';

interface StorageOverviewProps {
  currentUser: User;
  stats: StorageStats;
  recentItems: MediaItem[];
  lang: Language;
  onSelectPlugin: (plugin: PluginType) => void;
  onOpenUpload: () => void;
  onOpenCreateDoc: () => void;
  onPreviewItem: (item: MediaItem) => void;
  onDownloadItem: (item: MediaItem) => void;
}

export const StorageOverview: React.FC<StorageOverviewProps> = ({
  currentUser,
  stats,
  recentItems,
  lang,
  onSelectPlugin,
  onOpenUpload,
  onOpenCreateDoc,
  onPreviewItem,
  onDownloadItem,
}) => {
  const t = translations[lang];

  // Storage calculation
  const totalAllocatedBytes = currentUser.storageQuotaMB * 1024 * 1024;
  const usedPercentage = Math.min(100, Math.max(1, (stats.totalUsedBytes / totalAllocatedBytes) * 100));

  const pdfPercent = totalAllocatedBytes ? (stats.byPlugin.pdf.usedBytes / totalAllocatedBytes) * 100 : 0;
  const photoPercent = totalAllocatedBytes ? (stats.byPlugin.photo.usedBytes / totalAllocatedBytes) * 100 : 0;
  const docPercent = totalAllocatedBytes ? (stats.byPlugin.document.usedBytes / totalAllocatedBytes) * 100 : 0;
  const videoPercent = totalAllocatedBytes ? (stats.byPlugin.video.usedBytes / totalAllocatedBytes) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Strip with Isometric Cloud Vault Visual */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141a38] via-[#10142b] to-[#0c0f1e] border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 lg:opacity-40 pointer-events-none overflow-hidden">
          <img
            src="/src/assets/images/hero_cloud_vault_1792509416127.jpg"
            alt="Cloud Vault Hologram"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hi' ? 'नमस्ते,' : 'Welcome back,'} {currentUser.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
            {lang === 'hi'
              ? 'आपका ऑल-इन-वन कलरफुल मीडिया स्टोरेज वॉल्ट'
              : 'Your Colorful Personal Media & Storage Vault'}
          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
            {lang === 'hi'
              ? 'पीडीएफ, फोटो, दस्तावेज और वीडियो के लिए 4 आधुनिक प्लगइन्स। सभी फाइल्स बिना किसी रुकावट के तुरंत स्टोर, व्यू और शेयर करें।'
              : '4 specialized modular plugins for PDFs, high-res photos, rich documents, and 4K videos. Stream, edit, and preserve without limits.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span>{t.storage.uploadNew}</span>
            </button>

            <button
              onClick={onOpenCreateDoc}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-violet-400" />
              <span>{t.storage.createDoc}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Capacity Gauge Card */}
      <div className="rounded-2xl bg-[#11162b] border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white font-display">
                {t.storage.totalSpace}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi' ? '4 प्लगइन्स द्वारा उपयोग किए गए स्टोरेज का सटीक विवरण' : 'Live storage allocation across your 4 active plugins'}
            </p>
          </div>

          <div className="flex items-baseline gap-2 text-right">
            <span className="text-2xl font-extrabold text-white font-mono-numbers">
              {formatBytes(stats.totalUsedBytes)}
            </span>
            <span className="text-xs text-slate-400">
              / {formatBytes(totalAllocatedBytes)} ({usedPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Multi-color segment progress bar */}
        <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          <div
            style={{ width: `${Math.max(pdfPercent > 0 ? 3 : 0, pdfPercent)}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
            title={`PDF: ${formatBytes(stats.byPlugin.pdf.usedBytes)}`}
          />
          <div
            style={{ width: `${Math.max(photoPercent > 0 ? 3 : 0, photoPercent)}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Photos: ${formatBytes(stats.byPlugin.photo.usedBytes)}`}
          />
          <div
            style={{ width: `${Math.max(docPercent > 0 ? 3 : 0, docPercent)}%` }}
            className="h-full bg-violet-500 transition-all duration-500"
            title={`Docs: ${formatBytes(stats.byPlugin.document.usedBytes)}`}
          />
          <div
            style={{ width: `${Math.max(videoPercent > 0 ? 3 : 0, videoPercent)}%` }}
            className="h-full bg-amber-500 rounded-r-full transition-all duration-500"
            title={`Videos: ${formatBytes(stats.byPlugin.video.usedBytes)}`}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <button
            onClick={() => onSelectPlugin('pdf')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-emerald-950/30 border border-slate-800/80 hover:border-emerald-500/30 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-300 font-medium">PDF</span>
            </div>
            <span className="text-slate-400 font-mono-numbers text-[11px]">
              {stats.byPlugin.pdf.count} ({formatBytes(stats.byPlugin.pdf.usedBytes)})
            </span>
          </button>

          <button
            onClick={() => onSelectPlugin('photo')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800/80 hover:border-rose-500/30 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <span className="text-slate-300 font-medium">{lang === 'hi' ? 'फोटो' : 'Photos'}</span>
            </div>
            <span className="text-slate-400 font-mono-numbers text-[11px]">
              {stats.byPlugin.photo.count} ({formatBytes(stats.byPlugin.photo.usedBytes)})
            </span>
          </button>

          <button
            onClick={() => onSelectPlugin('document')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-violet-950/30 border border-slate-800/80 hover:border-violet-500/30 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0"></span>
              <span className="text-slate-300 font-medium">{lang === 'hi' ? 'दस्तावेज' : 'Docs'}</span>
            </div>
            <span className="text-slate-400 font-mono-numbers text-[11px]">
              {stats.byPlugin.document.count} ({formatBytes(stats.byPlugin.document.usedBytes)})
            </span>
          </button>

          <button
            onClick={() => onSelectPlugin('video')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-950/30 border border-slate-800/80 hover:border-amber-500/30 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-slate-300 font-medium">{lang === 'hi' ? 'वीडियो' : 'Videos'}</span>
            </div>
            <span className="text-slate-400 font-mono-numbers text-[11px]">
              {stats.byPlugin.video.count} ({formatBytes(stats.byPlugin.video.usedBytes)})
            </span>
          </button>
        </div>
      </div>

      {/* 4 Dedicated Storage Plugin Launch Cards (Requested: PDF store, Photo store, Document store, Video store ka plugin) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white font-display">
            {lang === 'hi' ? 'स्टोरेज प्लगइन्स (Dedicated Plugins)' : 'Dedicated Storage Plugins'}
          </h2>
          <span className="text-xs text-slate-400">
            {lang === 'hi' ? '4 प्लगइन्स सक्रिय' : '4 Plugins Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Plugin 1: PDF */}
          <div
            onClick={() => onSelectPlugin('pdf')}
            className="group cursor-pointer rounded-2xl bg-[#111728] border border-emerald-500/30 hover:border-emerald-400 p-5 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-950/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-display">
                {t.plugins.pdfTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {t.plugins.pdfDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono-numbers">{stats.byPlugin.pdf.count} {lang === 'hi' ? 'दस्तावेज' : 'files'}</span>
              <span className="text-emerald-400 font-medium">{formatBytes(stats.byPlugin.pdf.usedBytes)}</span>
            </div>
          </div>

          {/* Plugin 2: Photo */}
          <div
            onClick={() => onSelectPlugin('photo')}
            className="group cursor-pointer rounded-2xl bg-[#111728] border border-rose-500/30 hover:border-rose-400 p-5 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-950/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors font-display">
                {t.plugins.photoTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {t.plugins.photoDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono-numbers">{stats.byPlugin.photo.count} {lang === 'hi' ? 'फोटो' : 'photos'}</span>
              <span className="text-rose-400 font-medium">{formatBytes(stats.byPlugin.photo.usedBytes)}</span>
            </div>
          </div>

          {/* Plugin 3: Document */}
          <div
            onClick={() => onSelectPlugin('document')}
            className="group cursor-pointer rounded-2xl bg-[#111728] border border-violet-500/30 hover:border-violet-400 p-5 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-950/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <FileCode className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors font-display">
                {t.plugins.docTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {t.plugins.docDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono-numbers">{stats.byPlugin.document.count} {lang === 'hi' ? 'नोट्स' : 'docs'}</span>
              <span className="text-violet-400 font-medium">{formatBytes(stats.byPlugin.document.usedBytes)}</span>
            </div>
          </div>

          {/* Plugin 4: Video */}
          <div
            onClick={() => onSelectPlugin('video')}
            className="group cursor-pointer rounded-2xl bg-[#111728] border border-amber-500/30 hover:border-amber-400 p-5 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-950/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Film className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                {t.plugins.videoTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {t.plugins.videoDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono-numbers">{stats.byPlugin.video.count} {lang === 'hi' ? 'वीडियो' : 'videos'}</span>
              <span className="text-amber-400 font-medium">{formatBytes(stats.byPlugin.video.usedBytes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files Vault Table */}
      <div className="rounded-2xl bg-[#11162b] border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-white font-display">
              {lang === 'hi' ? 'हाल ही में सहेजी गई फाइल्स' : 'Recently Saved Files'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-numbers">
            {recentItems.length} {t.storage.itemsCount}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold pl-2">{lang === 'hi' ? 'नाम' : 'File Name'}</th>
                <th className="pb-3 font-semibold">{lang === 'hi' ? 'प्लगइन' : 'Plugin'}</th>
                <th className="pb-3 font-semibold">{lang === 'hi' ? 'कैटेगरी' : 'Category'}</th>
                <th className="pb-3 font-semibold text-right">{lang === 'hi' ? 'साइज' : 'Size'}</th>
                <th className="pb-3 font-semibold text-right pr-2">{lang === 'hi' ? 'क्रिया' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentItems.slice(0, 6).map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 font-medium text-white max-w-[200px] sm:max-w-xs truncate">
                    <div className="flex items-center gap-2.5">
                      {item.pluginType === 'pdf' && <FileText className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {item.pluginType === 'photo' && <ImageIcon className="w-4 h-4 text-rose-400 shrink-0" />}
                      {item.pluginType === 'document' && <FileCode className="w-4 h-4 text-violet-400 shrink-0" />}
                      {item.pluginType === 'video' && <Film className="w-4 h-4 text-amber-400 shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      item.pluginType === 'pdf' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      item.pluginType === 'photo' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                      item.pluginType === 'document' ? 'bg-violet-950 text-violet-300 border border-violet-500/30' :
                      'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.pluginType.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{item.category}</td>
                  <td className="py-3 text-right font-mono-numbers text-slate-300">
                    {formatBytes(item.sizeBytes)}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title={t.common.preview}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDownloadItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title={t.common.download}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
