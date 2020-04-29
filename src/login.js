import express from 'express'
import mongoose, { Schema } from 'mongoose'

// const AccountModel = mongoose.model('Account',userSchema);

const router = express.Router()

router.post('/signup', SignUpController.route)

class ExpressAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = { body: req.body }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

class SignUpController {
  static async route (req, res) {
    const { email, password, repeatPassword } = req.body
    SignUpUsecase.signup(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

class SignUpUsecase {
  static async signup (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository.add(email, password)
    }
  }
}

class AddAccountRepository {
  static async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return (user)
  }
}
