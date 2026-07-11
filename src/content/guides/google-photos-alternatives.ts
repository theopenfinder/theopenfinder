import type { Guide } from './types';

const guide: Guide = {
  title: 'Google Photos Alternatives',
  slug: 'google-photos-alternatives',
  description:
    'Photo backup, galleries, and personal media libraries. Four tools covering the range from a Google Photos-style mobile sync to desktop-first management.',
  type: 'alternatives',
  updatedDate: '2025-01-15',
  tools: ['Immich', 'PhotoPrism', 'digiKam', 'Nextcloud'],
  relatedToolIds: ['immich', 'photoprism', 'digikam', 'nextcloud'],
  relatedCategorySlugs: ['privacy', 'design'],
  relatedTags: ['self-hosted', 'photo-management', 'library-management', 'backup', 'privacy-focused'],
  toolLinks: {
    'Immich': 'immich',
    'PhotoPrism': 'photoprism',
    'digiKam': 'digikam',
    'Nextcloud': 'nextcloud',
  },
  body: [
    {
      type: 'paragraph',
      text: 'Google Photos bundles mobile backup, browsing, search, and sharing into one product. Self-hosted photo tools do not all cover the same ground. The right choice depends on whether you want a direct mobile-sync replacement, a web gallery for large collections, or desktop-level management.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Immich',
    },
    {
      type: 'paragraph',
      text: "Immich is the closest self-hosted equivalent to Google Photos in terms of workflow. It has iOS and Android apps that back up photos automatically, a timeline-based web UI, face recognition, and shared albums. It requires Docker and is under active development, so the API and feature set can change between updates.",
    },
    {
      type: 'callout',
      text: 'Best for: people who want a direct Google Photos replacement with mobile backup. Requires Docker and a capable host.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'PhotoPrism',
    },
    {
      type: 'paragraph',
      text: "PhotoPrism is a web-based photo library built for browsing and organizing large existing collections. It indexes photos from a folder, applies metadata analysis and AI categorization, and serves them through a clean interface. It works well as a gallery for photos already on a NAS or server. Mobile backup is not its primary focus.",
    },
    {
      type: 'callout',
      text: 'Best for: organizing and browsing a large existing photo library from a NAS or server. Less suited for daily mobile backup.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'digiKam',
    },
    {
      type: 'paragraph',
      text: 'digiKam is desktop photo management software, not a cloud or server application. It handles large local collections well, with strong tagging, batch processing, RAW support, and metadata editing. If your workflow centers on a desktop photo library and you do not need a web interface or mobile backup, digiKam is the most capable option in this group.',
    },
    {
      type: 'callout',
      text: 'Best for: desktop-first photo organization and editing. Not a replacement for cloud photo services.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Nextcloud',
    },
    {
      type: 'paragraph',
      text: 'Nextcloud is a broader file sync and collaboration platform. Its Memories app adds a Google Photos-style timeline UI for photos stored in Nextcloud Files. It is a reasonable option if you are already running Nextcloud and want photo browsing without adding another service. As a dedicated photo tool, Immich or PhotoPrism offer more focused features.',
    },
    {
      type: 'callout',
      text: 'Best for: people already running Nextcloud who want photo browsing without a separate service.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: "If you want to replace Google Photos for mobile backup, start with Immich. If you have an existing photo library to organize and browse via web, start with PhotoPrism. If your work is desktop-based, try digiKam. Nextcloud is worth considering only if it is already part of your setup.",
    },
  ],
};

export default guide;
