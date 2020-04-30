
import MissingParamError from '../../util/error/missing_param'
import UnauthorizedError from '../errors/unauthorized-error'
import ServerError from '../errors/server_error'
export default class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
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
