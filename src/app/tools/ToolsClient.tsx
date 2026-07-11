'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './tools.module.css';

const PLAT_LABELS: Record<string, string> = {
  linux: 'linux', macos: 'macos', windows: 'win',
  android: 'android', ios: 'ios', web: 'web',
};

const ALL_PLATFORMS = ['linux', 'macos', 'windows', 'web', 'android', 'ios'] as const;

const TAG_TAXONOMY: Record<string, string[]> = {
  hosting:    ['self-hosted', 'cloud', 'local-first', 'offline-capable'],
  privacy:    ['privacy-focused', 'encrypted', 'end-to-end-encryption', 'no-tracking', 'anonymous'],
  technical:  ['cli', 'api', 'extensible', 'plugin-based', 'lightweight'],
  functional: ['real-time', 'collaborative', 'automation', 'synchronization', 'cross-platform',
               'library-management', 'multi-user', 'organization', 'backup'],
  ux:         ['beginner-friendly', 'advanced-users', 'minimalist', 'customizable'],
  domain:     ['markdown', 'llm', 'speech-to-text', 'text-to-speech', 'secure-messaging',
               'email', 'photo-management', 'knowledge-management', 'file-management',
               'database', 'version-control', 'monitoring'],
};

// Derived from TAG_TAXONOMY — stays in sync automatically
const DOMAIN_TAG_SET   = new Set(TAG_TAXONOMY.domain);
const MODIFIER_TAG_SET = new Set([
  ...TAG_TAXONOMY.hosting,
  ...TAG_TAXONOMY.privacy,
  ...TAG_TAXONOMY.ux,
]);

const KNOWN_TAGS     = new Set(Object.values(TAG_TAXONOMY).flat());
const PLATFORM_SLUGS = new Set(['linux', 'macos', 'windows', 'web', 'android', 'ios', 'desktop']);

const EXPLORE_TAGS = [
  'self-hosted', 'privacy-focused', 'local-first', 'encrypted',
  'offline-capable', 'beginner-friendly', 'advanced-users', 'lightweight',
  'extensible', 'customizable', 'collaborative', 'no-tracking',
] as const;

// ═══════════════════════════════════════════════════════════════════
// SEARCH ENGINE — intent-aware, taxonomy-driven, client-side
// ═══════════════════════════════════════════════════════════════════

// Enable in browser console: window.__OF_DEBUG = true
const isDebug = () => typeof window !== 'undefined' && (window as any).__OF_DEBUG;

// ── Token classification ────────────────────────────────────────────
type TokenType = 'platform' | 'modifier' | 'functional' | 'generic' | 'unknown';

const TYPE_WEIGHT: Record<TokenType, number> = {
  platform:   0.3,
  modifier:   0.5,
  functional: 1.0,
  generic:    0.2,  // domain-agnostic words: confirm but don't identify
  unknown:    0.8,
};

const FILLER_SET = new Set([
  'open', 'source', 'free', 'tool', 'app', 'software', 'application',
  'program', 'like', 'similar', 'an', 'the', 'and', 'or', 'for', 'with',
  'using', 'alternative', 'best', 'good', 'great', 'nice',
]);

const PLATFORM_SET = new Set([
  'linux', 'macos', 'mac', 'windows', 'win', 'web', 'android', 'ios',
  'desktop', 'mobile',
]);

const MODIFIER_SET = new Set([
  'self-hosted', 'self', 'hosted', 'privacy', 'private', 'offline',
  'local', 'local-first', 'encrypted', 'secure', 'lightweight', 'minimal',
  'minimalist', 'easy', 'simple', 'cross', 'cross-platform', 'collaborative',
]);

// Domain-agnostic functional words: appear across many tool categories but
// identify no specific domain. Weight (0.2) and exclusion from concept-coverage
// prevent these from dominating when a concept token is present.
// "photo management" → "management" is generic; "photo" drives the concept.
// "video editor" → "editor" is generic; "video" drives the concept.
const GENERIC_SET = new Set([
  // Ownership/action roots
  'manage', 'management',
  'edit', 'editing', 'editor',
  'view', 'viewer',
  'read', 'reader',
  'launch', 'launcher',
  'organize', 'organizer',
  // Tool-role words
  'manager',
  'client',
  'player',
  'assistant',
  'suite',
  'hub',
  'studio',
  'workspace',
  'handler',
]);

// ── Concept map ─────────────────────────────────────────────────────
// Maps user vocabulary → taxonomy targets. Uses ACTUAL slugs from:
//   - taxonomy_tags.csv       → tags[]
//   - taxonomy_categories.csv → subcats[] (parent_id != null)
//                               cats[]    (parent_id == null)
interface TaxonomyTarget {
  tags?:    string[];
  subcats?: string[];
  cats?:    string[];
}

