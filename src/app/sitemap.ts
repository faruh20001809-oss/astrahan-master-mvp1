import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } });

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...categories.map((category) => ({
      url: `${base}/uslugi/${category.slug}`,
      lastModified: category.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
