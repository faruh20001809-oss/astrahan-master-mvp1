'use client';
import { useState } from 'react';

type Category = { slug: string; name: string };

export function LeadForm({ categories, defaultCategory }: { categories: Category[]; defaultCategory?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ошибка');
      setSent(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-soft">
        <h3 className="text-2xl font-black text-emerald-700">Мы перезвоним в течение 15 минут</h3>
        <p className="mt-2 text-sm text-emerald-700">Заявка принята. Оператор свяжется с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
      <div className="grid gap-4">
        <label className="block text-sm font-bold">
          Имя
          <input required name="name" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="Иван" />
        </label>

        <label className="block text-sm font-bold">
          Телефон
          <input required name="phone" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="+7 900 000-00-00" />
        </label>

        <label className="block text-sm font-bold">
          Категория
          <select name="category" defaultValue={defaultCategory || categories[0]?.slug} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold">
          Район
          <select name="district" defaultValue="Трусовский" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <option>Трусовский</option>
            <option>Ленинский</option>
            <option>Советский</option>
            <option>Кировский</option>
            <option>Пригород</option>
          </select>
        </label>

        <label className="block text-sm font-bold">
          Описание проблемы
          <textarea required name="description" rows={4} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="Например: сломалась стиральная машина, не сливает воду" />
        </label>

        <label className="block text-sm font-bold">
          Удобное время звонка
          <input name="preferredCallTime" defaultValue="09:00-12:00" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Отправляем...' : 'Оставить заявку бесплатно'}
        </button>
      </div>
    </form>
  );
}
