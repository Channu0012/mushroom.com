/**
 * DEVELOPMENT SEED DATA
 * =====================
 * This script seeds realistic development/testing data.
 *
 * CRITICAL: This script ONLY runs when NODE_ENV !== 'production'.
 * It will REFUSE to run against a production database.
 *
 * Usage:
 *   npm run seed --workspace=packages/database
 *   (from monorepo root)
 *
 * Or:
 *   cd packages/database && npm run seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ============================================================
// PRODUCTION GUARD
// ============================================================
if (process.env.NODE_ENV === 'production') {
  console.error('❌ SEED REFUSED: Will not seed a production database.');
  console.error('   NODE_ENV is "production". Aborting.');
  process.exit(1);
}

// ============================================================
// SEED DATA
// ============================================================

const SEED_PASSWORD = 'DevPassword123!';
const BCRYPT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function seedMushroomCatalog() {
  console.log('🍄 Seeding mushroom catalog...');

  const category = await prisma.mushroomCategory.upsert({
    where: { slug: 'edible-mushrooms' },
    create: {
      name: 'Edible Mushrooms',
      slug: 'edible-mushrooms',
      description: 'Cultivated and wild edible mushrooms',
      sortOrder: 1,
    },
    update: {},
  });

  const types = [
    { name: 'Oyster Mushroom', slug: 'oyster-mushroom', scientificName: 'Pleurotus ostreatus' },
    { name: 'Button Mushroom', slug: 'button-mushroom', scientificName: 'Agaricus bisporus' },
    { name: 'Shiitake Mushroom', slug: 'shiitake-mushroom', scientificName: 'Lentinula edodes' },
    { name: 'Milky Mushroom', slug: 'milky-mushroom', scientificName: 'Calocybe indica' },
    { name: 'King Oyster Mushroom', slug: 'king-oyster-mushroom', scientificName: 'Pleurotus eryngii' },
    { name: 'Lion\'s Mane Mushroom', slug: 'lions-mane-mushroom', scientificName: 'Hericium erinaceus' },
    { name: 'Reishi Mushroom', slug: 'reishi-mushroom', scientificName: 'Ganoderma lucidum' },
    { name: 'Portobello Mushroom', slug: 'portobello-mushroom', scientificName: 'Agaricus bisporus' },
  ];

  for (let i = 0; i < types.length; i++) {
    const t = types[i];
    await prisma.mushroomType.upsert({
      where: { slug: t.slug },
      create: {
        categoryId: category.id,
        name: t.name,
        slug: t.slug,
        scientificName: t.scientificName,
        sortOrder: i + 1,
      },
      update: {},
    });
  }

  console.log(`   ✓ ${types.length} mushroom types created`);
  return category;
}

async function seedAdmin() {
  console.log('👤 Seeding admin user...');

  const hash = await hashPassword(SEED_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dev.mushroom.local' },
    create: {
      email: 'admin@dev.mushroom.local',
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          displayName: 'Platform Admin',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'IN',
        },
      },
    },
    update: {},
  });

  await prisma.adminRoleAssignment.upsert({
    where: { userId_role: { userId: admin.id, role: 'SUPER_ADMIN' } },
    create: {
      userId: admin.id,
      role: 'SUPER_ADMIN',
    },
    update: {},
  });

  console.log(`   ✓ Admin: admin@dev.mushroom.local / ${SEED_PASSWORD}`);
  return admin;
}

async function seedGrowers() {
  console.log('🌱 Seeding growers...');

  const growersData = [
    {
      email: 'grower1@dev.mushroom.local',
      displayName: 'Ravi Kumar',
      farmName: 'Green Valley Mushrooms',
      farmSlug: 'green-valley-mushrooms',
      city: 'Bengaluru',
      state: 'Karnataka',
      verificationStatus: 'VERIFIED' as const,
    },
    {
      email: 'grower2@dev.mushroom.local',
      displayName: 'Priya Sharma',
      farmName: 'Fresh Farm Fungi',
      farmSlug: 'fresh-farm-fungi',
      city: 'Pune',
      state: 'Maharashtra',
      verificationStatus: 'VERIFIED' as const,
    },
    {
      email: 'grower3@dev.mushroom.local',
      displayName: 'Arun Nair',
      farmName: 'Spore & Soil',
      farmSlug: 'spore-and-soil',
      city: 'Thrissur',
      state: 'Kerala',
      verificationStatus: 'UNDER_REVIEW' as const,
    },
  ];

  const hash = await hashPassword(SEED_PASSWORD);
  const growers = [];

  for (const g of growersData) {
    const user = await prisma.user.upsert({
      where: { email: g.email },
      create: {
        email: g.email,
        passwordHash: hash,
        role: 'GROWER',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            displayName: g.displayName,
            city: g.city,
            state: g.state,
            country: 'IN',
          },
        },
        farm: {
          create: {
            name: g.farmName,
            slug: g.farmSlug,
            description: `${g.farmName} is a quality mushroom farm producing fresh varieties for local businesses and consumers.`,
            city: g.city,
            state: g.state,
            country: 'IN',
            verificationStatus: g.verificationStatus,
            verifiedAt: g.verificationStatus === 'VERIFIED' ? new Date() : null,
            establishedYear: 2020,
            mushroomVarieties: ['Oyster Mushroom', 'Button Mushroom'],
            totalCompletedOrders: g.verificationStatus === 'VERIFIED' ? 12 : 0,
            averageRating: g.verificationStatus === 'VERIFIED' ? 4.7 : null,
            totalReviews: g.verificationStatus === 'VERIFIED' ? 12 : 0,
          },
        },
      },
      update: {},
    });
    growers.push(user);
    console.log(`   ✓ Grower: ${g.email} / ${SEED_PASSWORD}`);
  }

  return growers;
}

async function seedBuyers() {
  console.log('🏢 Seeding buyers...');

  const hash = await hashPassword(SEED_PASSWORD);

  const b2bBuyer = await prisma.user.upsert({
    where: { email: 'buyer1@dev.mushroom.local' },
    create: {
      email: 'buyer1@dev.mushroom.local',
      passwordHash: hash,
      role: 'B2B_BUYER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          displayName: 'Mehta Restaurants',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'IN',
        },
      },
      business: {
        create: {
          businessName: 'Mehta Restaurants Pvt Ltd',
          businessType: 'RESTAURANT',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'IN',
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
    update: {},
  });

  const consumer = await prisma.user.upsert({
    where: { email: 'consumer1@dev.mushroom.local' },
    create: {
      email: 'consumer1@dev.mushroom.local',
      passwordHash: hash,
      role: 'CONSUMER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          displayName: 'Sanjay Patel',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'IN',
        },
      },
    },
    update: {},
  });

  console.log(`   ✓ B2B Buyer: buyer1@dev.mushroom.local / ${SEED_PASSWORD}`);
  console.log(`   ✓ Consumer: consumer1@dev.mushroom.local / ${SEED_PASSWORD}`);

  return { b2bBuyer, consumer };
}

async function seedListings(growerIds: string[]) {
  console.log('📋 Seeding listings...');

  const oyster = await prisma.mushroomType.findUnique({ where: { slug: 'oyster-mushroom' } });
  const button = await prisma.mushroomType.findUnique({ where: { slug: 'button-mushroom' } });
  const shiitake = await prisma.mushroomType.findUnique({ where: { slug: 'shiitake-mushroom' } });

  if (!oyster || !button || !shiitake) {
    throw new Error('Mushroom types not found — run catalog seed first');
  }

  const farm1 = await prisma.farm.findUnique({ where: { growerId: growerIds[0] } });
  const farm2 = await prisma.farm.findUnique({ where: { growerId: growerIds[1] } });

  if (!farm1 || !farm2) throw new Error('Farms not found');

  const listings = [
    {
      growerId: growerIds[0],
      farmId: farm1.id,
      mushroomTypeId: oyster.id,
      title: 'Fresh Oyster Mushrooms — Weekly Supply',
      description:
        'Freshly harvested oyster mushrooms from our controlled environment farm. Available weekly. Ideal for restaurants and bulk buyers.',
      pricePerKg: 160,
      availableQuantityKg: 200,
      minOrderQuantityKg: 10,
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    {
      growerId: growerIds[0],
      farmId: farm1.id,
      mushroomTypeId: button.id,
      title: 'Premium Button Mushrooms',
      description:
        'Grade-A button mushrooms grown in climate-controlled conditions. Perfect for hospitality and retail.',
      pricePerKg: 120,
      availableQuantityKg: 150,
      minOrderQuantityKg: 5,
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    {
      growerId: growerIds[1],
      farmId: farm2.id,
      mushroomTypeId: shiitake.id,
      title: 'Organic Shiitake Mushrooms',
      description:
        'Organically grown shiitake mushrooms. Rich flavor profile, perfect for specialty restaurants and gourmet retailers.',
      pricePerKg: 380,
      availableQuantityKg: 80,
      minOrderQuantityKg: 2,
      city: 'Pune',
      state: 'Maharashtra',
    },
  ];

  for (const l of listings) {
    await prisma.listing.create({
      data: {
        ...l,
        status: 'ACTIVE',
        fulfillmentMethod: 'BOTH',
        availableFrom: new Date(),
        isB2b: true,
        isB2c: true,
        currency: 'INR',
      },
    });
  }

  console.log(`   ✓ ${listings.length} listings created`);
}

async function seedPlatformSettings() {
  console.log('⚙️  Seeding platform settings...');

  const settings = [
    {
      key: 'commission.global_rate',
      value: { rate: 0.03, description: 'Global platform commission rate (3%)' },
      description: 'Default platform commission applied to all orders',
    },
    {
      key: 'commission.category_rates',
      value: {},
      description: 'Per-category commission overrides (empty = use global rate)',
    },
    {
      key: 'marketplace.listing_expiry_days',
      value: { days: 30 },
      description: 'Number of days before a listing auto-expires',
    },
    {
      key: 'marketplace.requirement_expiry_days',
      value: { days: 14 },
      description: 'Number of days before a buyer requirement auto-expires',
    },
    {
      key: 'marketplace.offer_expiry_hours',
      value: { hours: 48 },
      description: 'Hours before an unanswered offer expires',
    },
    {
      key: 'platform.maintenance_mode',
      value: { enabled: false },
      description: 'Enable to show maintenance page to all users',
    },
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value, description: s.description },
    });
  }

  console.log(`   ✓ ${settings.length} platform settings configured`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n🌍 MUSHROOM MARKETPLACE — DEVELOPMENT SEED');
  console.log('==========================================');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database: ${process.env.DATABASE_URL?.split('@')[1] || 'localhost'}`);
  console.log('');

  try {
    await seedMushroomCatalog();
    await seedAdmin();
    const growers = await seedGrowers();
    await seedBuyers();
    await seedListings(growers.map((g) => g.id));
    await seedPlatformSettings();

    console.log('\n✅ Seed complete!\n');
    console.log('📝 Development accounts:');
    console.log('   admin@dev.mushroom.local     / DevPassword123!  (Super Admin)');
    console.log('   grower1@dev.mushroom.local   / DevPassword123!  (Verified Grower)');
    console.log('   grower2@dev.mushroom.local   / DevPassword123!  (Verified Grower)');
    console.log('   grower3@dev.mushroom.local   / DevPassword123!  (Under Review)');
    console.log('   buyer1@dev.mushroom.local    / DevPassword123!  (B2B Buyer)');
    console.log('   consumer1@dev.mushroom.local / DevPassword123!  (Consumer)');
    console.log('');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
