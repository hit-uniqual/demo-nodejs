import forgotPasswordService from './forgot-password.service'

require('dotenv').config()

class ForgotPasswordController {
  /**
   * Send forgot password reset link
   *
   * @param req
   * @return Response
   */

  static async forgotPassword(req, res) {
    await forgotPasswordService.forgotPassword(req)

    return res.send({
      message: 'Please check your email inbox. We sent you an email on OTP',
    })
  }

  static async verifyOtp(req, res) {
    await forgotPasswordService.verifyOtp(req.body)

    return res.send({
      message: 'Otp is verified!',
    })
  }

  static async newPassword(req, res) {
    await forgotPasswordService.newPassword(req.body)

    return res.send({
      message: 'Password has been changed successfully',
    })
  }
}

export default ForgotPasswordController