const CONCEPT_MAP: Record<string, TaxonomyTarget> = {
  // ── Photo / image ───────────────────────────────────────────────
  photo:         { tags: ['photo-management'] },
  gallery:       { tags: ['photo-management'] },
  picture:       { tags: ['photo-management'] },
  image:         { subcats: ['image-editing'], tags: ['photo-management'] },

  // ── Note-taking / knowledge ─────────────────────────────────────
  note:          { subcats: ['note-taking', 'knowledge-base'], tags: ['knowledge-management'] },
  notebook:      { subcats: ['note-taking'], tags: ['knowledge-management'] },
  knowledge:     { subcats: ['note-taking', 'knowledge-base'], tags: ['knowledge-management'] },
  wiki:          { subcats: ['knowledge-base'], tags: ['knowledge-management'] },
  journal:       { subcats: ['note-taking'], tags: ['knowledge-management'] },

  // ── Password / secrets ──────────────────────────────────────────
  password:      { subcats: ['password-managers'], cats: ['security'] },
  credential:    { subcats: ['password-managers'] },
  vault:         { subcats: ['password-managers'] },
  secret:        { subcats: ['password-managers'] },

  // ── Email ───────────────────────────────────────────────────────
  email:         { subcats: ['email'], tags: ['email'] },
  mail:          { subcats: ['email'], tags: ['email'] },
  imap:          { subcats: ['email'], tags: ['email'] },
  smtp:          { subcats: ['email'], tags: ['email'] },
  inbox:         { subcats: ['email'], tags: ['email'] },

  // ── File management / storage ───────────────────────────────────
  file:          { subcats: ['file-management', 'file-storage'], tags: ['file-management'] },
  storage:       { subcats: ['file-storage', 'file-management'], tags: ['file-management'] },
  drive:         { subcats: ['file-storage', 'file-management'], tags: ['file-management'] },
  document:      { subcats: ['file-management', 'document-editing'], tags: ['file-management'] },

  // ── Video ───────────────────────────────────────────────────────
  video:         { subcats: ['video-editing'], cats: ['media'] },
  footage:       { subcats: ['video-editing'] },

  // ── Audio ───────────────────────────────────────────────────────
  audio:         { subcats: ['audio-editing', 'music-production'] },
  music:         { subcats: ['music-production', 'audio-editing'] },
  podcast:       { subcats: ['audio-editing'] },
  recording:     { subcats: ['audio-editing', 'screen-recording'] },

  // ── Screen recording ────────────────────────────────────────────
  screen:        { subcats: ['screen-recording'] },
  screenshot:    { subcats: ['screen-recording'] },
  screencast:    { subcats: ['screen-recording'] },

  // ── Streaming ───────────────────────────────────────────────────
  stream:        { subcats: ['streaming'] },
  streaming:     { subcats: ['streaming'] },

  // ── Messaging / chat ────────────────────────────────────────────
  chat:          { subcats: ['messaging'], tags: ['secure-messaging'] },
  messaging:     { subcats: ['messaging'], tags: ['secure-messaging'] },
  message:       { subcats: ['messaging'], tags: ['secure-messaging'] },

  // ── Database ────────────────────────────────────────────────────
  database:      { subcats: ['databases'], tags: ['database'] },
  db:            { subcats: ['databases'], tags: ['database'] },
  sql:           { subcats: ['databases'], tags: ['database'] },

  // ── Version control ─────────────────────────────────────────────
  git:           { subcats: ['version-control'], tags: ['version-control'] },
  code:          { subcats: ['code-editing', 'version-control'] },
  repo:          { subcats: ['version-control'], tags: ['version-control'] },
  repository:    { subcats: ['version-control'], tags: ['version-control'] },
  version:       { subcats: ['version-control'], tags: ['version-control'] },

  // ── Monitoring / analytics ──────────────────────────────────────
  monitoring:    { subcats: ['analytics'], tags: ['monitoring'] },
  monitor:       { subcats: ['analytics'], tags: ['monitoring'] },
  analytics:     { subcats: ['analytics', 'data-visualization'], tags: ['monitoring'] },
  metrics:       { subcats: ['analytics'], tags: ['monitoring'] },
  dashboard:     { subcats: ['analytics', 'data-visualization'], tags: ['monitoring'] },
  logging:       { subcats: ['analytics'], tags: ['monitoring'] },

  // ── Backup / sync ───────────────────────────────────────────────
  backup:        { subcats: ['backup'], tags: ['backup'] },
  sync:          { tags: ['synchronization'] },

  // ── AI / LLM ────────────────────────────────────────────────────
  llm:           { subcats: ['llm-tools', 'local-ai'], tags: ['llm'] },
  ai:            { subcats: ['llm-tools', 'local-ai', 'ai-automation'], tags: ['llm'] },
  model:         { subcats: ['model-management', 'llm-tools'] },

  // ── Speech ──────────────────────────────────────────────────────
  speech:        { tags: ['speech-to-text', 'text-to-speech'] },
  transcription: { tags: ['speech-to-text'] },
  tts:           { tags: ['text-to-speech'] },
  stt:           { tags: ['speech-to-text'] },

  // ── Spreadsheet / Presentation ──────────────────────────────────
  spreadsheet:   { subcats: ['spreadsheet-editing'] },
  presentation:  { subcats: ['presentation-editing'] },
  slides:        { subcats: ['presentation-editing'] },

  // ── Design / Graphics ───────────────────────────────────────────
  vector:        { subcats: ['vector-graphics'] },
  illustration:  { subcats: ['illustration'] },
  prototype:     { subcats: ['ui-ux'] },
  wireframe:     { subcats: ['ui-ux'] },

  // ── Security / Privacy ──────────────────────────────────────────
  vpn:           { subcats: ['vpn'], cats: ['privacy'] },
  browser:       { subcats: ['browsers'], cats: ['privacy'] },
  encryption:    { subcats: ['encryption'], cats: ['security'] },

  // ── Markdown ────────────────────────────────────────────────────
  markdown:      { tags: ['markdown'] },

  // ── Library / collection ────────────────────────────────────────
  library:       { tags: ['library-management'] },
  collection:    { tags: ['library-management'] },
  catalog:       { tags: ['library-management'] },
};

