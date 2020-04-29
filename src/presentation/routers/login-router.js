import '@babel/polyfill'
import HttpResponse from '../helpers/http-response'
// import AuthUseCase from '../../domain/usecase/usecase'

export default class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.severError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    const access_token = this.authUseCase.auth(email, password)
    if (!access_token) {
      return HttpResponse.unAuthorizedError()
    }
    return HttpResponse.ok()
  }
}
