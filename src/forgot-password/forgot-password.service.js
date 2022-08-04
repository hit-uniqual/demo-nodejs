import moment from 'moment'
import { hash } from 'bcrypt'
import knex from '../common/config/database.config'
import NotFoundException from '../common/exceptions/not-found.exception'
import forgotPasswordsendMail from '../common/forgot-password-send-mail'
import BadRequestException from '../common/exceptions/bad-request.exception'

class ForgotPasswordService {
  /**
   * Create user
   *
   * @param req
   * @return Response
   */
  static async forgotPassword(req) {
    if (req.body) {
      const user = await knex('users').where('email', req.body.email).first()

      if (!user) throw new BadRequestException('Please fill correct email')

      const otp = Math.floor(100000 + Math.random() * 9000)

      await knex('users')
        .where('id', user.id)
        .update({
          passwordVerificationCode: otp,
          passwordVerificationExpiryTime: moment()
            .add(10, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
        })

      await forgotPasswordsendMail(
        { otp, email: user.email },
        'Forgot password'
      )
    }
  }

  static async verifyOtp(data) {
    const user = await knex('users')
      .where('email', data.email)
      .where('passwordVerificationCode', data.otp)
      .first()

    if (!user) throw new NotFoundException('Invalid Otp')

    const expireAt = user.passwordVerificationExpiryTime
    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    if (expireAt.toString() < now.toString())
      throw new NotFoundException('Otp is expired')

    await knex('users').where('id', user.id).update({
      passwordVerificationCode: null,
      passwordVerificationExpiryTime: null,
    })
  }

  static async newPassword(data) {
    let user = await knex('users').where('email', data.email).first()

    if (!user) throw new NotFoundException('User Is invalid')

    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    await knex('users')
      .where('id', user.id)
      .update({
        password: await hash(data.password, 10),
        updatedAt: now,
      })
  }
}
export default ForgotPasswordService