// ── Brand aliases ────────────────────────────────────────────────────
interface BrandAlias {
  pattern:        RegExp;
  conceptTokens:  string[];
  modifierTokens: string[];
}

const BRAND_ALIASES: BrandAlias[] = [
  { pattern: /\bgoogle\s+photos?\b/gi,          conceptTokens: ['photo'],    modifierTokens: ['self-hosted'] },
  { pattern: /\bgoogle\s+drive\b/gi,            conceptTokens: ['file'],     modifierTokens: ['self-hosted'] },
  { pattern: /\bnotion\b/gi,                    conceptTokens: ['note'],     modifierTokens: [] },
  { pattern: /\bphotoshop\b/gi,                 conceptTokens: ['image'],    modifierTokens: [] },
  { pattern: /\bslack\b/gi,                     conceptTokens: ['chat'],     modifierTokens: [] },
  { pattern: /\bgithub\b/gi,                    conceptTokens: ['git'],      modifierTokens: [] },
  { pattern: /\bgitlab\b/gi,                    conceptTokens: ['git'],      modifierTokens: [] },
  { pattern: /\bdropbox\b/gi,                   conceptTokens: ['file'],     modifierTokens: ['sync'] },
  { pattern: /\bevernote\b/gi,                  conceptTokens: ['note'],     modifierTokens: [] },
  { pattern: /1password|\bone\s*password\b/gi,  conceptTokens: ['password'], modifierTokens: [] },
  { pattern: /\blastpass(word)?\b/gi,           conceptTokens: ['password'], modifierTokens: [] },
];

// ── Phrase normalization ─────────────────────────────────────────────
const PHRASE_ALIASES: [RegExp, string][] = [
  [/\bself[-\s]?host(ed|ing)?\b/gi,   'self-hosted'],
  [/\be2ee?\b/gi,                      'end-to-end-encryption'],
  [/\bnote[-\s]?taking\b/gi,           'note'],
  [/\bpassword[-\s]?manager(s)?\b/gi, 'password'],
];

// ── Edit distance (Levenshtein, O(n) space) ──────────────────────────
// Isolated for future "Did you mean?" UI — do not inline elsewhere.
function editDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    prev = curr;
  }
  return prev[b.length];
}

// ── Fuzzy candidates — modular, isolated for future "Did you mean?" ──
// Future UI: just read parsed._fuzzyHints; no other changes needed.
interface FuzzyCandidate {
  token:     string;
  candidate: string;
  distance:  number;
}

