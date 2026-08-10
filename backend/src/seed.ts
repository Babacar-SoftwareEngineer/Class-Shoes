import { faker } from '@faker-js/faker';
import prisma from './config/db.js';

type SeedProduct = {
  name: string;
  category: string;
  price: number;
  quantity: number;
  images: string[];
  daysAgo: number;
};

const BAG_IMAGES = [
  'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80',
] as const;

const SHOE_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
] as const;

const bag = (index: number) => BAG_IMAGES[index]!;
const shoe = (index: number) => SHOE_IMAGES[index]!;

const products: SeedProduct[] = [
  {
    name: 'Mini sac à chaîne noir',
    category: 'Sacs à main',
    price: 84618,
    quantity: 8,
    images: [bag(0), bag(1)],
    daysAgo: 1,
  },
  {
    name: 'Cabas cuir grainé ivoire',
    category: 'Cabas',
    price: 123976,
    quantity: 6,
    images: [bag(2)],
    daysAgo: 2,
  },
  {
    name: 'Sac bandoulière rouge',
    category: 'Sacs bandoulière',
    price: 104297,
    quantity: 3,
    images: [bag(1)],
    daysAgo: 3,
  },
  {
    name: 'Tote structuré beige',
    category: 'Cabas',
    price: 144311,
    quantity: 11,
    images: [bag(3), bag(4)],
    daysAgo: 4,
  },
  {
    name: 'Sac seau camel',
    category: 'Sacs à main',
    price: 114792,
    quantity: 5,
    images: [bag(4)],
    daysAgo: 5,
  },
  {
    name: 'Pochette rose poudré',
    category: 'Sacs à main',
    price: 64940,
    quantity: 12,
    images: [bag(5)],
    daysAgo: 6,
  },
  {
    name: 'Escarpins slingback noirs',
    category: 'Escarpins',
    price: 97738,
    quantity: 7,
    images: [shoe(0), shoe(4)],
    daysAgo: 7,
  },
  {
    name: 'Sandales à talon nude',
    category: 'Sandales',
    price: 91178,
    quantity: 4,
    images: [shoe(3)],
    daysAgo: 8,
  },
  {
    name: 'Bottines cuir chocolat',
    category: 'Bottines',
    price: 137751,
    quantity: 2,
    images: [shoe(2)],
    daysAgo: 9,
  },
  {
    name: 'Ballerines ivoire',
    category: 'Ballerines',
    price: 78059,
    quantity: 9,
    images: [shoe(6)],
    daysAgo: 10,
  },
  {
    name: 'Sneakers femme blanches',
    category: 'Sneakers femme',
    price: 88554,
    quantity: 15,
    images: [shoe(1), shoe(7)],
    daysAgo: 11,
  },
  {
    name: 'Mules camel',
    category: 'Mules',
    price: 84618,
    quantity: 5,
    images: [shoe(5)],
    daysAgo: 12,
  },
  {
    name: 'Escarpins rouges vernis',
    category: 'Escarpins',
    price: 104297,
    quantity: 1,
    images: [shoe(0)],
    daysAgo: 13,
  },
  {
    name: 'Bottes hautes noires',
    category: 'Bottines',
    price: 163333,
    quantity: 2,
    images: [shoe(2), shoe(4)],
    daysAgo: 14,
  },
  {
    name: 'Mocassins cuir brun',
    category: 'Mocassins',
    price: 110857,
    quantity: 6,
    images: [shoe(7)],
    daysAgo: 15,
  },
  {
    name: 'Sandales plates dorées',
    category: 'Sandales',
    price: 58380,
    quantity: 13,
    images: [shoe(3), shoe(6)],
    daysAgo: 16,
  },
];

async function main() {
  console.log('Cleaning database...');

  await prisma.paymentInformation.deleteMany();
  await prisma.orderCoupon.deleteMany();
  await prisma.orderStatus.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userActivityLog.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.address.deleteMany();
  await prisma.userProfile.deleteMany();

  console.log('Database cleaned.');

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
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
