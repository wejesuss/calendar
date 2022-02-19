export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal Server Error: try again later')
    this.stack = stack
    this.name = 'ServerError'
  }
}
