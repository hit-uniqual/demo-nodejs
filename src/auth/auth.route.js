import { Router } from 'express'
import asyncWrap from 'express-async-wrapper'
import AuthController from './auth.controller'
import validator from '../common/config/joi-validator.config'
import registerUserDto from './dtos/register-user.dto'
import authenticate from '../common/middlewares/authenticate'

const router = Router()

router.post('/login', asyncWrap(AuthController.login))

router.post(
  '/register',
  validator.body(registerUserDto),
  asyncWrap(AuthController.register)
)

router.post(
  '/change-password',
  authenticate,
  asyncWrap(AuthController.changePassword)
)

export default router
