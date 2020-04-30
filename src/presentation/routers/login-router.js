import '@babel/polyfill'
import HttpResponse from '../helpers/http-response'
// import AuthUseCase from '../../domain/usecase/usecase'

export default class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest('email')
      }
      if (!password) {
        return HttpResponse.badRequest('password')
      }
      const accessToken = this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unAuthorizedError()
      }
      return HttpResponse.ok(accessToken)
    } catch (error) {
      return HttpResponse.severError()
    }
  }
}
