import { AllowNull, Model } from 'sequelize-typescript'
import {
	Column,
	CreatedAt,
	NotNull,
	Table,
	Unique,
	UpdatedAt,
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'users' })
class User extends Model {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare discordID: string
}

export default User
