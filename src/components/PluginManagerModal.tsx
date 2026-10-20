import React from 'react';
import { StoragePlugin, StorageStats } from '../types/storage';
import { Language, translations } from '../translations';
import { formatBytes } from '../services/db';
import { 
  X, 
  Sliders, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Film, 
  CheckCircle2, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface PluginManagerModalProps {
  isOpen: boolean;
  plugins: StoragePlugin[];
  stats: StorageStats;
  lang: Language;
  onClose: () => void;
  onTogglePlugin: (pluginId: string) => void;
}

export const PluginManagerModal: React.FC<PluginManagerModalProps> = ({
  isOpen,
  plugins,
  stats,
  lang,
  onClose,
  onTogglePlugin,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const getPluginIcon = (id: string) => {
    switch (id) {
      case 'pdf': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'photo': return <ImageIcon className="w-5 h-5 text-rose-400" />;
      case 'document': return <FileCode className="w-5 h-5 text-violet-400" />;
      case 'video': return <Film className="w-5 h-5 text-amber-400" />;
      default: return <Cpu className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0f1428] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500"></div>

        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  {t.plugins.managePlugins}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'hi' ? 'अपने मीडिया और स्टोरेज प्लगइन्स की स्थिति व सेटिंग्स देखें' : 'Configure storage plugins and inspect storage allocation'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {plugins.map((plugin) => {
              const pluginStats = stats.byPlugin[plugin.id];
              return (
                <div
                  key={plugin.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                      {getPluginIcon(plugin.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {lang === 'hi' ? plugin.nameHi : plugin.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {lang === 'hi' ? plugin.descriptionHi : plugin.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Formats: {plugin.acceptedFormats.join(', ')}</span>
                        <span>·</span>
                        <span className="font-mono-numbers text-slate-300">
                          {pluginStats ? `${pluginStats.count} items (${formatBytes(pluginStats.usedBytes)})` : '0 items'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePlugin(plugin.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        plugin.isEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          plugin.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सभी 4 प्लगइन्स एन्क्रिप्टेड और तैयार हैं' : 'All 4 plugins operational and isolated'}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
