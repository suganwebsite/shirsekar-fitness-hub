import * as PrismaModule from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrismaClientConstructor: any =
  (PrismaModule as any).PrismaClient ||
  class FallbackPrismaClient {
    [key: string]: any;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma?: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any =
  globalForPrisma.prisma ||
  new PrismaClientConstructor({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const isDatabaseConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
};

