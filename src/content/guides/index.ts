import type { Guide } from './types';
import deGoogle from './de-google';
import googlePhotosAlternatives from './google-photos-alternatives';
import notionAlternatives from './notion-alternatives';
import selfHostedPasswordManagers from './self-hosted-password-managers';
import starterStackForSelfHosting from './starter-stack-for-self-hosting';
import designToolsForOpenSourceWorkflows from './design-tools-for-open-source-workflows';
import openSource101 from './open-source-101';
import debloatYourPc from './debloat-your-pc';
import swapNowStack from './swap-now-stack';

export const guides: Guide[] = [
  openSource101,
  debloatYourPc,
  swapNowStack,
  deGoogle,
  googlePhotosAlternatives,
  notionAlternatives,
  selfHostedPasswordManagers,
  starterStackForSelfHosting,
  designToolsForOpenSourceWorkflows,
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}
