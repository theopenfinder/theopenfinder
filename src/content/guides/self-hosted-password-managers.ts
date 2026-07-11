import type { Guide } from './types';

const guide: Guide = {
  title: 'Self-Hosted Password Managers',
  slug: 'self-hosted-password-managers',
  description:
    'Password managers and credential tools for self-hosted or local-first setups. Covers the most practical options and the tradeoffs between server-based and offline approaches.',
  type: 'guide',
  updatedDate: '2025-01-15',
  tools: ['Bitwarden', 'KeePassXC'],
  relatedToolIds: ['bitwarden', 'keepassxc', 'vaultwarden', 'passbolt', 'psono', 'padloc'],
  relatedCategorySlugs: ['security'],
  relatedTags: ['self-hosted', 'encrypted', 'end-to-end-encryption', 'privacy-focused', 'local-first', 'offline-capable'],
  toolLinks: {
    'Bitwarden': 'bitwarden',
    'Vaultwarden': 'vaultwarden',
    'KeePassXC': 'keepassxc',
    'Nextcloud': 'nextcloud',
    'Syncthing': 'syncthing',
    'Passbolt': 'passbolt',
    'Psono': 'psono',
    'Padloc': 'padloc',
  },
  body: [
    {
      type: 'paragraph',
      text: 'Self-hosting a password manager puts you in control of where credentials are stored and who can access the vault. The tradeoff is that you are also responsible for keeping the server updated, backed up, and available. This guide covers the most practical options for personal and small-team use.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Bitwarden',
    },
    {
      type: 'paragraph',
      text: "Bitwarden is the most widely used self-hosted password manager. It has polished apps for every major platform, browser extensions, and a clean web interface. The official self-hosted server is open source and can be run via Docker. It uses end-to-end encryption, so even the server operator cannot read vault contents.",
    },
    {
      type: 'paragraph',
      text: 'Vaultwarden is an unofficial Bitwarden-compatible server implementation written in Rust. It is significantly lighter on resources than the official server, making it practical to run on a Raspberry Pi or small VPS. It is a widely used resource-efficient alternative to the official Bitwarden server.',
    },
    {
      type: 'callout',
      text: 'Best for most people: Bitwarden (official server) for full support and stability. Vaultwarden for resource-constrained self-hosting where official server requirements are too high.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'KeePassXC',
    },
    {
      type: 'paragraph',
      text: 'KeePassXC is a local, offline password manager. Credentials are stored in an encrypted .kdbx file that lives on your machine, not on a server. There is no sync built in, but the vault file can be synced across devices using Nextcloud, Syncthing, or any file sync tool. It works well for people who want no server dependency at all.',
    },
    {
      type: 'callout',
      text: 'Best for: people who want a fully local vault with no server. Sync is manual but straightforward.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Team credential sharing',
    },
    {
      type: 'paragraph',
      text: 'Passbolt and Psono are oriented toward team and enterprise credential sharing, with role-based access, shared vaults, and audit logging. Padloc is a simpler cross-platform option for individuals and small teams. All three are in the catalog.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'A note on security and maintenance',
    },
    {
      type: 'paragraph',
      text: 'Self-hosting a password manager shifts certain risks onto you. Keep the server software updated: password managers are high-value targets. Maintain regular encrypted backups of the vault database and store them somewhere separate from the primary server. Test your recovery process before you need it. If you lose the master password and have no backup, the vault contents are gone.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: "If you want a full server with apps and browser extensions, start with Bitwarden. If hardware resources are limited, look at Vaultwarden. If you want no server at all, KeePassXC with a synced vault file is the simplest path. Set up backups before you start migrating credentials.",
    },
  ],
};

export default guide;
