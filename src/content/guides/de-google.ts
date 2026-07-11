import type { Guide } from './types';

const guide: Guide = {
  title: 'De-Google Your Life',
  slug: 'de-google',
  description:
    'Replace the most-used Google services with solid open-source alternatives. This guide maps each service to a practical replacement and tells you where to start.',
  type: 'stack',
  updatedDate: '2025-01-15',
  tools: ['Nextcloud', 'Brave', 'ProtonMail', 'Organic Maps'],
  relatedToolIds: ['searxng', 'brave', 'librewolf', 'proton-mail', 'tuta', 'stalwart-mail', 'nextcloud', 'onlyoffice', 'organic-maps', 'osmand', 'immich'],
  relatedTags: ['privacy', 'self-hosted', 'email', 'browser', 'maps', 'cloud storage'],
  relatedCategorySlugs: ['productivity', 'internet', 'cloud'],
  toolLinks: {
    'SearXNG': 'searxng',
    'Brave': 'brave',
    'LibreWolf': 'librewolf',
    'Proton Mail': 'proton-mail',
    'Tutanota': 'tuta',
    'Stalwart Mail': 'stalwart-mail',
    'Nextcloud': 'nextcloud',
    'OnlyOffice': 'onlyoffice',
    'Organic Maps': 'organic-maps',
    'OsmAnd': 'osmand',
    'Immich': 'immich',
  },
  body: [
    {
      type: 'paragraph',
      text: "Google services are deeply embedded in most people's digital lives. Replacing them is straightforward once you know what to reach for. This is a map, not a manifesto: pick the services that matter most to you and move at your own pace.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Search',
    },
    {
      type: 'paragraph',
      text: 'SearXNG is a self-hostable meta-search engine that queries multiple backends without building a profile on you. If you prefer not to self-host, Brave Search has its own independent index with no Google dependency.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Browser',
    },
    {
      type: 'paragraph',
      text: 'Brave is the easiest switch. It runs on Chromium, supports Chrome extensions, and blocks ads and trackers by default. LibreWolf is a hardened Firefox fork for users who want maximum privacy and are willing to occasionally adjust settings.',
    },
    {
      type: 'callout',
      text: 'Best for most people: Brave. Best for high-privacy needs: LibreWolf.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Email',
    },
    {
      type: 'paragraph',
      text: 'Proton Mail is the most accessible option: end-to-end encrypted by default, no technical setup required, free tier available. Tutanota is a similar alternative. For self-hosting, Stalwart Mail is the most actively maintained server going into 2025.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Drive and Docs',
    },
    {
      type: 'paragraph',
      text: 'Nextcloud covers file storage, calendar, and contacts. It can run on a home server, VPS, or managed hosting. For collaborative documents, OnlyOffice integrates with Nextcloud and handles .docx files without losing formatting.',
    },
    {
      type: 'list',
      items: [
        'Files: Nextcloud Files',
        'Documents: Nextcloud + OnlyOffice',
        'Calendar: Nextcloud Calendar (CalDAV)',
        'Contacts: Nextcloud Contacts (CardDAV)',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Maps',
    },
    {
      type: 'paragraph',
      text: 'Organic Maps works offline, has a clean interface, and is fast. It uses OpenStreetMap data. OsmAnd has more features but is heavier and harder to navigate initially.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Photos',
    },
    {
      type: 'paragraph',
      text: 'Immich is the strongest current option for a self-hosted Google Photos replacement. It includes face recognition and is under active development. Requires Docker.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: 'Start with browser and search. They have zero migration overhead and immediate payoff. Email and cloud storage take more effort and carry more risk if you rush. Pick one service per month and move steadily.',
    },
  ],
};

export default guide;
