export type GuideType = 'stack' | 'workflow' | 'guide' | 'alternatives';

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'divider' }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | {
      type: 'video';
      provider: 'youtube' | 'vimeo' | 'peertube';
      videoId?: string;
      url?: string;
      title: string;
      caption?: string;
    };

export interface Guide {
  title: string;
  slug: string;
  description: string;
  type: GuideType;
  updatedDate?: string;
  tools?: string[];
  relatedToolIds?: string[];
  relatedCategorySlugs?: string[];
  relatedTags?: string[];
  body: ContentBlock[];
  /** Maps display name as written in body text → tool ID (in catalog) or null (not in catalog) */
  toolLinks?: Record<string, string | null>;
}
