import 'dotenv/config';
import { PrismaClient, UserRole, ChargeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // Plans
  const planBasic = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic' },
    update: {},
    create: { id: 'basic', name: 'Basic 50', includedKWh: 50, priceCents: 1999 }
  });
  void planBasic;

  // Users
  const user = await prisma.user.upsert({
    where: { email: 'user@chargego.dev' },
    update: {},
    create: { email: 'user@chargego.dev', passwordHash: '$2a$10$2mspN4Jk0H3oB5gSx1iV3u2wH1aQbY7k0s8mBE3s5k0s8mBE3s5k0S', name: 'Demo User' }
  });

  const provider = await prisma.user.upsert({
    where: { email: 'driver@chargego.dev' },
    update: {},
    create: { email: 'driver@chargego.dev', passwordHash: '$2a$10$2mspN4Jk0H3oB5gSx1iV3u2wH1aQbY7k0s8mBE3s5k0s8mBE3s5k0S', name: 'Demo Driver', role: UserRole.PROVIDER }
  });

  const profile = await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: {},
    create: { userId: provider.id }
  });

  // Vans
  const van = await prisma.van.upsert({
    where: { identifier: 'VAN-001' },
    update: {},
    create: { identifier: 'VAN-001', capacityKWh: 80, availableKWh: 60, driverId: profile.id }
  });
  void van;

  // Booking sample
  await prisma.booking.create({
    data: {
      userId: user.id,
      type: ChargeType.DC,
      lat: 77.5946,
      lng: 12.9716,
      estCostCents: 2500,
      estMinutes: 45
    }
  });

  console.log('Seed completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});