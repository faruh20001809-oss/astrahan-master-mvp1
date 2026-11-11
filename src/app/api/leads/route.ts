import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { normalizePhone } from '@/lib/utils';

const LeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  category: z.string().min(1),
  district: z.string().min(2),
  description: z.string().min(8),
  preferredCallTime: z.string().optional().default('В течение дня')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.parse(body);
    const phone = normalizePhone(parsed.phone);

    if (!phone) {
      return NextResponse.json({ error: 'Введите корректный номер телефона' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { slug: parsed.category } });

    if (!category) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 400 });
    }

    const created = await prisma.lead.create({
      data: {
        name: parsed.name,
        phone,
        categoryId: category.id,
        district: parsed.district,
        description: parsed.description,
        preferredCallTime: parsed.preferredCallTime,
        status: 'new',
        price: category.basePriceFrom
      }
    });

    console.log('[NEW_LEAD]', created.id, category.name);

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Не удалось создать заявку. Проверьте поля.' }, { status: 400 });
  }
}
