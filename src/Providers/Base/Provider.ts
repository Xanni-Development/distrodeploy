import OperatingSystem from '../../Constants/OperatingSystem.js'
import VM from './VM.js'

export interface ICreateVMOptions {
	/**
	 * In bytes
	 */
	memory: number

	/**
	 * CPU Period = max((cpus >= 1 ? floor(cpus) : cpus) * 100000, 1000000)
	 * CPU Quota = cpus * 100000
	 */
	cpus: number

	/**
	 * Created vm name
	 */
	name?: string
}

abstract class Provider {
	abstract createVM(
		os: OperatingSystem,
		options: ICreateVMOptions
	): Promise<VM>

	abstract getVMByID(id: string): Promise<VM | null>
}

export default Provider
