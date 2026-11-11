import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LeadForm } from '@/components/LeadForm';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });

  if (!category) return {};

  return {
    title: category.seoTitle,
    description: category.seoDescription
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { subcategories: true }
  });

  if (!category) notFound();

  return (
    <main>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="/" className="text-xl font-black">АстраханьМастер</a>
          <a href="tel:+79000000000" className="font-bold text-brand-600">+7 (900) 000-00-00</a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">{category.name}</span>
          <h1 className="mt-4 text-4xl font-black leading-tight">{category.seoTitle}</h1>
          <p className="mt-4 text-lg text-slate-600">{category.seoDescription}</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Цена от</div>
            <div className="mt-2 text-3xl font-black text-brand-600">{category.basePriceFrom} ₽</div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Популярные работы</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <span key={sub.id} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <LeadForm categories={[{ slug: category.slug, name: category.name }]} defaultCategory={category.slug} />
        </div>
      </section>
    </main>
  );
}
