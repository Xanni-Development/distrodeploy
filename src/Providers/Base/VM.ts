import Shell from './Shell.js'

// https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerInspect
export enum ContainerState {
	Created,
	Running,
	Paused,
	Restarting,
	Removing,
	Exited,
	Dead,
}

abstract class VM {
	abstract start(): Promise<void>
	abstract createShell(): Promise<Shell>
	abstract pause(): Promise<void>
	abstract unpause(): Promise<void>
	abstract stop(secondsWaitBeforeKillVM: number): Promise<void>
	abstract restart(): Promise<void>
	abstract kill(): Promise<void>
	abstract remove(): Promise<void>

	abstract getShellByID(id: string): Promise<Shell | null>

	abstract get state(): Promise<ContainerState | null>
	abstract get shellsID(): Promise<string[]>

	abstract get id(): string
}

export default VM
