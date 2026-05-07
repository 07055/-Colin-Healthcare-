import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient | undefined
}

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured')
  }

  globalForPrisma.prisma = new PrismaClient()
  return globalForPrisma.prisma
}
