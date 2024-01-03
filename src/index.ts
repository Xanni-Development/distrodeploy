import Docker from 'dockerode'

const docker = new Docker()

const images = await docker.listImages()

console.log(images)