function closestFuzzyTerms(token: string): FuzzyCandidate[] {
  if (token.length < 3) return [];
  const threshold = Math.floor((token.length + 2) / 4); // 1 for ≤5 chars, 2 for ≤9, 3 for ≤13
  return Object.keys(CONCEPT_MAP)
    .map(k => ({ token, candidate: k, distance: editDistance(token, k) }))
    .filter(c => c.distance <= threshold && c.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
}

// ── ParsedQuery ──────────────────────────────────────────────────────
interface ParsedQuery {
  tokens:         string[];
  types:          TokenType[];
  weights:        number[];
  conceptTargets: TaxonomyTarget[];
  // Internal: telemetry + fuzzy (prefixed _ to signal non-scoring use)
  _raw:         string;
  _aliasHits:   string[];
  _conceptHits: string[];
  _fuzzyHints:  FuzzyCandidate[];
}

function parseQuery(raw: string): ParsedQuery {
  let q = raw.toLowerCase().trim();

  // 1. Brand alias detection: inject synthetic tokens, strip match
  const injectedConcept:  string[] = [];
  const injectedModifier: string[] = [];
  const _aliasHits:       string[] = [];
  for (const alias of BRAND_ALIASES) {
    if (alias.pattern.test(q)) {
      injectedConcept.push(...alias.conceptTokens);
      injectedModifier.push(...alias.modifierTokens);
      _aliasHits.push(alias.pattern.source);
      q = q.replace(alias.pattern, ' ');
    }
    alias.pattern.lastIndex = 0;
  }

  // 2. Phrase normalization
  for (const [re, replacement] of PHRASE_ALIASES) q = q.replace(re, replacement);

  // 3. Tokenize + light stemming (strip trailing -s from 5+ char words)
  const rawTokens = q
    .split(/[\s,;:]+/)
    .filter(t => t.length >= 2)
    .map(t => t.endsWith('s') && t.length > 4 ? t.slice(0, -1) : t);

  // 4. Combine, deduplicate, remove fillers
  const all  = [...new Set([...injectedConcept, ...injectedModifier, ...rawTokens])];
  const kept = all.filter(t => !FILLER_SET.has(t));

  // 5. Classify each token
  const tokens:         string[]         = [];
  const types:          TokenType[]      = [];
  const weights:        number[]         = [];
  const conceptTargets: TaxonomyTarget[] = [];

  for (const t of kept) {
    let type: TokenType;
    if (MODIFIER_SET.has(t) || injectedModifier.includes(t)) {
      type = 'modifier';
    } else if (PLATFORM_SET.has(t)) {
      type = 'platform';
    } else if (CONCEPT_MAP[t] !== undefined || injectedConcept.includes(t)) {
      type = 'functional';
    } else if (GENERIC_SET.has(t)) {
      type = 'generic';  // classified after functional — CONCEPT_MAP entries are never demoted
    } else {
      type = 'unknown';
    }
    tokens.push(t);
    types.push(type);
    weights.push(TYPE_WEIGHT[type]);
    conceptTargets.push(CONCEPT_MAP[t] ?? {});
  }

  const _conceptHits = tokens.filter((t, i) => types[i] === 'functional' && CONCEPT_MAP[t] !== undefined);

  const _fuzzyHints: FuzzyCandidate[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (types[i] === 'unknown') _fuzzyHints.push(...closestFuzzyTerms(tokens[i]));
  }

  if (isDebug()) {
    console.group(`[OF] parseQuery("${raw}")`);
    if (_aliasHits.length)   console.log('aliases:', _aliasHits);
    if (_conceptHits.length) console.log('concepts:', _conceptHits);
    if (_fuzzyHints.length)  console.log('fuzzy hints:', _fuzzyHints);
    tokens.forEach((t, i) =>
      console.log(`  "${t}" [${types[i]}] w=${weights[i]}`, conceptTargets[i])
    );
    console.groupEnd();
  }

  return { tokens, types, weights, conceptTargets, _raw: raw, _aliasHits, _conceptHits, _fuzzyHints };
}

// ── Subsequence fuzzy match ──────────────────────────────────────────
function isSubsequence(needle: string, haystack: string): boolean {
  let ni = 0;
  for (let hi = 0; hi < haystack.length && ni < needle.length; hi++) {
    if (haystack[hi] === needle[ni]) ni++;
  }
  return ni === needle.length;
}

// ── Telemetry ─────────────────────────────────────────────────────────
// Structured event hooks for future Plausible / PostHog integration.
// Events are buffered in window.__OF_TELEMETRY (capped at 50).
// No personal data; no user identity tracked.

type TelemetrySearchEvent = {
  type:        'search';
  rawQuery:    string;
  tokens:      string[];
  tokenTypes:  TokenType[];
  resultCount: number;
  aliasHits:   string[];
  conceptHits: string[];
};

type TelemetryClickEvent = {
  type:     'tool_click';
  toolId:   string;
  toolName: string;
  query:    string;
  position: number;
};

type TelemetryNoResultEvent = {
  type:     'no_results';
  rawQuery: string;
  tokens:   string[];
};

type TelemetryEvent = TelemetrySearchEvent | TelemetryClickEvent | TelemetryNoResultEvent;

function emitTelemetry(event: TelemetryEvent): void {
  if (isDebug()) console.log('[OF:telemetry]', event);
  if (typeof window !== 'undefined') {
    const w = window as any;
    w.__OF_TELEMETRY = w.__OF_TELEMETRY ?? [];
    w.__OF_TELEMETRY.push({ ...event, ts: Date.now() });
    if (w.__OF_TELEMETRY.length > 50) w.__OF_TELEMETRY.shift();
    w.plausible?.(event.type, { props: event });
    w.umami?.track(event.type, event);
  }
}

// ── Contradiction rules ───────────────────────────────────────────────
// Extensible penalty layer: reduces scores for tools that contradict
// explicit user intent. Add new rules here without touching scoring logic.
// Penalties are multiplicative — keep factors in [0.0, 1.0].

interface ContradictionRule {
  triggers: string[];
  penalize: (tool: ToolRow) => number;
}

const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    // offline / local intent → strongly penalize web-only tools
    triggers: ['offline', 'local', 'local-first'],
    penalize: (tool) => {
      const plats = tool.platforms ?? [];
      if (plats.length === 1 && plats[0] === 'web') return 0.10;
      const tags = tool.tagNames.map(t => t.toLowerCase());
      if (tags.includes('cloud') &&
          !tags.includes('offline-capable') &&
          !tags.includes('local-first')) return 0.35;
      return 1.0;
    },
  },
  {
    // self-hosted intent → penalize tools explicitly not self-hostable
    triggers: ['self-hosted', 'self', 'hosted'],
    penalize: (tool) => tool.self_hosted === false ? 0.15 : 1.0,
  },
  {
    // privacy intent → gently penalize cloud-centric tools without privacy signals
    triggers: ['privacy', 'private'],
    penalize: (tool) => {
      const tags = new Set(tool.tagNames.map(t => t.toLowerCase()));
      if (tags.has('privacy-focused') || tags.has('encrypted') ||
          tags.has('no-tracking')     || tags.has('end-to-end-encryption')) return 1.0;
      if (tags.has('cloud')) return 0.55;
      return 1.0;
    },
  },
];

