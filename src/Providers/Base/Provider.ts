import OperatingSystem from '../../OperatingSystem'
import VM from './VM'

abstract class Provider {
	abstract createVM(os: OperatingSystem): VM
}

export default Provider
