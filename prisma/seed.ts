import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Сантехника',
      slug: 'santehnika',
      icon: '💧',
      seoTitle: 'Сантехник в Астрахани — вызов в день заявки',
      seoDescription: 'Сантехнические работы в Астрахани: замена смесителя, устранение течей, установка унитаза.',
      description: 'Решаем проблемы с сантехникой быстро и без лишних платежей.',
      basePriceFrom: 500,
      subcategories: ['Устранение течи', 'Замена смесителя', 'Установка унитаза']
    },
    {
      name: 'Электрика',
      slug: 'elektrika',
      icon: '⚡',
      seoTitle: 'Электрик в Астрахани — быстрый вызов мастера',
      seoDescription: 'Электромонтажные работы в Астрахани: розетки, освещение, проводка.',
      description: 'Проверка проводки, замена розеток, установка светильников.',
      basePriceFrom: 700,
      subcategories: ['Замена розетки', 'Установка люстры', 'Диагностика проводки']
    },
    {
      name: 'Ремонт стиральных машин',
      slug: 'remont-stiralnyh-mashin',
      icon: '🧺',
      seoTitle: 'Ремонт стиральных машин в Астрахани',
      seoDescription: 'Ремонт стиральных машин в Астрахани: замена подшипников, ремонт сливов и запуск.',
      description: 'Помогаем быстро вернуть стиральную машину в работу.',
      basePriceFrom: 1200,
      subcategories: ['Замена подшипника', 'Не сливает воду', 'Не включается']
    },
    {
      name: 'Ремонт холодильников',
      slug: 'remont-holodilnikov',
      icon: '🧊',
      seoTitle: 'Ремонт холодильников в Астрахани — вызов мастера',
      seoDescription: 'Ремонт холодильников в Астрахани: не холодит, течёт или шумит.',
      description: 'Диагностика и ремонт холодильной техники в день обращения.',
      basePriceFrom: 1500,
      subcategories: ['Не холодит', 'Замена термостата', 'Ремонт компрессора']
    }
  ];

  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.masterCategory.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.master.deleteMany();
  await prisma.user.deleteMany();

  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        description: category.description,
        basePriceFrom: category.basePriceFrom
      }
    });

    for (const name of category.subcategories) {
      await prisma.subcategory.create({
        data: {
          categoryId: created.id,
          name,
          slug: name.toLowerCase().replace(/[^а-яa-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          seoTitle: `${name} в Астрахани`,
          seoDescription: `Услуга: ${name}. Проверьте цены и оставьте заявку.`,
          priceFrom: category.basePriceFrom
        }
      });
    }
  }

  const adminPhone = process.env.ADMIN_PHONE || '+79000000000';
  await prisma.user.create({
    data: {
      phone: adminPhone,
      name: 'Администратор',
      role: UserRole.admin
    }
  });

  const masterPhones = ['+79000000001', '+79000000002', '+79000000003'];
  const masterNames = ['Иван', 'Сергей', 'Михаил'];
  const allCategories = await prisma.category.findMany();

  for (let i = 0; i < masterPhones.length; i++) {
    const user = await prisma.user.create({
      data: {
        phone: masterPhones[i],
        name: masterNames[i],
        role: UserRole.master
      }
    });

    const master = await prisma.master.create({
      data: {
        userId: user.id,
        balance: 1500,
        isBlocked: false
      }
    });

    const category = allCategories[i % allCategories.length];
    await prisma.masterCategory.create({
      data: {
        masterId: master.id,
        categoryId: category.id,
        pricePerLead: 300,
        active: true
      }
    });
  }

  for (let i = 1; i <= 20; i++) {
    const category = allCategories[i % allCategories.length];
    const subcats = await prisma.subcategory.findMany({ where: { categoryId: category.id } });
    const sub = subcats[i % subcats.length];

    await prisma.lead.create({
      data: {
        name: `Клиент ${i}`,
        phone: `+790000000${String(i).padStart(2, '0')}`,
        categoryId: category.id,
        subcategoryId: sub.id,
        district: ['Трусовский', 'Ленинский', 'Советский', 'Кировский', 'Пригород'][i % 5],
        description: 'Нужно решить проблему срочно. Пожалуйста, свяжитесь в удобное время.',
        preferredCallTime: i % 2 === 0 ? '09:00-12:00' : '18:00-21:00',
        status: i % 5 === 0 ? 'sold' : 'new',
        price: category.basePriceFrom
      }
    });
  }

  await prisma.review.createMany({
    data: [
      { name: 'Елена', text: 'Мастер приехал быстро, всё починил аккуратно.', rating: 5 },
      { name: 'Алексей', text: 'Понравилась простая заявка и быстрый отклик.', rating: 5 },
      { name: 'Ольга', text: 'Нашли электрика по району без нервов и переплат.', rating: 4 }
    ]
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
