import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LeadForm } from '@/components/LeadForm';

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const reviews = await prisma.review.findMany({ take: 3, orderBy: { createdAt: 'desc' } });

  return (
    <main>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="text-xl font-black">АстраханьМастер</div>
          <nav className="hidden gap-5 text-sm text-slate-600 md:flex">
            <a href="#services">Услуги</a>
            <a href="#how">Как работаем</a>
            <Link href="/login">Личный кабинет</Link>
            <Link href="/admin">Админка</Link>
          </nav>
          <a href="tel:+79000000000" className="font-bold text-brand-600">+7 (900) 000-00-00</a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            Мастера по ремонту в Астрахани
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
            Мастера по ремонту в Астрахани — вызов в день заявки
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Быстрая помощь по сантехнике, электрике, ремонту стиральных машин и холодильников.
            Оставьте заявку бесплатно — мы свяжем вас с мастером в течение 15 минут.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a href="tel:+79000000000" className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white shadow-soft">
              Позвонить +7 (900) 000-00-00
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-2xl font-black text-brand-600">15 мин</div>
              <div className="text-sm text-slate-600">Среднее время ответа</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-2xl font-black text-brand-600">4</div>
              <div className="text-sm text-slate-600">Категории услуг</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-2xl font-black text-brand-600">3–5</div>
              <div className="text-sm text-slate-600">Мастеров на категорию</div>
            </div>
          </div>
        </div>

        <div>
          <LeadForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
      </section>

      <section id="services" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-black">Категории услуг</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/uslugi/${category.slug}`}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200"
              >
                <div className="text-4xl">{category.icon}</div>
                <div className="mt-4 text-xl font-bold">{category.name}</div>
                <div className="mt-2 text-sm text-slate-600">от {category.basePriceFrom} ₽</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black">Как мы работаем</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {['Оставьте заявку', 'Мы связываемся с вами', 'Мастер приезжает в удобное время'].map((step, i) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 font-black text-brand-700">
                {i + 1}
              </div>
              <div className="text-xl font-bold">{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-black">Отзывы</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-slate-700 bg-slate-800 p-5">
                <div className="text-yellow-400">★★★★★</div>
                <p className="mt-4 text-slate-200">“{review.text}”</p>
                <div className="mt-4 font-bold">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-slate-700">
        <h2 className="text-3xl font-black">SEO-текст</h2>
        <div className="mt-6 space-y-4">
          <p>
            Сантехника, электрика и ремонт бытовой техники в Астрахани — всё это можно быстро найти на АстраханьМастер.
            Мы помогаем клиентам оставить заявку на ремонт, а мастерам подключаться к новым заказам без лишней бюрократии.
          </p>
          <p>
            Если вам нужен ремонт в Астрахани — оставьте заявку на сайте или позвоните по номеру. Мы подберём специалиста,
            поможем уточнить проблему и согласовать время визита в день обращения.
          </p>
        </div>
      </section>
    </main>
  );
}
