import { DataTypes, Model } from 'sequelize'
import sequelize from '../Database'

class User extends Model {
	declare id: number
	declare discordID: number
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
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			unique: true,
		},
	},
	{ tableName: 'users', sequelize }
)

User.sync({ alter: true })

export default User
