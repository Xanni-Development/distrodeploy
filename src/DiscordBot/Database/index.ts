import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('DB Connected')

export default prisma
