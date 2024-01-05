import { AllowNull, BelongsTo, ForeignKey, Model } from 'sequelize-typescript'
import { Column, Table, Unique } from 'sequelize-typescript'
import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import User from './User'
import VM from './VM'

@Table({ tableName: 'vmShells' })
class Shell extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	@AllowNull(false)
	@Unique
	@Column(DataTypes.STRING)
	declare shell_id: string

	@ForeignKey(() => VM)
	declare vmID: number

	@BelongsTo(() => VM, { foreignKey: { allowNull: false } })
	declare vm: VM
}

export default Shell
