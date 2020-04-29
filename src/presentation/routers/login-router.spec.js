
import HttpResponse from '../../helpers/http-response';
import MissingParamError from '../../helpers/missing_param'
class LoginRouter {
    route(httpRequest) {
        if (!httpRequest || !httpRequest.body) {
            return HttpResponse.severError()
        }
        const { email, password } = httpRequest.body;
        if (!email) {
            return HttpResponse.badRequest('email');
        }
        if (!password) {
            return HttpResponse.badRequest('password');
        }
    }
}
// class HttpResponse {
//     static badRequest(paramName) {
//         return {
//             statusCode: 401,
//             body: new MissingParamError(paramName)
//         }
//     }

//     static severError() {
//         return {
//             statusCode: 500
//         }
//     }
// }
// class MissingParamError extends Error{
// constructor(paramName){
//     super(`Missing Param: ${paramName}`);
//     this.name = 'MissingParamError'
// }
// }

describe('Login Router', () => {
    test('Should return 401 if no email is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: {
                password: 'any_password',
            },
        };
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 401 if no password is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: {
                email: 'any_emaila@email.com',
            },
        };
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
        
    });
    test('Should return 500 if no httpRequest is provided', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route();
        expect(httpResponse.statusCode).toBe(500);
    });
    test('Should return 500 if httpRequest has no body ', () => {
        const sut = new LoginRouter();
        const httpRequest = {};
        const httpResponse = sut.route({});
        expect(httpResponse.statusCode).toBe(500);
    });
});