import type { Guide } from './types';

const guide: Guide = {
  title: 'Open Source 101',
  slug: 'open-source-101',
  description:
    'What open source software is, how to find and evaluate projects on GitHub, and how to tell the difference between the types of tools you will encounter.',
  type: 'guide',
  updatedDate: '2025-01-15',
  tools: [],
  relatedToolIds: [],
  relatedCategorySlugs: [],
  relatedTags: [],
  toolLinks: {
    'LibreOffice': 'libreoffice',
    'GIMP': 'gimp',
    'VLC': 'vlc',
    'Jellyfin': 'jellyfin',
    'Immich': 'immich',
    'Nextcloud': 'nextcloud',
    'Penpot': 'penpot',
  },
  body: [
    {
      type: 'paragraph',
      text: 'Open source software makes its source code publicly available. Anyone can read it, and depending on the license, modify or redistribute it. For personal use, most open source software costs nothing and imposes no restrictions on your data. You are not the product. There is no subscription, no account required, and no company profiling your usage.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What GitHub is',
    },
    {
      type: 'paragraph',
      text: 'GitHub is a platform for hosting code repositories. It is where most open source projects live: their code, documentation, issue trackers, and release files are all stored there. You do not need a GitHub account to download software or read documentation. Think of it as a public filing system for software projects.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Reading a GitHub project page',
    },
    {
      type: 'paragraph',
      text: 'A typical project page shows a README file, which explains what the software does, how to install it, and how to get started. Below the file browser, you will see the commit history. In the right sidebar, look for a "Releases" section with a version number. That is usually where you find something you can actually install.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Releases vs source code',
    },
    {
      type: 'paragraph',
      text: 'The main file view on GitHub shows raw source code, which is not a built application you can run. For almost all software, you want the Releases page. Releases contain pre-built installers or binaries labeled by version number, such as v2.1.0. Download from the Releases page. Avoid "pre-release" or "alpha" versions unless you know what you are doing.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'How to install from GitHub safely',
    },
    {
      type: 'paragraph',
      text: 'Navigate to the Releases page of the project. Find the latest stable release and download the file appropriate for your system: an .exe or .msi installer for Windows, a .dmg or .pkg for macOS. Before downloading, confirm you are on the correct repository. Typosquatted or forked repositories with similar names exist. Check the repository owner matches the official project.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'What to look for before trusting a project',
    },
    {
      type: 'list',
      items: [
        'Recent commits or releases: a project with no updates in years may have unpatched security issues',
        'A clear license: tells you what you are allowed to do with the software',
        'An active issue tracker: suggests a community responding to bugs and questions',
        'Documentation: a README at minimum, ideally a dedicated docs site',
        'Star count and contributor count as rough signals, not guarantees of quality',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Types of software you will encounter',
    },
    {
      type: 'list',
      items: [
        'Desktop app: installs on your computer and runs locally. Examples: LibreOffice, GIMP, VLC.',
        'Web app: runs in a browser, hosted by someone else or by you. Examples: Penpot, Nextcloud.',
        'Self-hosted: a server application you run on your own machine or VPS. Requires more setup. Examples: Jellyfin, Immich.',
        'Command-line tool: runs in a terminal with no graphical interface. Examples: ffmpeg, Git, curl.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Most tools listed on OpenFinder are desktop apps or web apps. Self-hosted tools are labeled clearly and are better suited to users comfortable with server administration.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: 'Browse by category to find tools for a specific need. Each tool page on OpenFinder links to the project website and GitHub page. Use the evaluation steps above before installing anything you are not familiar with.',
    },
  ],
};

export default guide;
