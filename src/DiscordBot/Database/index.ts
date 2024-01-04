import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DB_HOST)

await sequelize.authenticate()

console.log('DB Connected')

export default sequelize
