import { Connection } from '@/connection'

export type QueueOptions = {
  connection: ConstructorParameters<typeof Connection>
}

export class Queue {
  constructor(
    readonly name: string,
    private readonly options: QueueOptions
  ) {}
}
