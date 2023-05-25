import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import process from 'node:process'
import bootstrap from '@/app'

const numCPUs = process.env.NODE_ENV !== 'production' ? 1 : availableParallelism()

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid as number} died`)
  })
} else {
  bootstrap().catch((err) => {
    console.log(`Fail to bootstrap Worker ${process.pid}`, err)
  })

  console.log(`Worker ${process.pid} started`)
}
