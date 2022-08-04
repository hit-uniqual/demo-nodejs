import express from 'express'
import asyncHandler from 'express-async-wrapper'
import forgotPasswordDto from './dto/forgot-password.dto'
import forgotPasswordVerifyOtpDto from './dto/forgot-password-verify-otp.dto'
import forgotPasswordNewPasswordDto from './dto/forgot-password-new-password.dto'
import Controller from './forgot-password.controller'
import validator from '../common/config/joi-validator.config'

const router = express.Router()

router.post(
  '/',
  validator.body(forgotPasswordDto),
  asyncHandler(Controller.forgotPassword)
)

router.post(
  '/verify-otp',
  validator.body(forgotPasswordVerifyOtpDto),
  asyncHandler(Controller.verifyOtp)
)

router.post(
  '/new-password',
  validator.body(forgotPasswordNewPasswordDto),
  asyncHandler(Controller.newPassword)
)

export default router
