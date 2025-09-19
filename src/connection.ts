import { createClient, createCluster, RedisClientOptions, RedisClusterOptions } from 'redis'
import { isPlainObject } from '@/utils'

type RedisClient = ReturnType<typeof createClient>
type RedisCluster = ReturnType<typeof createCluster>
type ConnectionOptions =
  | { cluster?: false; options: RedisClientOptions }
  | {
      cluster: true
      options: RedisClusterOptions
    }

export class Connection {
  private client: RedisClient | RedisCluster

  constructor(options: RedisClient | RedisCluster | ConnectionOptions) {
    if (isPlainObject(options)) {
      this.client = options.cluster ? createCluster(options.options) : createClient(options.options)
    } else {
      this.client = options
    }
  }

  get connected() {
    return this.client.isOpen && this.client.isReady
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
    if (!this.client.isReady) {
      await new Promise<void>(resolve => {
        this.client.once('ready', () => resolve())
      })
    }
  }

  async disconnect() {
    if (this.client.isOpen) {
      this.client.destroy()
      await new Promise<void>(resolve => {
        this.client.once('end', () => resolve())
      })
    }
  }
}
