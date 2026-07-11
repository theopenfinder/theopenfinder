import type { Guide } from './types';

const guide: Guide = {
  title: 'Notion Alternatives',
  slug: 'notion-alternatives',
  description:
    'Notes, knowledge bases, team wikis, and workspace tools. Notion covers a wide surface area. The alternatives do not all cover the same ground, so the right choice depends heavily on what you actually use Notion for.',
  type: 'alternatives',
  updatedDate: '2025-01-15',
  tools: ['Logseq', 'Joplin', 'MediaWiki', 'BookStack', 'AppFlowy'],
  relatedToolIds: ['logseq', 'joplin', 'mediawiki', 'nextcloud', 'onlyoffice', 'bookstack', 'appflowy', 'affine'],
  relatedCategorySlugs: ['productivity'],
  relatedTags: ['knowledge-management', 'self-hosted', 'local-first', 'markdown', 'collaborative', 'multi-user'],
  toolLinks: {
    'Logseq': 'logseq',
    'Joplin': 'joplin',
    'MediaWiki': 'mediawiki',
    'Nextcloud': 'nextcloud',
    'OnlyOffice': 'onlyoffice',
    'BookStack': 'bookstack',
    'AppFlowy': 'appflowy',
    'AFFiNE': 'affine',
  },
  body: [
    {
      type: 'paragraph',
      text: 'Notion is a broad product: it handles personal notes, project tracking, team wikis, and lightweight databases all in one place. Most open tools specialize in one of these areas and do not replicate the full package. Before picking an alternative, it helps to decide which part of Notion you rely on most.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Personal notes and knowledge management',
    },
    {
      type: 'paragraph',
      text: 'Logseq is an outliner-based note-taking tool that organizes information through linked pages and blocks. It stores notes as local Markdown or Org files, which makes it easy to back up and version-control. It works well for personal knowledge graphs and daily notes, but the outliner format is not for everyone.',
    },
    {
      type: 'paragraph',
      text: 'Joplin is a note-taking app that stores notes in Markdown with optional end-to-end encrypted sync across devices. It is simpler in scope than Logseq, closer to a personal note archive with good organization. It lacks the linked-thinking features but is easier to pick up.',
    },
    {
      type: 'callout',
      text: 'Best for personal notes and PKM: Logseq if you want linked thinking and outlining. Joplin if you want straightforward notes with sync.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Team wikis and knowledge bases',
    },
    {
      type: 'paragraph',
      text: 'MediaWiki is the software behind Wikipedia. It handles large, structured, collaboratively edited knowledge bases well. It has a steep setup curve and the editing syntax is not beginner-friendly, but it scales reliably and has a large extension ecosystem.',
    },
    {
      type: 'paragraph',
      text: 'BookStack is widely recommended for team wikis and internal documentation. It uses a book-chapter structure that works well for organized documentation.',
    },
    {
      type: 'callout',
      text: 'Best for team wikis: MediaWiki for large or formal knowledge bases. BookStack for smaller teams wanting a structured, book-chapter setup.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Block-based workspaces',
    },
    {
      type: 'paragraph',
      text: 'AppFlowy and AFFiNE aim to replicate the Notion block-based workspace experience more directly, including page nesting, databases, and collaborative editing. AppFlowy is local-first and written in Rust and Flutter. AFFiNE takes a more experimental approach, combining whiteboard and document editing. Both are now in the catalog.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Documents and collaboration',
    },
    {
      type: 'paragraph',
      text: 'If the part of Notion you use most is collaborative document editing, Nextcloud with OnlyOffice covers real-time document editing without a hosted third-party service. It is not a Notion replacement in terms of structure or databases, but it handles the document-creation side well.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'paragraph',
      text: 'Identify your primary Notion use case first. Personal notes: try Joplin or Logseq. Team wiki: try MediaWiki or BookStack. Block-based workspace: try AppFlowy or AFFiNE. No single tool replaces all of Notion, and that is worth accepting before you start.',
    },
  ],
};

export default guide;
