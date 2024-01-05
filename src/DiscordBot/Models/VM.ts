import {
	AllowNull,
	BelongsTo,
	ForeignKey,
	HasMany,
	HasOne,
	Model,
} from 'sequelize-typescript'
import { Column, Table, Unique } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import User from './User'
import Shell from './Shell'

@Table({ tableName: 'virtualMachines' })
class VM extends Model {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare vm_id: string

	@ForeignKey(() => User)
	declare ownerID: number

	@BelongsTo(() => User, { foreignKey: { allowNull: false } })
	declare owner: User

	@HasMany(() => Shell)
	declare shells: Shell[]

	@ForeignKey(() => Shell)
	declare selectedShellID: Shell | null

	@HasOne(() => Shell, { foreignKey: { allowNull: true } })
	declare selectedShell: Shell | null
}

export default VM
