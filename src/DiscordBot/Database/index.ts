import { Sequelize } from 'sequelize-typescript'
import User from '../Models/User'
import VM from '../Models/VM'
import Shell from '../Models/Shell'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('DB Connected')

export default prisma
