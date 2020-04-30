import '@babel/polyfill'
import HttpResponse from '../helpers/http-response'
import MissingParamError from '../../util/error/missing_param'
import InvalidParamError from '../../util/error/invlaid_param'
// import AuthUseCase from '../../domain/usecase/usecase'

export default class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unAuthorizedError()
      }
      return HttpResponse.ok(accessToken)
    } catch (error) {
      return HttpResponse.severError()
    }
  }
}
