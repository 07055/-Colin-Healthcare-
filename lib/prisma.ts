import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient | undefined
}

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('DATABASE_URL not set')
    }
    return {} as PrismaClient
  }

  globalForPrisma.prisma = new PrismaClient()
  return globalForPrisma.prisma
})()
