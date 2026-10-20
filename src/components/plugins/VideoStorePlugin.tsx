import React, { useState, useRef } from 'react';
import { MediaItem } from '../../types/storage';
import { Language, translations } from '../../translations';
import { formatBytes } from '../../services/db';
import { 
  Film, 
  Search, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Trash2, 
  Star, 
  X, 
  FastForward, 
  Clock,
  Tv
} from 'lucide-react';

interface VideoStorePluginProps {
  items: MediaItem[];
  lang: Language;
  onUploadClick: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const VideoStorePlugin: React.FC<VideoStorePluginProps> = ({
  items,
  lang,
  onUploadClick,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const t = translations[lang];

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenVideo = (item: MediaItem) => {
    setActiveVideo(item);
    setIsPlaying(false);
    setCurrentTime(0);
    setPlaybackRate(1);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = (item: MediaItem) => {
    if (!item.contentUrl) return;
    const a = document.createElement('a');
    a.href = item.contentUrl;
    a.download = item.originalName || `${item.title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Plugin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900 border border-amber-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.plugins.videoTitle}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  HD Theater
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t.plugins.videoDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onUploadClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'hi' ? 'वीडियो अपलोड करें' : 'Upload Video'}</span>
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.storage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white font-medium shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Videos */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">{t.storage.noItemsTitle}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{t.storage.noItemsDesc}</p>
          <button
            onClick={onUploadClick}
            className="mt-4 px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-500/30 rounded-xl hover:bg-amber-900/50 transition-colors"
          >
            {lang === 'hi' ? 'पहला वीडियो जोड़ें' : 'Upload First Video'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#111728] border border-slate-800 hover:border-amber-500/50 overflow-hidden transition-all hover:shadow-xl hover:shadow-amber-950/30 flex flex-col"
            >
              {/* Video Thumbnail with Play Button */}
              <div 
                className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() => handleOpenVideo(item)}
              >
                {item.contentUrl ? (
                  <video
                    src={item.contentUrl}
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950/40 to-slate-900 text-amber-300">
                    <Film className="w-10 h-10 mb-2 opacity-60" />
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/90 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30 font-medium font-mono-numbers">
                      {item.metadata?.resolution || '1080p'}
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

                  <div className="absolute bottom-2.5 left-2.5 text-[11px] text-white flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded font-mono-numbers">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{formatTime(item.metadata?.durationSeconds || 15)}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
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

      {/* Cinematic Custom Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full ${isTheaterMode ? 'max-w-6xl' : 'max-w-4xl'} bg-[#0b0e1c] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
            {/* Player Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate">{activeVideo.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono-numbers">{formatBytes(activeVideo.sizeBytes)}</span>
                    <span>·</span>
                    <span>{activeVideo.metadata?.resolution || '1080p Full HD'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isTheaterMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Toggle Theater Mode"
                >
                  <Tv className="w-4 h-4" />
                  <span className="hidden sm:inline">Theater</span>
                </button>

                <button
                  onClick={() => handleDownload(activeVideo)}
                  className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.common.download}</span>
                </button>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Stage */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
              {activeVideo.contentUrl ? (
                <video
                  ref={videoRef}
                  src={activeVideo.contentUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                  autoPlay
                />
              ) : (
                <div className="text-slate-500 text-center">
                  <Film className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Video track stream active</p>
                </div>
              )}

              {/* Big Play overlay when paused */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              )}
            </div>

            {/* Custom Cinema Controller Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
              {/* Timeline seek scrubber */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />

              <div className="flex items-center justify-between text-xs text-slate-300">
                {/* Left play/time controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="font-mono-numbers text-slate-400 text-xs">
                    <span className="text-white">{formatTime(currentTime)}</span>
                    <span className="mx-1">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Right controls: Speeds and Fullscreen */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                    {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono-numbers font-medium transition-colors ${
                          playbackRate === speed
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
