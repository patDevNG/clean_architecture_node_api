
import MissingParamError from './missing_param'
export default class HttpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 401,
            body: new MissingParamError(paramName)
        }
    }

    static severError() {
        return {
            statusCode: 500
        }
    }
}