function applyContradictionPenalties(parsed: ParsedQuery, tool: ToolRow): number {
  let factor = 1.0;
  for (const rule of CONTRADICTION_RULES) {
    if (rule.triggers.some(t => parsed.tokens.includes(t))) {
      factor *= rule.penalize(tool);
    }
  }
  return factor;
}

// ── Per-token, per-tool scorer ───────────────────────────────────────
// Scoring hierarchy (approximate raw peaks before weight × coverage):
//   name exact              +100  functional/unknown
//   subcat via concept       +50  functional only
//   name prefix              +60  functional/unknown
//   domain tag via concept   +45  functional only
//   name contains            +40  functional/unknown
//   normal tag via concept   +38  functional only
//   cat via concept          +20  functional only
//   domain tag direct        +38  functional/unknown
//   subcat direct            +18  functional/unknown
//   normal tag direct        +22  functional/unknown
//   cat direct               +12  functional/unknown
//   description              +8   functional/unknown
//   --- generics bypass taxonomy (early return) ---
//   generic name exact       +20  × 0.2 weight = 4 max
//   generic name contains    +12  × 0.2 weight = 2.4 max
//   generic description      +5   × 0.2 weight = 1 max
function scoreToken(
  token: string,
  type: TokenType,
  conceptTarget: TaxonomyTarget,
  tool: ToolRow,
): number {
  const nameLower = tool.name.toLowerCase();
  const descLower = (tool.description ?? '').toLowerCase();
  const tags      = tool.tagNames;

  let score = 0;

  // — Generic tokens: bypass taxonomy expansion and subcategory slug matching.
  // Without this, "editor" would hit "code-editing".includes("editor"),
  // "manager" would hit "password-managers".includes("manager"), etc. —
  // falsely surfacing every editing/management tool for any concept query.
  // Generics only score on literal name/description text, never on taxonomy slugs.
  if (type === 'generic') {
    if (nameLower === token)       return 20;
    if (nameLower.includes(token)) return 12;
    if (descLower.includes(token)) return 5;
    return 0;
  }

  // — Name
  if (nameLower === token)                                                            score += 100;
  else if (nameLower.startsWith(token))                                               score += 60;
  else if (nameLower.includes(token))                                                 score += 40;
  else if (token.length >= 3 && isSubsequence(token, nameLower.replace(/\s/g, '')))  score += 15;

  // — Concept expansion: subcategory (strongest taxonomy signal)
  for (const targetSubcat of (conceptTarget.subcats ?? [])) {
    if (tool.subcatSlugs.includes(targetSubcat)) {
      score += 50;
    } else {
      const root = targetSubcat.split('-')[0];
      if (tool.subcatSlugs.some(s => s.startsWith(root))) score += 12;
    }
  }

  // — Concept expansion: parent category (broad signal)
  for (const targetCat of (conceptTarget.cats ?? [])) {
    if (tool.categorySlugs.includes(targetCat)) score += 20;
  }

  // — Concept expansion: tag — domain tags score higher than general tags
  for (const targetTag of (conceptTarget.tags ?? [])) {
    const isDomain = DOMAIN_TAG_SET.has(targetTag);
    if (tags.some(t => t.toLowerCase() === targetTag)) {
      score += isDomain ? 45 : 38;
    } else {
      const root = targetTag.split('-')[0];
      if (tags.some(t => t.toLowerCase().includes(root))) score += isDomain ? 12 : 10;
    }
  }

  // — Direct tag match: weighted by tag type
  //   domain tags (functional domains) score near-subcat strength
  //   modifier tags (traits/capabilities) score low — they refine, not identify
  for (const tag of tags) {
    const tl = tag.toLowerCase();
    if (tl === token) {
      if      (DOMAIN_TAG_SET.has(tl))   score += 38;
      else if (MODIFIER_TAG_SET.has(tl)) score += 10;
      else                               score += 22;
      break;
    }
    if (tl.includes(token)) {
      if      (DOMAIN_TAG_SET.has(tl))   score += 18;
      else if (MODIFIER_TAG_SET.has(tl)) score += 6;
      else                               score += 12;
      break;
    }
  }

  // — Direct subcategory match
  for (const sub of tool.subcatSlugs) {
    if (sub === token)       { score += 18; break; }
    if (sub.includes(token)) { score += 8;  break; }
  }

  // — Direct parent category match
  for (const cat of tool.categorySlugs) {
    if (cat === token)       { score += 12; break; }
    if (cat.includes(token)) { score += 6;  break; }
  }

  // — Description (lowest-weight field)
  if (descLower.includes(token)) score += 8;

  // — Platform tokens: check platforms array directly
  if (type === 'platform') {
    const platNorm: Record<string, string> = { mac: 'macos', win: 'windows' };
    if ((tool.platforms ?? []).includes(platNorm[token] ?? token)) score += 25;
  }

  return score;
}

