
import MissingParamError from '../../util/error/missing_param'
import UnauthorizedError from '../errors/unauthorized-error'
import ServerError from '../errors/server_error'
export default class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static severError () {
    return {
      statusCode: 500,
      body: new ServerError()

    }
  }

  static unAuthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()

    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}
