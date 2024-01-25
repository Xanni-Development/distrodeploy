import CreateShell from './CreateShell.js'
import CreateVM from './CreateVM.js'
import Help from './Help.js'
import Hi from './Hi.js'
import MoveShell from './MoveShell.js'
import Register from './Register.js'
import PrivateCommand from './PrivateCommand.js'
import SelectShell from './SelectShell.js'
import SelectVM from './SelectVM.js'
import Sigint from './Sigint.js'
import StartVM from './StartVM.js'
import StopVM from './StopVM.js'
import ToggleDeleteCommand from './ToggleDeleteCommand.js'

const Commands = [
	Hi,
	Register,
	CreateVM,
	SelectVM,
	StartVM,
	StopVM,
	CreateShell,
	SelectShell,
	MoveShell,
	Sigint,
	ToggleDeleteCommand,
	Help,
	PrivateCommand,
]

export default Commands
