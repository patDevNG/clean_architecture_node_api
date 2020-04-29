export default class InvadParamError extends Error {
  constructor (paramName) {
    super(`Invalid Param: ${paramName}`)
    this.name = 'InvadParamError'
  }
}
