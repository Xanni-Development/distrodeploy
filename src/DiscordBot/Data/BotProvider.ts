import Provider from '../../Providers/Base/Provider'
import DockerProvider from '../../Providers/Docker/DockerProvider'

const BotProvider: Provider = new DockerProvider()

export default BotProvider
