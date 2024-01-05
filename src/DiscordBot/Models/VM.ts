import { AllowNull, BelongsTo, ForeignKey, Model } from 'sequelize-typescript'
import { Column, Table, Unique } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import User from './User'

@Table({ tableName: 'virtual-machines' })
class VM extends Model {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare vm_id: string

	@ForeignKey(() => User)
	declare ownerID: number

	@BelongsTo(() => User, { foreignKey: { allowNull: false } })
	declare owner: User
}

export default VM
