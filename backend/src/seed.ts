import { faker } from '@faker-js/faker';
import prisma from './config/db.js';
import { getRedisClient } from './config/redis.js';

type SeedProduct = {
  name: string;
  category: string;
  price: number;
  quantity: number;
  images: string[];
  daysAgo: number;
};

const products: SeedProduct[] = [
  {
    name: 'Mini sac à chaîne noir',
    category: 'Sacs à main',
    price: 84618,
    quantity: 8,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436661/class-shoes/products/whatsappimage20260413at154206.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436662/class-shoes/products/whatsappimage20260413at1542001.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436663/class-shoes/products/whatsappimage20260413at154203.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436664/class-shoes/products/whatsappimage20260413at154205.jpg',
    ],
    daysAgo: 1,
  },
  {
    name: 'Cabas cuir grainé ivoire',
    category: 'Cabas',
    price: 123976,
    quantity: 6,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436664/class-shoes/products/whatsappimage20260413at1542181.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436666/class-shoes/products/whatsappimage20260413at154216.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436667/class-shoes/products/whatsappimage20260413at154229.jpg',
    ],
    daysAgo: 2,
  },
  {
    name: 'Sac bandoulière rouge',
    category: 'Sacs bandoulière',
    price: 104297,
    quantity: 3,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436667/class-shoes/products/whatsappimage20260413at154200.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436670/class-shoes/products/whatsappimage20260413at154219.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436670/class-shoes/products/whatsappimage20260413at154227.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436671/class-shoes/products/whatsappimage20260413at1542292.jpg',
    ],
    daysAgo: 3,
  },
  {
    name: 'Tote structuré beige',
    category: 'Cabas',
    price: 144311,
    quantity: 11,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436672/class-shoes/products/whatsappimage20260413at1542291.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436673/class-shoes/products/whatsappimage20260413at154215.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436674/class-shoes/products/whatsappimage20260413at154218.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436675/class-shoes/products/whatsappimage20260413at154158.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436676/class-shoes/products/whatsappimage20260413at154210.jpg',
    ],
    daysAgo: 4,
  },
  {
    name: 'Sac seau camel',
    category: 'Sacs à main',
    price: 114792,
    quantity: 5,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436677/class-shoes/products/whatsappimage20260413at154212.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436677/class-shoes/products/whatsappimage20260413at154208.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436678/class-shoes/products/whatsappimage20260413at1542071.jpg',
    ],
    daysAgo: 5,
  },
  {
    name: 'Pochette rose poudré',
    category: 'Sacs à main',
    price: 64940,
    quantity: 12,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436679/class-shoes/products/whatsappimage20260413at154207.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436680/class-shoes/products/whatsappimage20260413at154209.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436681/class-shoes/products/whatsappimage20260414at1502501.jpg',
    ],
    daysAgo: 6,
  },
  {
    name: 'Escarpins slingback noirs',
    category: 'Escarpins',
    price: 97738,
    quantity: 7,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436681/class-shoes/products/whatsappimage20260414at1502503.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436682/class-shoes/products/whatsappimage20260414at150250.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436683/class-shoes/products/whatsappimage20260414at1502502.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436684/class-shoes/products/whatsappimage20260414at1502462.jpg',
    ],
    daysAgo: 7,
  },
  {
    name: 'Sandales à talon nude',
    category: 'Sandales',
    price: 91178,
    quantity: 4,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436684/class-shoes/products/whatsappimage20260414at1502461.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436685/class-shoes/products/whatsappimage20260414at150245.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436686/class-shoes/products/whatsappimage20260414at1502451.jpg',
    ],
    daysAgo: 8,
  },
  {
    name: 'Bottines cuir chocolat',
    category: 'Bottines',
    price: 137751,
    quantity: 2,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436687/class-shoes/products/whatsappimage20260414at150246.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436688/class-shoes/products/whatsappimage20260414at1502463.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436689/class-shoes/products/whatsappimage20260414at1502471.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436690/class-shoes/products/whatsappimage20260414at150247.jpg',
    ],
    daysAgo: 9,
  },
  {
    name: 'Ballerines ivoire',
    category: 'Ballerines',
    price: 78059,
    quantity: 9,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436690/class-shoes/products/whatsappimage20260414at1502483.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436691/class-shoes/products/whatsappimage20260414at1502482.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436692/class-shoes/products/whatsappimage20260414at1502481.jpg',
    ],
    daysAgo: 10,
  },
  {
    name: 'Sneakers femme blanches',
    category: 'Sneakers femme',
    price: 88554,
    quantity: 15,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436693/class-shoes/products/whatsappimage20260414at150248.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436693/class-shoes/products/whatsappimage20260414at1502474.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436694/class-shoes/products/whatsappimage20260414at1502473.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436695/class-shoes/products/whatsappimage20260414at1502491.jpg',
    ],
    daysAgo: 11,
  },
  {
    name: 'Mules camel',
    category: 'Mules',
    price: 84618,
    quantity: 5,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436696/class-shoes/products/whatsappimage20260414at1502493.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436696/class-shoes/products/whatsappimage20260414at150249.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436697/class-shoes/products/whatsappimage20260414at1502492.jpg',
    ],
    daysAgo: 12,
  },
  {
    name: 'Escarpins rouges vernis',
    category: 'Escarpins',
    price: 104297,
    quantity: 1,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436698/class-shoes/products/whatsappimage20260424at1016468.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436699/class-shoes/products/whatsappimage20260424at101646.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436699/class-shoes/products/whatsappimage20260424at1057523.jpg',
    ],
    daysAgo: 13,
  },
  {
    name: 'Bottes hautes noires',
    category: 'Bottines',
    price: 163333,
    quantity: 2,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436700/class-shoes/products/whatsappimage20260424at1016465.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436701/class-shoes/products/whatsappimage20260424at1057521.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436702/class-shoes/products/whatsappimage20260424at1016467.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436702/class-shoes/products/whatsappimage20260424at1016472.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436703/class-shoes/products/whatsappimage20260424at101647.jpg',
    ],
    daysAgo: 14,
  },
  {
    name: 'Mocassins cuir brun',
    category: 'Mocassins',
    price: 110857,
    quantity: 6,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436704/class-shoes/products/whatsappimage20260424at110126.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436705/class-shoes/products/whatsappimage20260424at110249.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436706/class-shoes/products/whatsappimage20260424at110250.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436706/class-shoes/products/whatsappimage20260501at141633.jpg',
    ],
    daysAgo: 15,
  },
  {
    name: 'Sandales plates dorées',
    category: 'Sandales',
    price: 58380,
    quantity: 13,
    images: [
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436707/class-shoes/products/whatsappimage20260501at1416323.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436708/class-shoes/products/whatsappimage20260501at1416322.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436708/class-shoes/products/whatsappimage20260501at141632.jpg',
      'https://res.cloudinary.com/czvgnteb/image/upload/v1786436709/class-shoes/products/whatsappimage20260501at1416321.jpg',
    ],
    daysAgo: 16,
  },
];

