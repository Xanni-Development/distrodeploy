import { Sequelize } from 'sequelize-typescript'
import User from '../Models/User'
import VM from '../Models/VM'
import Shell from '../Models/Shell'

const sequelize = new Sequelize(process.env.DB_HOST)

sequelize.addModels([User, VM, Shell])

await sequelize.authenticate()

await sequelize.sync({ alter: true })

console.log('DB Connected')

export default sequelize
