export type PluginType = 'pdf' | 'photo' | 'document' | 'video';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  createdAt: string;
  role: 'free' | 'pro' | 'admin';
  storageQuotaMB: number;
}

export interface MediaItem {
  id: string;
  userId: string;
  pluginType: PluginType;
  title: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  dateAdded: string;
  tags: string[];
  category: string;
  isFavorite: boolean;
  contentUrl?: string; // Data URL or asset path
  textContent?: string; // For text/markdown document reader & editor
  metadata?: {
    pageCount?: number;
    dimensions?: { width: number; height: number };
    durationSeconds?: number;
    wordCount?: number;
    author?: string;
    resolution?: string;
    codec?: string;
  };
}

export interface StoragePlugin {
  id: PluginType;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  badge: string;
  accentColor: string; // e.g. text-rose-500, bg-rose-500
  accentHex: string;
  gradient: string;
  cardBg: string;
  acceptedFormats: string[];
  iconName: string;
  isEnabled: boolean;
}

export interface StorageStats {
  totalAllocatedMB: number;
  totalUsedBytes: number;
  byPlugin: Record<PluginType, {
    count: number;
    usedBytes: number;
  }>;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'name' | 'size';