// ── Coverage multiplier ──────────────────────────────────────────────
// "Meaningful" tokens are those that determine domain intent:
//   - functional (concept tokens) and unknown always count
//   - generic counts only when NO concept token is present
//     → prevents "management" from inflating coverage for non-photo tools
//       on a "photo management" query
//   - modifier and platform never count (they refine, don't identify)
function coverageMultiplier(types: TokenType[], matchedIdx: Set<number>): number {
  const hasConcept = types.some(t => t === 'functional');

  const isMeaningful = (t: TokenType) =>
    t === 'functional' || t === 'unknown' || (t === 'generic' && !hasConcept);

  const meaningfulTotal = types.filter(isMeaningful).length;

  if (meaningfulTotal === 0) {
    const frac = types.length > 0 ? matchedIdx.size / types.length : 0;
    return frac >= 0.5 ? 1.0 : 0.4;
  }

  const meaningfulMatched = types.filter(
    (t, i) => isMeaningful(t) && matchedIdx.has(i)
  ).length;

  const frac = meaningfulMatched / meaningfulTotal;
  if (frac >= 1.0)  return 2.5;
  if (frac >= 0.67) return 1.5;
  if (frac >= 0.5)  return meaningfulTotal <= 2 ? 0.25 : 1.0;
  if (frac >  0)    return 0.2;
  return 0.15;
}

// ── Diversity balancing ──────────────────────────────────────────────
// Single-pass subcategory penalty to prevent near-duplicate clustering.
// Processes tools in score order; penalizes later occurrences of the same
// subcat/domain-tag. Re-sorts once — relevance remains primary.
function diversifyResults(sorted: Array<{ tool: ToolRow; score: number }>): ToolRow[] {
  if (sorted.length <= 5) return sorted.map(s => s.tool);

  const seenSubcats    = new Map<string, number>();
  const seenDomainTags = new Map<string, number>();

  const adjusted = sorted.map(({ tool, score }) => {
    let penalty = 1.0;

    for (const sub of tool.subcatSlugs) {
      const n = seenSubcats.get(sub) ?? 0;
      if (n >= 2) penalty *= 0.75;
      else if (n === 1) penalty *= 0.88;
    }

    for (const tag of tool.tagNames) {
      const tl = tag.toLowerCase();
      if (DOMAIN_TAG_SET.has(tl)) {
        const n = seenDomainTags.get(tl) ?? 0;
        if (n >= 3) penalty *= 0.92;
      }
    }

    for (const sub of tool.subcatSlugs) {
      seenSubcats.set(sub, (seenSubcats.get(sub) ?? 0) + 1);
    }
    for (const tag of tool.tagNames) {
      const tl = tag.toLowerCase();
      if (DOMAIN_TAG_SET.has(tl)) seenDomainTags.set(tl, (seenDomainTags.get(tl) ?? 0) + 1);
    }

    return { tool, adjustedScore: score * penalty };
  });

  return adjusted
    .sort((a, b) => b.adjustedScore - a.adjustedScore)
    .map(s => s.tool);
}

