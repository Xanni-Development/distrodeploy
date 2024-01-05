import { Sequelize } from 'sequelize-typescript'
import User from '../Models/User'
import VM from '../Models/VM'

const sequelize = new Sequelize(process.env.DB_HOST)

sequelize.addModels([User, VM])

await sequelize.authenticate()

await sequelize.sync({ alter: true })

console.log('DB Connected')

export default sequelize
