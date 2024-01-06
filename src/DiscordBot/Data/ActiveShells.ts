import Shell from '../../Providers/Base/Shell'

// Record<id, Shell>
export type IActiveShells = Map<number, Shell>

const ActiveShells: IActiveShells = new Map()

export default ActiveShells
