import {
	AllowNull,
	Default,
	HasMany,
	HasOne,
	Model,
} from 'sequelize-typescript'
import { Column, Table, Unique } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import VM from './VM'

@Table({ tableName: 'users' })
class User extends Model {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare discordID: string

	@HasMany(() => VM)
	vms: VM[]

	@HasOne(() => VM, { foreignKey: { allowNull: true } })
	selectedVM: VM | null
}

export default User
