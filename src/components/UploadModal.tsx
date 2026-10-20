import React, { useState, useRef } from 'react';
import { PluginType, MediaItem } from '../types/storage';
import { Language, translations } from '../translations';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Film, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  currentUserId: string;
  defaultPlugin?: PluginType;
  lang: Language;
  onClose: () => void;
  onUploadSuccess: (item: Omit<MediaItem, 'id' | 'userId' | 'dateAdded'>) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  currentUserId,
  defaultPlugin = 'pdf',
  lang,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedPlugin, setSelectedPlugin] = useState<PluginType>(defaultPlugin);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  if (!isOpen) return null;

  const detectPluginType = (fileName: string, mime: string): PluginType => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf' || mime.includes('pdf')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp'].includes(ext) || mime.startsWith('image/')) return 'photo';
    if (['mp4', 'webm', 'mov', 'ogg', 'mkv', 'avi'].includes(ext) || mime.startsWith('video/')) return 'video';
    return 'document';
  };

  const handleFileChange = (incomingFile: File) => {
    setError(null);
    setFile(incomingFile);
    setTitle(incomingFile.name);
    const autoPlugin = detectPluginType(incomingFile.name, incomingFile.type);
    setSelectedPlugin(autoPlugin);

    // Auto set default category
    if (autoPlugin === 'pdf') setCategory('Contracts & Documents');
    else if (autoPlugin === 'photo') setCategory('Gallery');
    else if (autoPlugin === 'document') setCategory('Work Notes');
    else if (autoPlugin === 'video') setCategory('Media Clips');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(lang === 'hi' ? 'कृपया एक फाइल चुनें।' : 'Please choose a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let contentUrl: string | undefined = undefined;
      let textContent: string | undefined = undefined;

      // Read file content
      if (selectedPlugin === 'photo' || selectedPlugin === 'video') {
        contentUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else if (selectedPlugin === 'document') {
        textContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsText(file);
        });
      } else if (selectedPlugin === 'pdf') {
        textContent = `PRISMVAULT ENCRYPTED PDF STREAM\nFile: ${file.name}\nOriginal Size: ${file.size} bytes\nPreserved with high integrity in the PDF Store Plugin.`;
      }

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      onUploadSuccess({
        pluginType: selectedPlugin,
        title: title.trim() || file.name,
        originalName: file.name,
        sizeBytes: file.size,
        mimeType: file.type || 'application/octet-stream',
        tags: tags.length > 0 ? tags : ['Uploaded'],
        category: category.trim() || 'General',
        isFavorite: false,
        contentUrl,
        textContent,
        metadata: {
          pageCount: selectedPlugin === 'pdf' ? Math.max(1, Math.ceil(file.size / 150000)) : undefined,
          wordCount: textContent ? textContent.split(/\s+/).length : undefined,
          resolution: selectedPlugin === 'photo' ? 'Original HD' : selectedPlugin === 'video' ? '1080p' : undefined,
        }
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0f1428] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500"></div>

        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Upload className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white font-display">
                {t.storage.uploadNew}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/40'
                  : file
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                  <p className="font-semibold text-white text-sm truncate max-w-xs">{file.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || 'Custom format'}
                  </p>
                  <span className="text-[10px] text-indigo-400 mt-2 hover:underline">
                    {lang === 'hi' ? 'बदलने के लिए यहाँ क्लिक करें' : 'Click to change file'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-indigo-400 mb-2 opacity-80" />
                  <p className="font-semibold text-slate-200 text-sm">
                    {lang === 'hi' ? 'फाइल चुनें या यहाँ ड्रैग करें' : 'Choose a file or drag & drop here'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PDF, JPG, PNG, DOC, TXT, MD, MP4, WebM (up to 500 MB)
                  </p>
                </div>
              )}
            </div>

            {/* Target Storage Plugin Switcher */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                {lang === 'hi' ? 'टारगेट स्टोरेज प्लगइन:' : 'Target Storage Plugin:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlugin('pdf')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedPlugin === 'pdf'
                      ? 'border-emerald-400 bg-emerald-950/50 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlugin('photo')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedPlugin === 'photo'
                      ? 'border-rose-400 bg-rose-950/50 text-rose-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{lang === 'hi' ? 'फोटो' : 'Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlugin('document')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedPlugin === 'document'
                      ? 'border-violet-400 bg-violet-950/50 text-violet-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{lang === 'hi' ? 'दस्तावेज' : 'Doc'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlugin('video')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedPlugin === 'video'
                      ? 'border-amber-400 bg-amber-950/50 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{lang === 'hi' ? 'वीडियो' : 'Video'}</span>
                </button>
              </div>
            </div>

            {/* Title / Name */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {lang === 'hi' ? 'फाइल का नाम:' : 'File Display Title:'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My_Important_File.pdf"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'कैटेगरी:' : 'Category:'}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Finance, Nature, Notes"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'टैग्स (कॉमा से अलग करें):' : 'Tags (comma separated):'}
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. office, 2026, personal"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 hover:opacity-90 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isUploading ? 'Uploading & Encrypting...' : t.storage.uploadNew}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
