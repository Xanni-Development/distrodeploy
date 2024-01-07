import Shell from '../../Providers/Base/Shell.js'

export type IActiveShells = Map<number, Shell>

const ActiveShells: IActiveShells = new Map()

export default ActiveShells
