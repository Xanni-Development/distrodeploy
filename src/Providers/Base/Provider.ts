import VM from './VM'

abstract class Provider {
	abstract createVM(vmOS: string): VM
}

export default Provider
