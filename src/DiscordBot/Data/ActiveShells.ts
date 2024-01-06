import Shell from '../../Providers/Base/Shell'

// Record<id, Shell>
export type IActiveShells = Record<number, Shell>

const ActiveShells: IActiveShells = {}

export default ActiveShells
