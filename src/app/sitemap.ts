import type { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase-server';

const BASE = 'https://theopenfinder.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  const [{ data: tools }, { data: categories }] = await Promise.all([
    supabase.from('tools').select('id'),
    supabase.from('categories').select('slug').is('parent_id', null),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${BASE}/tools`,        priority: 0.9, changeFrequency: 'daily'   },
    { url: `${BASE}/categories`,   priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE}/guides`,       priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE}/about`,        priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,      priority: 0.4, changeFrequency: 'yearly'  },
  ];

  const toolRoutes: MetadataRoute.Sitemap = (tools ?? []).map((t) => ({
    url:             `${BASE}/tools/${t.id}`,
    priority:        0.7,
    changeFrequency: 'monthly' as const,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url:             `${BASE}/categories/${c.slug}`,
    priority:        0.6,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes];
}
