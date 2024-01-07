import Provider from '../../Providers/Base/Provider.js'
import DockerProvider from '../../Providers/Docker/DockerProvider.js'

const BotProvider: Provider = new DockerProvider()

export default BotProvider