// ── Main scorer ──────────────────────────────────────────────────────
function scoreSearch(parsed: ParsedQuery, tool: ToolRow): number {
  const { tokens, types, weights, conceptTargets } = parsed;
  if (tokens.length === 0) return 0;

  let total = 0;
  const matchedIdx = new Set<number>();

  for (let i = 0; i < tokens.length; i++) {
    const raw = scoreToken(tokens[i], types[i], conceptTargets[i], tool);
    if (raw > 0) {
      total += raw * weights[i];
      matchedIdx.add(i);
    }
  }

  const baseScore = total * coverageMultiplier(types, matchedIdx);
  return baseScore * applyContradictionPenalties(parsed, tool);
}

// ─── Data types ────────────────────────────────────────────────────

export interface ToolRow {
  id: string;
  name: string;
  description: string | null;
  license: string | null;
  platforms: string[] | null;
  difficulty: string | null;
  self_hosted: boolean | null;
  year_started: number | null;
  tagNames: string[];
  categorySlugs: string[];
  subcatSlugs: string[];
}

export default function ToolsClient({ tools }: { tools: ToolRow[] }) {
  const [query,     setQuery]     = useState('');
  const [platforms, setPlatforms] = useState<Set<string>>(new Set());
  const [sort,      setSort]      = useState<'name' | 'year'>('name');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagsOpen,  setTagsOpen]  = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isFiltered = query.length > 0 || platforms.size > 0 || activeTag !== null;

  useEffect(() => {
    if (!tagsOpen) return;
    function onMouseDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setTagsOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [tagsOpen]);

  function togglePlatform(p: string) {
    setPlatforms(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  }

  function selectTag(tag: string) {
    setActiveTag(prev => prev === tag ? null : tag);
    setTagsOpen(false);
  }

  function clearAll() {
    setQuery('');
    setPlatforms(new Set());
    setActiveTag(null);
  }

  const allToolTags = useMemo(() => {
    const set = new Set<string>();
    for (const tool of tools) for (const t of tool.tagNames) set.add(t);
    return set;
  }, [tools]);

  const groupedTags = useMemo(() => {
    const groups: { label: string; tags: string[] }[] = [];
    for (const [group, tags] of Object.entries(TAG_TAXONOMY)) {
      const present = tags.filter(t => allToolTags.has(t));
      if (present.length > 0) groups.push({ label: group, tags: present });
    }
    const other = [...allToolTags].filter(t => !KNOWN_TAGS.has(t) && !PLATFORM_SLUGS.has(t));
    if (other.length > 0) {
      console.warn('[OpenFinder] Tags not in taxonomy_tags.csv:', other);
      groups.push({ label: 'other', tags: other.sort() });
    }
    return groups;
  }, [allToolTags]);

  const filtered = useMemo(() => {
    const pool = tools.filter(tool => {
      if (platforms.size > 0) {
        const tp = tool.platforms ?? [];
        if (!tp.some(p => platforms.has(p))) return false;
      }
      if (activeTag && !tool.tagNames.includes(activeTag)) return false;
      return true;
    });

    const q = query.trim();
    if (q) {
      const parsed = parseQuery(q);

      if (parsed.tokens.length === 0) {
        return sort === 'year'
          ? [...pool].sort((a, b) => (b.year_started ?? 0) - (a.year_started ?? 0))
          : [...pool].sort((a, b) => a.name.localeCompare(b.name));
      }

      const scored = pool.map(tool => ({ tool, score: scoreSearch(parsed, tool) }));

      if (isDebug()) {
        const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 10);
        console.table(top.map(x => ({ name: x.tool.name, score: +x.score.toFixed(1) })));
      }

      const aboveThreshold = scored
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

      // Telemetry side-effect: no state update, safe inside useMemo
      if (aboveThreshold.length === 0) {
        emitTelemetry({ type: 'no_results', rawQuery: q, tokens: parsed.tokens });
        return [];
      }

      emitTelemetry({
        type:        'search',
        rawQuery:    q,
        tokens:      parsed.tokens,
        tokenTypes:  parsed.types,
        resultCount: aboveThreshold.length,
        aliasHits:   parsed._aliasHits,
        conceptHits: parsed._conceptHits,
      });

      return diversifyResults(aboveThreshold);
    }

    return sort === 'year'
      ? [...pool].sort((a, b) => (b.year_started ?? 0) - (a.year_started ?? 0))
      : [...pool].sort((a, b) => a.name.localeCompare(b.name));
  }, [tools, query, platforms, sort, activeTag]);

  const fuzzyFallback = useMemo(() => {
    const q = query.trim();
    if (!q || filtered.length > 0) return [];
    const parsed = parseQuery(q);
    return tools
      .map(tool => ({ tool, score: scoreSearch(parsed, tool) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(({ score }) => score > 0)
      .map(({ tool }) => tool);
  }, [query, filtered, tools]);

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>

        <input
          className={styles.search}
          type="text"
          placeholder="search tools, descriptions, tags…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />

        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            {ALL_PLATFORMS.map(p => (
              <button
                key={p}
                className={`${styles.pill} ${platforms.has(p) ? styles.pillActive : ''}`}
                onClick={() => togglePlatform(p)}
              >
                {p === 'windows' ? 'win' : p}
              </button>
            ))}
          </div>

          <span className={styles.filterSep} />

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>sort</span>
            <button
              className={`${styles.sortBtn} ${sort === 'name' ? styles.sortActive : ''}`}
              onClick={() => setSort('name')}
            >a–z</button>
            <button
              className={`${styles.sortBtn} ${sort === 'year' ? styles.sortActive : ''}`}
              onClick={() => setSort('year')}
            >newest</button>
          </div>

          <span className={styles.resultCount}>{filtered.length} tools</span>
          {isFiltered && (
            <button className={styles.clearBtn} onClick={clearAll}>clear ×</button>
          )}
        </div>

        <div className={styles.exploreRow}>
          <span className={styles.exploreLabel}>explore</span>

          <div className={styles.exploreTags}>
            {EXPLORE_TAGS.filter(t => allToolTags.has(t)).map(tag => (
              <button
                key={tag}
                className={`${styles.tagChip} ${activeTag === tag ? styles.tagChipActive : ''}`}
                onClick={() => selectTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className={styles.allTagsWrapper} ref={popoverRef}>
            <button
              className={`${styles.allTagsBtn} ${tagsOpen ? styles.allTagsBtnOpen : ''}`}
              onClick={() => setTagsOpen(prev => !prev)}
            >
              more {tagsOpen ? '↑' : '↓'}
            </button>

            {tagsOpen && (
              <div className={styles.tagsPopover}>
                {groupedTags.map(({ label, tags }) => (
                  <div key={label} className={styles.tagGroup}>
                    <span className={styles.tagGroupLabel}>{label}</span>
                    <div className={styles.tagGroupItems}>
                      {tags.map(tag => (
                        <button
                          key={tag}
                          className={`${styles.tagChip} ${activeTag === tag ? styles.tagChipActive : ''}`}
                          onClick={() => selectTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeTag && (
          <div className={styles.activeTagRow}>
            <span className={styles.activeTagLabel}>tag: {activeTag}</span>
            <button className={styles.clearBtn} onClick={() => setActiveTag(null)}>clear ×</button>
          </div>
        )}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((tool, idx) => (
            <a
              key={tool.id}
              href={`/tools/${tool.id}`}
              className={styles.card}
              onClick={() => emitTelemetry({
                type: 'tool_click', toolId: tool.id, toolName: tool.name, query, position: idx,
              })}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{tool.name}</span>
                {tool.year_started && (
                  <span className={styles.cardYear}>{tool.year_started}</span>
                )}
              </div>

              {tool.description && (
                <p className={styles.cardDesc}>{tool.description.replace(/\s+/g, ' ').trim()}</p>
              )}

              {tool.platforms && tool.platforms.length > 0 && (
                <div className={styles.cardPlatforms}>
                  {tool.platforms.map(p => (
                    <span key={p} className={styles.cardPlatform}>
                      {PLAT_LABELS[p] ?? p}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.cardMeta}>
                {tool.license    && <span className={styles.cardLicense}>{tool.license}</span>}
                {tool.self_hosted && <span className={styles.cardSelfHosted}>self-hosted</span>}
                <span className={styles.cardArrow}>→</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          {query.trim() ? (
            <>
              <p className={styles.emptyText}>no exact matches for &ldquo;{query.trim()}&rdquo;.</p>
              {(platforms.size > 0 || activeTag) && (
                <p className={styles.emptyHint}>try removing some filters.</p>
              )}
              {fuzzyFallback.length > 0 && (
                <>
                  <p className={styles.emptyHint}>did you mean:</p>
                  <div className={styles.fuzzyRow}>
                    {fuzzyFallback.map(tool => (
                      <a key={tool.id} href={`/tools/${tool.id}`} className={styles.fuzzyItem}>
                        {tool.name}
                      </a>
                    ))}
                  </div>
                </>
              )}
              <div className={styles.emptyActions}>
                <button className={styles.clearBtn} onClick={clearAll}>clear search</button>
                <a href="/categories" className={styles.emptyActionLink}>browse categories →</a>
                <a href="/contact"    className={styles.emptyActionLink}>suggest a tool →</a>
              </div>
            </>
          ) : (
            <>
              <p className={styles.emptyText}>no tools match these filters.</p>
              <div className={styles.emptyActions}>
                <button className={styles.clearBtn} onClick={clearAll}>clear filters</button>
                <a href="/categories" className={styles.emptyActionLink}>browse categories →</a>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
