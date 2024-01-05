import {
	AllowNull,
	ForeignKey,
	HasMany,
	HasOne,
	Model,
} from 'sequelize-typescript'
import { Column, Table, Unique } from 'sequelize-typescript'
import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import VM from './VM'

@Table({ tableName: 'users' })
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare discordID: string

	@HasMany(() => VM)
	declare vms: VM[]

	@ForeignKey(() => VM)
	declare selectedVMID: VM | null

	@HasOne(() => VM, { foreignKey: { allowNull: true } })
	declare selectedVM: VM | null
}

export default User
