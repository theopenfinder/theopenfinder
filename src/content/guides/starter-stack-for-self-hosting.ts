import type { Guide } from './types';

const guide: Guide = {
  title: 'Starter Stack for Self-Hosting',
  slug: 'starter-stack-for-self-hosting',
  description:
    'A map of tool categories for a first self-hosted setup. Not a server administration tutorial. Covers what most people actually need and the order in which it makes sense to set things up.',
  type: 'stack',
  updatedDate: '2025-01-15',
  tools: ['Nextcloud', 'Jellyfin', 'Immich', 'Caddy', 'Home Assistant'],
  relatedToolIds: ['nextcloud', 'jellyfin', 'immich', 'bitwarden', 'vaultwarden', 'home-assistant', 'caddy', 'nginx', 'traefik', 'uptime-kuma', 'portainer'],
  relatedCategorySlugs: ['privacy', 'media', 'networking'],
  relatedTags: ['self-hosted', 'privacy-focused', 'multi-user', 'backup', 'synchronization', 'automation'],
  toolLinks: {
    'Caddy': 'caddy',
    'NGINX': 'nginx',
    'Traefik': 'traefik',
    'Nextcloud': 'nextcloud',
    'Jellyfin': 'jellyfin',
    'Immich': 'immich',
    'Bitwarden': 'bitwarden',
    'Vaultwarden': 'vaultwarden',
    'Home Assistant': 'home-assistant',
    'Uptime Kuma': 'uptime-kuma',
    'Portainer': 'portainer',
  },
  body: [
    {
      type: 'paragraph',
      text: 'A self-hosted setup can be as small as one service on a spare machine or as large as a homelab with a dozen containers. This guide is for people starting with little to no experience. It maps the main categories of tools you will likely need and suggests a sensible order for getting started.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Start with a reverse proxy',
    },
    {
      type: 'paragraph',
      text: 'A reverse proxy sits in front of your services and routes incoming traffic to the right container. It also handles SSL certificates. Set this up first, before anything else, so you are not managing ports and HTTP exceptions as you add services.',
    },
    {
      type: 'paragraph',
      text: 'Caddy handles automatic HTTPS via Let\'s Encrypt and has a clean configuration syntax that is easier to learn than NGINX. NGINX is more widely documented and has more community examples. Traefik is Docker-native and works well if you plan to run many containers. All three are in the catalog.',
    },
    {
      type: 'callout',
      text: 'Best for beginners: Caddy. Best for Docker-heavy setups: Traefik. Best for documentation and community resources: NGINX.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Files and sync',
    },
    {
      type: 'paragraph',
      text: 'Nextcloud is the most practical starting point for cloud storage. It handles file sync and sharing across devices, has desktop and mobile clients, and adds calendar, contacts, and document editing through apps. It is more than a file server, which makes it useful but also heavier to set up and maintain.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Media',
    },
    {
      type: 'paragraph',
      text: 'Jellyfin is a media server for organizing and streaming video, music, and other content. It supports user accounts and is accessible from a browser, smart TV apps, and mobile clients. It is beginner-friendly and handles most common media formats without additional configuration.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Photos',
    },
    {
      type: 'paragraph',
      text: 'Immich is the recommended starting point for self-hosted photo backup. It has iOS and Android apps for automatic backup and a web interface for browsing. It requires Docker and more RAM than lighter services, so factor that into hardware planning.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Passwords',
    },
    {
      type: 'paragraph',
      text: 'Bitwarden supports self-hosted deployment and has polished apps for all platforms. It is the most practical self-hosted password manager for most setups. Vaultwarden is a compatible alternative that requires significantly fewer resources.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Monitoring',
    },
    {
      type: 'paragraph',
      text: 'Once you have a few services running, you will want to know when one goes down. Uptime Kuma is the most commonly recommended monitoring tool for small self-hosted setups. Portainer is a Docker management interface that makes container administration easier without the command line.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Home automation',
    },
    {
      type: 'paragraph',
      text: 'Home Assistant is included here because it comes up often in self-hosting discussions, but it is its own category of complexity. If smart home control is not a goal, skip it for now. If it is, it works well alongside the rest of this stack.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'list',
      items: [
        'Set up a reverse proxy (Caddy is the easiest starting point)',
        'Add Nextcloud for files and basic productivity',
        'Add Jellyfin if you have a media library',
        'Add Immich if photo backup is a priority',
        'Add Bitwarden or Vaultwarden for credentials',
        'Add monitoring once the above services are stable',
      ],
    },
    {
      type: 'paragraph',
      text: 'Add one service at a time and understand how each one works before adding the next. The services above each run in Docker and follow similar setup patterns.',
    },
  ],
};

export default guide;
