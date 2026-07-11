import type { Guide } from './types';

const guide: Guide = {
  title: 'Swap Now Stack',
  slug: 'swap-now-stack',
  description:
    'A short set of low-friction swaps you can make today, by category. Pick one or two that match where you spend time and try them for a week before going further.',
  type: 'stack',
  updatedDate: '2025-01-15',
  tools: ['Firefox', 'VLC', 'LibreOffice', 'KeePassXC'],
  relatedToolIds: [
    'firefox', 'librewolf', 'brave',
    'vlc', 'mpv',
    'libreoffice',
    'gimp', 'krita',
    'joplin', 'logseq',
    'keepassxc', 'bitwarden',
    '7zip', 'nanazip',
    'thunderbird',
  ],
  relatedCategorySlugs: ['productivity', 'media', 'security', 'design'],
  relatedTags: ['cross-platform', 'offline-capable', 'privacy-focused', 'local-first', 'beginner-friendly'],
  toolLinks: {
    'Firefox': 'firefox',
    'LibreWolf': 'librewolf',
    'Brave': 'brave',
    'VLC': 'vlc',
    'mpv': 'mpv',
    'LibreOffice': 'libreoffice',
    'GIMP': 'gimp',
    'Krita': 'krita',
    'Joplin': 'joplin',
    'Logseq': 'logseq',
    'KeePassXC': 'keepassxc',
    'Bitwarden': 'bitwarden',
    '7-Zip': '7zip',
    'NanaZip': 'nanazip',
    'Thunderbird': 'thunderbird',
  },
  body: [
    {
      type: 'paragraph',
      text: 'You do not need to replace everything at once. Pick one category where you already feel friction with your current tools, try the swap for a week, and go from there. Every tool listed here is free, works offline, and has no account requirement.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Browser',
    },
    {
      type: 'paragraph',
      text: 'Firefox is the most straightforward swap. It supports the same extensions as Chrome, has a mature privacy feature set, and is not tied to a data-collection business model. LibreWolf is a hardened Firefox build with stricter defaults if privacy is the primary concern. Brave is a Chromium-based option for users who want Chrome extension compatibility.',
    },
    {
      type: 'callout',
      text: 'Best for most people: Firefox. Best for stricter privacy defaults: LibreWolf.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Media player',
    },
    {
      type: 'paragraph',
      text: 'VLC plays almost any video or audio format without additional codecs or setup. It is the most reliable cross-platform media player and has no tracking or streaming features. mpv is a leaner option for users who prefer a minimal interface.',
    },
    {
      type: 'callout',
      text: 'Best for most people: VLC. Best for a minimal, keyboard-driven setup: mpv.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Office and documents',
    },
    {
      type: 'paragraph',
      text: 'LibreOffice covers word processing, spreadsheets, and presentations. It reads and writes Microsoft Office formats well enough for everyday use. Compatibility is not perfect at the edges, but for standard documents it handles the job without a subscription.',
    },
    {
      type: 'callout',
      text: 'Best for most documents: LibreOffice Writer and Calc.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Image editing',
    },
    {
      type: 'paragraph',
      text: 'GIMP handles photo editing, cropping, compositing, and format conversion. It has a steeper learning curve than simpler editors, but it is fully capable. Krita is the better choice for digital painting and illustration.',
    },
    {
      type: 'callout',
      text: 'Best for photo editing: GIMP. Best for digital painting: Krita.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Note-taking',
    },
    {
      type: 'paragraph',
      text: 'Joplin is a notes app with Markdown support, optional sync, and a clean interface. It works offline and stores notes locally. Logseq is more powerful for linked knowledge management but requires more time to learn.',
    },
    {
      type: 'callout',
      text: 'Best for simple notes: Joplin. Best for linked notes and knowledge management: Logseq.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Password manager',
    },
    {
      type: 'paragraph',
      text: 'KeePassXC stores credentials in a local encrypted file with no server and no subscription. Bitwarden offers sync across devices and has polished apps for every platform, with a self-hosted option available.',
    },
    {
      type: 'callout',
      text: 'Best for local-only: KeePassXC. Best for cross-device sync: Bitwarden.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'File archiving',
    },
    {
      type: 'paragraph',
      text: '7-Zip handles ZIP, 7z, RAR, and most other archive formats. It is lightweight and reliable. NanaZip is a modern Windows fork with better shell integration for users who prefer a more current interface.',
    },
    {
      type: 'callout',
      text: 'Best for most users: 7-Zip. Best for a modern Windows shell experience: NanaZip.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Email client',
    },
    {
      type: 'paragraph',
      text: "Thunderbird works with any email provider that supports IMAP or POP3. It is a solid desktop client that gives you local control over your mail. This is a useful swap if you already use a dedicated email app. If you primarily use webmail, the setup overhead may not be worth it right away.",
    },
    {
      type: 'callout',
      text: 'Best for desktop email users: Thunderbird.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: 'Browser and media player are the two lowest-friction swaps since neither requires migrating data. Password manager takes more setup but has the highest ongoing payoff. Pick one, use it for a week, and go from there.',
    },
  ],
};

export default guide;
