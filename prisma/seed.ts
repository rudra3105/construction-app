import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@construction.app' },
    update: {},
    create: {
      name: 'Admin Owner',
      email: 'admin@construction.app',
      password,
      role: 'ADMIN'
    }
  });

  console.log('Seed complete. Login with admin@construction.app / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
