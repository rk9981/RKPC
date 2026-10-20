import React, { useState } from 'react';
import { MediaItem } from '../../types/storage';
import { Language, translations } from '../../translations';
import { formatBytes } from '../../services/db';
import { 
  FileCode, 
  Search, 
  Upload, 
  Edit3, 
  Download, 
  Trash2, 
  Star, 
  Plus, 
  Save, 
  X, 
  Copy, 
  Check, 
  FileText
} from 'lucide-react';

interface DocumentStorePluginProps {
  items: MediaItem[];
  lang: Language;
  onUploadClick: () => void;
  onCreateNewDoc: (title: string, content: string, category: string) => void;
  onUpdateDoc: (item: MediaItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const DocumentStorePlugin: React.FC<DocumentStorePluginProps> = ({
  items,
  lang,
  onUploadClick,
  onCreateNewDoc,
  onUpdateDoc,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDoc, setActiveDoc] = useState<MediaItem | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('General Notes');
  const [copied, setCopied] = useState(false);

  const t = translations[lang];

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenEditor = (item: MediaItem) => {
    setActiveDoc(item);
    setEditedTitle(item.title);
    setEditedContent(item.textContent || '');
    setIsCreatingNew(false);
  };

  const handleSaveActiveDoc = () => {
    if (!activeDoc) return;
    const words = editedContent.trim() ? editedContent.trim().split(/\s+/).length : 0;
    const updated: MediaItem = {
      ...activeDoc,
      title: editedTitle.trim() || activeDoc.title,
      textContent: editedContent,
      sizeBytes: new Blob([editedContent]).size,
      metadata: {
        ...activeDoc.metadata,
        wordCount: words,
      }
    };
    onUpdateDoc(updated);
    setActiveDoc(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    onCreateNewDoc(
      newDocTitle.trim().endsWith('.md') || newDocTitle.trim().endsWith('.txt') 
        ? newDocTitle.trim() 
        : `${newDocTitle.trim()}.md`,
      newDocContent,
      newDocCategory
    );
    setIsCreatingNew(false);
    setNewDocTitle('');
    setNewDocContent('');
  };

  const handleDownload = (item: MediaItem) => {
    const blob = new Blob([item.textContent || ''], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.originalName.endsWith('.txt') || item.originalName.endsWith('.md')
      ? item.originalName
      : `${item.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Plugin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/60 via-purple-950/40 to-slate-900 border border-violet-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-400 shrink-0 shadow-lg shadow-violet-500/10">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.plugins.docTitle}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Live Editor
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t.plugins.docDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.storage.createDoc}</span>
            </button>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-violet-200 bg-violet-950/80 hover:bg-violet-900/80 border border-violet-500/40 rounded-xl transition-all whitespace-nowrap shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>{t.storage.uploadNew}</span>
            </button>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="mt-6 pt-4 border-t border-violet-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.storage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-violet-500 text-white font-medium shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Documents */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">{t.storage.noItemsTitle}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{t.storage.noItemsDesc}</p>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="mt-4 px-4 py-2 text-xs font-medium text-violet-300 bg-violet-950/60 border border-violet-500/30 rounded-xl hover:bg-violet-900/50 transition-colors"
          >
            {lang === 'hi' ? 'पहला दस्तावेज बनाएं' : 'Create First Document'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#111728] border border-slate-800 hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-950/20 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                    <FileCode className="w-5 h-5" />
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

                <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
                  {item.title}
                </h3>

                {/* Document text snippet preview */}
                <div 
                  onClick={() => handleOpenEditor(item)}
                  className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300 font-mono-numbers line-clamp-4 cursor-pointer hover:border-violet-500/40 transition-colors leading-relaxed"
                >
                  {item.textContent ? item.textContent.slice(0, 180) : 'Empty text note... Click to write.'}
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{item.metadata?.wordCount || 0} {lang === 'hi' ? 'शब्द' : 'words'}</span>
                  <span>·</span>
                  <span className="font-mono-numbers">{formatBytes(item.sizeBytes)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-500/20">
                  {item.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditor(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 text-xs font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'एडिट करें' : 'Edit / Read'}</span>
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

      {/* In-App Live Document Editor & Reader Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[88vh] bg-[#0c1020] border border-violet-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Editor Top Bar */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-violet-500 w-full max-w-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleSaveActiveDoc}
                  className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-violet-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.common.save}</span>
                </button>

                <button
                  onClick={() => handleDownload(activeDoc)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title={t.common.download}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveDoc(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Text Area & Reader */}
            <div className="flex-1 p-4 sm:p-6 bg-[#080b18] flex flex-col">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Start typing your document, markdown notes, code or thoughts here..."
                className="w-full flex-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-6 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500/60 leading-relaxed resize-none"
              />
            </div>

            {/* Editor Status Bar */}
            <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-mono-numbers">
                  {editedContent.trim() ? editedContent.trim().split(/\s+/).length : 0} {lang === 'hi' ? 'शब्द (words)' : 'words'}
                </span>
                <span>·</span>
                <span className="font-mono-numbers">{editedContent.length} chars</span>
              </div>
              <span className="text-[11px] text-violet-400">
                {lang === 'hi' ? 'दस्तावेज सुरक्षित रूप से सिंक है' : 'Vault Document Auto-Buffered'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Create New Document Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0e1326] border border-violet-500/40 rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">{t.storage.createDoc}</h3>
              </div>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'दस्तावेज का शीर्षक / नाम:' : 'Document Title / File Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. My_Ideas_2026.md"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'कैटेगरी:' : 'Category:'}
                </label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="General Notes">General Notes</option>
                  <option value="Work Projects">Work Projects</option>
                  <option value="Personal Diary">Personal Diary</option>
                  <option value="Code Snippets">Code Snippets</option>
                  <option value="Hindi Sahitya">Hindi Sahitya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'प्रारंभिक सामग्री (Content):' : 'Initial Content:'}
                </label>
                <textarea
                  rows={6}
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder={lang === 'hi' ? 'यहाँ अपना नोट या टेक्स्ट लिखें...' : 'Type your initial markdown or text here...'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-semibold bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-colors"
                >
                  {lang === 'hi' ? 'दस्तावेज सुरक्षित करें' : 'Create & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
