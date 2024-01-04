import OperatingSystem from '../OperatingSystem'
import VM from './VM'

export interface ICreateVMOptions {
	/**
	 * In bytes
	 */
	memory: number

	/**
	 * CPU Period = floor(cpus) * 100000
	 * CPU Quota = cpus * 100000
	 */
	cpus: number
}

abstract class Provider {
	abstract createVM(
		os: OperatingSystem,
		options: ICreateVMOptions
	): Promise<VM>

	abstract getByID(id: string): Promise<VM | null>
}

export default Provider