async function ensureSafeToSeed(): Promise<void> {
  const existingCount = await prisma.product.count();

  if (existingCount > 0 && process.env.SEED_CONFIRM !== 'yes') {
    console.error(
      `\n🛑 ${existingCount} produits existent déjà en base.\n` +
      'Ce script va TOUT supprimer et recréer avec les données codées en dur ci-dessus.\n' +
      "Si tu es sûr de vouloir continuer (ex: après avoir fait un backup), relance avec :\n\n" +
      '  SEED_CONFIRM=yes npm run seed\n',
    );
    process.exit(1);
  }
}

async function resetDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "PaymentInformation", "OrderCoupon", "OrderStatus", "OrderItem", "Orders",
      "Cart", "Wishlist", "Coupon", "ProductReview", "ProductVariant",
      "ProductImage", "Product", "Category", "UserActivityLog", "UserRole",
      "Roles", "Address", "UserProfile"
    RESTART IDENTITY CASCADE;
  `);
}

async function flushProductCache(): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys('product:*');
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch {
    // Redis cache is best-effort here.
  }
}

async function main() {
  console.log('Resetting database...');

  await ensureSafeToSeed();
  await resetDatabase();

  console.log('Database reset completed.');

  const [adminRole, customerRole] = await Promise.all([
    prisma.roles.create({ data: { RoleName: 'ADMIN' } }),
    prisma.roles.create({ data: { RoleName: 'CUSTOMER' } }),
  ]);

  const categoryNames = Array.from(new Set(products.map((product) => product.category)));
  await prisma.category.createMany({
    data: categoryNames.map((category) => ({ CategoryName: category })),
  });

  const categories = await prisma.category.findMany();
  const categoryByName = new Map(categories.map((category) => [category.CategoryName, category.CategoryId]));

  const emailSet = new Set<string>();
  while (emailSet.size < 18) {
    emailSet.add(faker.internet.email().toLowerCase());
  }

  const userData = Array.from(emailSet).map((Email) => {
    const FirstName = faker.person.firstName();
    const LastName = faker.person.lastName();

    return {
      Email,
      FirstName,
      LastName,
      DisplayName: `${FirstName} ${LastName}`,
      AuthId: faker.string.uuid(),
    };
  });

  await prisma.userProfile.createMany({ data: userData });
  const users = await prisma.userProfile.findMany({ select: { UserId: true } });

  await prisma.userRole.createMany({
    data: users.map((user, index) => ({
      UserId: user.UserId,
      RoleId: index < 2 ? adminRole.RoleId : customerRole.RoleId,
    })),
  });

  const addressData = users.map((user) => ({
    UserId: user.UserId,
    Street: faker.location.streetAddress(),
    City: faker.location.city(),
    State: faker.location.state(),
    ZipCode: faker.location.zipCode(),
  }));

  await prisma.address.createMany({ data: addressData });

  for (const [index, product] of products.entries()) {
    const created = await prisma.product.create({
      data: {
        ProductName: product.name,
        Price: product.price,
        Quantity: product.quantity,
        CategoryId: categoryByName.get(product.category) ?? null,
        IsActive: true,
        CreatedAt: faker.date.recent({ days: product.daysAgo + 1 }),
      },
    });

    await prisma.productImage.createMany({
      data: product.images.map((ImageUrl) => ({
        ProductId: created.ProductId,
        ImageUrl,
      })),
    });

    if (index % 2 === 0) {
      await prisma.productReview.createMany({
        data: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
          ProductId: created.ProductId,
          UserId: faker.helpers.arrayElement(users).UserId,
          Rating: faker.number.int({ min: 4, max: 5 }),
          ReviewText: faker.helpers.arrayElement([
            'Très belle finition et belle matière.',
            'Très confortable et élégant.',
            'Le rendu est encore plus beau en vrai.',
            'Belle pièce, livraison rapide.',
            'Excellent produit, je recommande.',
          ]),
          ReviewDate: faker.date.recent({ days: 90 }),
        })),
      });
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(async () => {
    await flushProductCache();
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
