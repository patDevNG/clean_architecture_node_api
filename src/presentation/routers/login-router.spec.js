import MissingParamError from '../../util/error/missing_param'
import LoginRouter from './login-router'
import UnauthorizedError from '../errors/unauthorized-error'
import ServerError from '../errors/server_error'
import InvalidParamError from '../../util/error/invlaid_param'

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy();
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}
const makeEmailValidator = ()=>{
  class EmailValidatorSpy{
    isValid(email){
      this.email = email
      return this.isValidEmail
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isValidEmail = true
  return emailValidatorSpy;
}

const makeEmailValidatorWithError = () => {
  class EmailValidator {
 isValid () {
      throw new Error()
    }
  }
  return new EmailValidator()
}
const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email,
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseSpyWithError = () => {
  class AuthUseCaseSpy {
   async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    console.log(sut)
    console.log(authUseCaseSpy)
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_emaila@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if httpRequest has no body ', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call Authcase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    console.log(authUseCaseSpy.email)
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'password'
      }
    }
    await sut.route(httpRequest)
    console.log(authUseCaseSpy.email)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(200)
    console.log(httpResponse.body.accessToken)

    expect(httpResponse.body).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 when no usecase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if Authusecase has no auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if Authusecase throws an error', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpyWithError()
    authUseCaseSpy.accessToken = 'valid_token'
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut , emailValidatorSpy} = makeSut()
    emailValidatorSpy.isValidEmail = false
    const httpRequest = {
      body: {
        email: 'invalid_emaila@email.com',
        password:'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should return 500 when no emailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if emailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy,{})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if EmailValidator throws an error', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy,emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    console.log(httpResponse.statusCode)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy} = makeSut()
    console.log(emailValidatorSpy.email)
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'password'
      }
    }
    await sut.route(httpRequest)
    console.log(emailValidatorSpy.email)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

})
