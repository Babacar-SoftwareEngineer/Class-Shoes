import { faker } from '@faker-js/faker';
import prisma from './config/db.js';

async function main() {
  console.log('🧹 Cleaning up database...');
  
  // Clean tables in reverse order of foreign keys
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

  console.log('🌱 Database cleaned.');

  // 1. Create Roles
  console.log('👥 Creating roles...');
  const rolesData = [
    { RoleName: 'ADMIN' },
    { RoleName: 'CUSTOMER' }
  ];
  await prisma.roles.createMany({ data: rolesData });
  const roles = await prisma.roles.findMany();
  const customerRole = roles.find(r => r.RoleName === 'CUSTOMER');
  const adminRole = roles.find(r => r.RoleName === 'ADMIN');

  if (!customerRole || !adminRole) {
    throw new Error('Roles not created properly');
  }

  // 2. Create Categories
  console.log('🏷️ Creating categories...');
  const categoriesData = [
    { CategoryName: 'Sneakers' },
    { CategoryName: 'Running' },
    { CategoryName: 'Bottes' },
    { CategoryName: 'Sandales' },
    { CategoryName: 'Ville' },
    { CategoryName: 'Sport' }
  ];
  await prisma.category.createMany({ data: categoriesData });
  const categories = await prisma.category.findMany();
  const categoryIds = categories.map(c => c.CategoryId);

  // 3. Create 500 Users
  console.log('👤 Generating 500 users...');
  const emails = new Set<string>();
  while (emails.size < 500) {
    emails.add(faker.internet.email().toLowerCase());
  }
  const emailList = Array.from(emails);

  const usersData = emailList.map((email, idx) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      DisplayName: `${firstName} ${lastName}`,
      AuthId: faker.string.uuid()
    };
  });

  // Use createMany to insert all users
  await prisma.userProfile.createMany({ data: usersData });
  
  // Retrieve the generated users to get their ids
  const users = await prisma.userProfile.findMany({ select: { UserId: true } });
  const userIds = users.map(u => u.UserId);

  // Assign CUSTOMER role to all users, and ADMIN to first 5
  console.log('🔑 Assigning roles to users...');
  const userRolesData = users.map((user, idx) => ({
    UserId: user.UserId,
    RoleId: idx < 5 ? adminRole.RoleId : customerRole.RoleId
  }));
  await prisma.userRole.createMany({ data: userRolesData });

  // 4. Create Addresses for Users (1-2 per user)
  console.log('🏠 Generating user addresses...');
  const addressesData: any[] = [];
  for (const userId of userIds) {
    const numAddresses = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numAddresses; i++) {
      addressesData.push({
        UserId: userId,
        Street: faker.location.streetAddress(),
        City: faker.location.city(),
        State: faker.location.state(),
        ZipCode: faker.location.zipCode()
      });
    }
  }
  await prisma.address.createMany({ data: addressesData });

  // 5. Create 10,000 Products in Chunks
  const totalProducts = 10000;
  const CHUNK_SIZE = 2000;
  console.log(`👟 Generating ${totalProducts} products...`);

  for (let i = 0; i < totalProducts; i += CHUNK_SIZE) {
    const productsChunk: any[] = [];
    const currentChunkSize = Math.min(CHUNK_SIZE, totalProducts - i);
    
    for (let j = 0; j < currentChunkSize; j++) {
      productsChunk.push({
        ProductName: `${faker.commerce.productName()} ${faker.helpers.arrayElement(['Air', 'Retro', 'Classic', 'Sport', 'Lite', 'Pro', 'Ultra', 'Infinity', 'Flex'])}`,
        Price: parseFloat(faker.number.float({ min: 19.99, max: 299.99 }).toFixed(2)),
        Quantity: faker.number.int({ min: 0, max: 200 }),
        CategoryId: faker.helpers.arrayElement(categoryIds),
        IsActive: faker.helpers.maybe(() => true, { probability: 0.95 }) ?? false,
        CreatedAt: faker.date.past({ years: 1 })
      });
    }
    
    await prisma.product.createMany({ data: productsChunk });
    console.log(`   Inserted products ${i + currentChunkSize}/${totalProducts}`);
  }

  // Retrieve all products to assign images and reviews
  console.log('🔍 Retrieving products from database...');
  const products = await prisma.product.findMany({ select: { ProductId: true } });
  const productIds = products.map(p => p.ProductId);

  // 6. Create Product Images (1-2 per product)
  console.log('🖼️ Generating product images...');
  const imagesData: any[] = [];
  const shoeImageIds = [
    '1542291026-7eec264c27ff', // red Nike shoe
    '1595950653106-6c9ebd614d3a', // colorful shoe
    '1525966222134-fcfa99b8ae77', // yellow Vans shoe
    '1560769629-975ec94e6a86', // brown dress shoe
    '1606107557195-0e29a4b5b4aa', // blue shoe
    '1608231387042-66d1773070a5', // white Puma shoe
    '1600185365483-26d7a4cc7519', // black/white Nike shoe
    '1491553895911-0055eca6402d', // black sneakers
    '1539185441755-769473a23570', // orange sneakers
    '1515955656352-a1fa3ffcd111'  // blue nike sneakers
  ];

  for (const productId of productIds) {
    const numImages = faker.number.int({ min: 1, max: 2 });
    for (let k = 0; k < numImages; k++) {
      const imgId = faker.helpers.arrayElement(shoeImageIds);
      imagesData.push({
        ProductId: productId,
        ImageUrl: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=600&q=80`
      });
    }
  }

  console.log(`Inserting ${imagesData.length} images...`);
  for (let i = 0; i < imagesData.length; i += CHUNK_SIZE) {
    await prisma.productImage.createMany({
      data: imagesData.slice(i, i + CHUNK_SIZE)
    });
  }

  // 7. Create Reviews for a subset of products (approx. 30%)
  console.log('⭐ Generating reviews...');
  const reviewsData: any[] = [];
  const reviewTexts = [
    'Super confortable !',
    'Très bon rapport qualité/prix.',
    'Design sympa, mais taille un peu petit.',
    'Parfait pour courir, je recommande.',
    'La couleur correspond exactement aux photos.',
    'Un peu rigide au début, mais s\'assouplit vite.',
    'Excellente qualité, livraison rapide.',
    'Vraiment déçu de la qualité des finitions.',
    'Style au top, confort absolu.'
  ];

  // Take a random 30% subset of products to have reviews
  const reviewProductIds = productIds.filter(() => faker.datatype.boolean({ probability: 0.3 }));

  for (const productId of reviewProductIds) {
    const numReviews = faker.number.int({ min: 1, max: 3 });
    for (let k = 0; k < numReviews; k++) {
      reviewsData.push({
        ProductId: productId,
        UserId: faker.helpers.arrayElement(userIds),
        Rating: faker.number.int({ min: 3, max: 5 }), // mostly positive
        ReviewText: faker.helpers.arrayElement(reviewTexts),
        ReviewDate: faker.date.past({ years: 1 })
      });
    }
  }

  console.log(`Inserting ${reviewsData.length} reviews...`);
  for (let i = 0; i < reviewsData.length; i += CHUNK_SIZE) {
    await prisma.productReview.createMany({
      data: reviewsData.slice(i, i + CHUNK_SIZE)
    });
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
