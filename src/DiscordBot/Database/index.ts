import { Sequelize } from 'sequelize-typescript'
import User from '../Models/User'

const sequelize = new Sequelize(process.env.DB_HOST)

sequelize.addModels([User])

await sequelize.authenticate()

await sequelize.sync({ alter: true })

console.log('DB Connected')

export default sequelize
