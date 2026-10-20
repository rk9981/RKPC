import { User, MediaItem, StoragePlugin, StorageStats, PluginType } from '../types/storage';

const USERS_KEY = 'prism_vault_users_v1';
const CURRENT_USER_KEY = 'prism_vault_current_user_v1';
const MEDIA_KEY_PREFIX = 'prism_vault_media_v1_';
const PLUGINS_CONFIG_KEY = 'prism_vault_plugins_config_v1';

export const DEFAULT_PLUGINS: StoragePlugin[] = [
  {
    id: 'pdf',
    name: 'PDF Store',
    nameHi: 'पीडीएफ स्टोर',
    description: 'Instant PDF viewer, page navigation, bill & contract vault.',
    descriptionHi: 'दस्तावेज, बिल और किताबों के लिए बिल्ट-इन लाइव पीडीएफ व्यूअर।',
    badge: 'PDF Reader',
    accentColor: 'text-emerald-400',
    accentHex: '#10B981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    cardBg: 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60',
    acceptedFormats: ['.pdf', 'application/pdf'],
    iconName: 'FileText',
    isEnabled: true,
  },
  {
    id: 'photo',
    name: 'Photo Store',
    nameHi: 'फोटो स्टोर',
    description: 'High-res image gallery, slideshow, vivid color filter presets & zoom.',
    descriptionHi: 'एचडी फोटो गैलरी, फिल्टर इफेक्ट्स, ज़ूम और फुलस्क्रीन लाइटबॉक्स।',
    badge: 'Gallery & Filters',
    accentColor: 'text-rose-400',
    accentHex: '#F43F5E',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    cardBg: 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60',
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', 'image/*'],
    iconName: 'Image',
    isEnabled: true,
  },
  {
    id: 'document',
    name: 'Document Store',
    nameHi: 'डॉक्यूमेंट स्टोर',
    description: 'Word, Markdown, text files with in-app reader & live note editor.',
    descriptionHi: 'टेक्स्ट फाइल्स, कोड और नोट्स के लिए लाइव रीडर व इन-ऐप एडिटर।',
    badge: 'Live Editor',
    accentColor: 'text-violet-400',
    accentHex: '#8B5CF6',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    cardBg: 'bg-violet-950/20 border-violet-500/30 hover:border-violet-500/60',
    acceptedFormats: ['.doc', '.docx', '.txt', '.md', '.json', '.csv'],
    iconName: 'FileCode',
    isEnabled: true,
  },
  {
    id: 'video',
    name: 'Video Store',
    nameHi: 'वीडियो स्टोर',
    description: 'Cinema theater with custom HTML5 speed controls & theater mode.',
    descriptionHi: 'एचडी वीडियो प्लेयर, स्पीड कंट्रोल (0.5x - 2x) और थिएटर व्यू।',
    badge: 'HD Theater',
    accentColor: 'text-amber-400',
    accentHex: '#F59E0B',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    cardBg: 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60',
    acceptedFormats: ['.mp4', '.webm', '.mov', '.ogg', 'video/*'],
    iconName: 'Film',
    isEnabled: true,
  },
];

export const DEMO_USER: User = {
  id: 'user_ramesh_pandey',
  name: 'Ramesh Pandey',
  email: 'pandeyramesh69223@gmail.com',
  password: 'password123',
  avatarUrl: '/src/assets/images/avatar_user_profile_1792509417118.jpg',
  createdAt: '2026-03-15T10:00:00.000Z',
  role: 'pro',
  storageQuotaMB: 51200, // 50 GB
};

export const INITIAL_SEED_ITEMS: (userId: string) => MediaItem[] = (userId) => [
  {
    id: 'pdf_sample_1',
    userId,
    pluginType: 'pdf',
    title: 'Cloud_Architecture_Specification_2026.pdf',
    originalName: 'Cloud_Architecture_Specification_2026.pdf',
    sizeBytes: 2450000, // 2.45 MB
    mimeType: 'application/pdf',
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Tech', 'Specs', 'Architecture'],
    category: 'Contracts & Specs',
    isFavorite: true,
    metadata: {
      pageCount: 18,
      author: 'PrismVault Cloud Engineering',
    },
    textContent: `PRISMVAULT ENTERPRISE STORAGE SPECIFICATION v2026.1
1. Overview:
PrismVault provides encrypted modular storage with dynamic plugin architecture for PDF documents, photo galleries, rich text documents, and high-bitrate video streams.

2. Encryption & Local Vault:
Client-side zero-knowledge isolation ensures files stored within the local IndexedDB and cloud partitions remain tamper-proof.

3. Plugin Architecture:
- PDF Vault: High performance canvas rendering with zoom & page bookmarks.
- Photo Vault: Color spectrum analysis, EXIF parser, and CSS hardware-accelerated filters.
- Document Vault: Live markdown rendering with syntax highlighting.
- Video Theater: Custom WebM/MP4 pipeline with variable playback speeds.

4. Compliance & Verification:
System integrity verified for seamless multi-user authentication and fast file retrieval.`
  },
  {
    id: 'pdf_sample_2',
    userId,
    pluginType: 'pdf',
    title: 'Q1_Financial_Report_And_Receipts.pdf',
    originalName: 'Q1_Financial_Report_And_Receipts.pdf',
    sizeBytes: 1180000, // 1.18 MB
    mimeType: 'application/pdf',
    dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Finance', 'Receipts', 'Tax'],
    category: 'Invoices',
    isFavorite: false,
    metadata: {
      pageCount: 6,
      author: 'Audit Team',
    },
    textContent: `Q1 FINANCIAL SUMMARY REPORT & EXPENSE LEDGER
Period: January - March 2026
Status: Verified & Audited

Revenue: $148,250.00
Cloud Storage Infrastructure Cost: $12,400.00
Net Margin: 68.4%

All receipts and vouchers cataloged within the PrismVault secure PDF repository.`
  },
  {
    id: 'photo_sample_1',
    userId,
    pluginType: 'photo',
    title: 'Canadian_Rockies_Lake_Sunrise.jpg',
    originalName: 'sample_mountain_lake.jpg',
    sizeBytes: 3850000, // 3.85 MB
    mimeType: 'image/jpeg',
    dateAdded: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['Nature', 'Mountains', 'Landscape'],
    category: 'Travel & Nature',
    isFavorite: true,
    contentUrl: '/src/assets/images/sample_mountain_lake_1792509417267.jpg',
    metadata: {
      dimensions: { width: 3840, height: 2160 },
      resolution: '4K Ultra HD',
    }
  },
  {
    id: 'photo_sample_2',
    userId,
    pluginType: 'photo',
    title: 'Neon_Twilight_City_Marina.jpg',
    originalName: 'sample_neon_skyline.jpg',
    sizeBytes: 4200000, // 4.2 MB
    mimeType: 'image/jpeg',
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['Urban', 'Cityscape', 'Architecture'],
    category: 'Photography',
    isFavorite: true,
    contentUrl: '/src/assets/images/sample_neon_skyline_1792509417007.jpg',
    metadata: {
      dimensions: { width: 3840, height: 2160 },
      resolution: '4K Ultra HD',
    }
  },
  {
    id: 'doc_sample_1',
    userId,
    pluginType: 'document',
    title: 'Project_Launch_Checklist.md',
    originalName: 'Project_Launch_Checklist.md',
    sizeBytes: 34000, // 34 KB
    mimeType: 'text/markdown',
    dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['Productivity', 'Markdown', 'Notes'],
    category: 'Work Notes',
    isFavorite: true,
    metadata: {
      wordCount: 285,
      author: 'Ramesh Pandey',
    },
    textContent: `# 🚀 PrismVault Project Launch Checklist

## Phase 1: Core Storage Plugins
- [x] PDF Store Plugin with interactive reader and full-page preview
- [x] Photo Store Plugin with gallery, image filters, and lightbox modal
- [x] Document Store Plugin with live editable editor and download
- [x] Video Store Plugin with HTML5 cinematic player, speed toggle, and seek bar

## Phase 2: User Access & Security
- [x] User registration with avatar selector and form validation
- [x] Instant sign-in with persistent authentication state
- [x] Quick demo user switcher (Ramesh Pandey / pandeyramesh69223@gmail.com)
- [x] Bilingual English & Hindi translations

## Phase 3: Performance & Space
- Total quota: 50 GB
- Real-time colorful space breakdown per media type
- Zero dead clicks and responsive UI across mobile and desktop`
  },
  {
    id: 'doc_sample_2',
    userId,
    pluginType: 'document',
    title: 'Hindi_Kavita_And_Notes.txt',
    originalName: 'Hindi_Kavita_And_Notes.txt',
    sizeBytes: 15400,
    mimeType: 'text/plain',
    dateAdded: new Date(Date.now() - 86400000 * 6).toISOString(),
    tags: ['Personal', 'Hindi', 'Literature'],
    category: 'Creative Writing',
    isFavorite: false,
    metadata: {
      wordCount: 142,
      author: 'रमेश पाण्डेय',
    },
    textContent: `शीर्षक: नए सफर की शुरुआत (New Horizons)

क्षितिज पर जब नई किरण मुस्काए,
मन में हौसलों का दीया जल जाए।
रंग-बिरंगे ख्वाबों को समेट कर,
हम चल पड़े अपनी राह बनाकर।

यह वॉल्ट हमारे सभी महत्वपूर्ण दस्तावेजों, यादों, तस्वीरों और वीडियो को एक जगह सुरक्षित संजो कर रखता है।`
  },
  {
    id: 'video_sample_1',
    userId,
    pluginType: 'video',
    title: 'Cosmic_Atmosphere_Scenic_Reel.mp4',
    originalName: 'Cosmic_Atmosphere_Scenic_Reel.mp4',
    sizeBytes: 14500000, // 14.5 MB
    mimeType: 'video/mp4',
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Cinema', 'Nature', 'Ambient'],
    category: 'Showreel',
    isFavorite: true,
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    metadata: {
      durationSeconds: 15,
      resolution: '1080p HD',
      codec: 'H.264 / AAC',
    }
  },
  {
    id: 'video_sample_2',
    userId,
    pluginType: 'video',
    title: 'Ocean_Waves_Nature_Breeze.mp4',
    originalName: 'Ocean_Waves_Nature_Breeze.mp4',
    sizeBytes: 11200000, // 11.2 MB
    mimeType: 'video/mp4',
    dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['Water', 'Serene', 'HD'],
    category: 'Nature Clips',
    isFavorite: false,
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    metadata: {
      durationSeconds: 15,
      resolution: '1080p HD',
      codec: 'H.264 / AAC',
    }
  }
];

// Helper database services
export class StorageDB {
  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        // Seed with demo user
        const initial = [DEMO_USER];
        localStorage.setItem(USERS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [DEMO_USER];
    }
  }

  static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  static registerUser(user: Omit<User, 'id' | 'createdAt' | 'storageQuotaMB' | 'role'>): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      role: 'free',
      storageQuotaMB: 20480, // 20 GB
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Seed initial files for the new registered user so they have instant data
    const initialFiles = INITIAL_SEED_ITEMS(newUser.id);
    this.saveUserMedia(newUser.id, initialFiles);

    // Auto login
    this.setCurrentUser(newUser);
    return newUser;
  }

  static loginUser(email: string, password?: string): User {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('User not found. Please register first or verify your email.');
    }
    if (found.password && password && found.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    this.setCurrentUser(found);
    return found;
  }

  static getUserMedia(userId: string): MediaItem[] {
    try {
      const key = MEDIA_KEY_PREFIX + userId;
      const data = localStorage.getItem(key);
      if (!data) {
        const seed = INITIAL_SEED_ITEMS(userId);
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEED_ITEMS(userId);
    }
  }

  static saveUserMedia(userId: string, items: MediaItem[]): void {
    try {
      const key = MEDIA_KEY_PREFIX + userId;
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.warn('Storage quota limit reached for localStorage:', err);
    }
  }

  static addMediaItem(userId: string, item: Omit<MediaItem, 'id' | 'userId' | 'dateAdded'>): MediaItem {
    const current = this.getUserMedia(userId);
    const newItem: MediaItem = {
      ...item,
      id: `${item.pluginType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      dateAdded: new Date().toISOString(),
    };
    current.unshift(newItem);
    this.saveUserMedia(userId, current);
    return newItem;
  }

  static updateMediaItem(userId: string, updatedItem: MediaItem): void {
    const current = this.getUserMedia(userId);
    const index = current.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      current[index] = updatedItem;
      this.saveUserMedia(userId, current);
    }
  }

  static deleteMediaItem(userId: string, itemId: string): void {
    const current = this.getUserMedia(userId);
    const filtered = current.filter(i => i.id !== itemId);
    this.saveUserMedia(userId, filtered);
  }

  static toggleFavorite(userId: string, itemId: string): MediaItem | null {
    const current = this.getUserMedia(userId);
    const item = current.find(i => i.id === itemId);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.saveUserMedia(userId, current);
      return item;
    }
    return null;
  }

  static calculateStats(quotaMB: number, items: MediaItem[]): StorageStats {
    let totalUsedBytes = 0;
    const byPlugin: Record<PluginType, { count: number; usedBytes: number }> = {
      pdf: { count: 0, usedBytes: 0 },
      photo: { count: 0, usedBytes: 0 },
      document: { count: 0, usedBytes: 0 },
      video: { count: 0, usedBytes: 0 },
    };

    items.forEach(item => {
      totalUsedBytes += item.sizeBytes;
      if (byPlugin[item.pluginType]) {
        byPlugin[item.pluginType].count += 1;
        byPlugin[item.pluginType].usedBytes += item.sizeBytes;
      }
    });

    return {
      totalAllocatedMB: quotaMB,
      totalUsedBytes,
      byPlugin,
    };
  }

  static getPluginsConfig(): StoragePlugin[] {
    try {
      const data = localStorage.getItem(PLUGINS_CONFIG_KEY);
      if (!data) return DEFAULT_PLUGINS;
      return JSON.parse(data);
    } catch {
      return DEFAULT_PLUGINS;
    }
  }

  static savePluginsConfig(plugins: StoragePlugin[]): void {
    localStorage.setItem(PLUGINS_CONFIG_KEY, JSON.stringify(plugins));
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
