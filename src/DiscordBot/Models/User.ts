import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import sequelize from '../Database'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: number
	declare discordID: string
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		discordID: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{ tableName: 'users', sequelize }
)

// Better to use migration but i'm lazy
await User.sync({ alter: true })

export default User
