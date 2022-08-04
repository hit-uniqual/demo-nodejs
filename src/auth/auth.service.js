import moment from 'moment'
import { decode } from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt'
import ConflictHttpException from '../common/exceptions/conflict-request.exception'
import knex from '../common/config/database.config'
import AccessTokensService from '../access-tokens/access-tokens.service'
import RefreshTokensService from '../refresh-tokens/refresh-tokens.service'

class AuthService {
  /**
   * Social login
   *
   * @param {obj} data
   */
  async socialLogin(data) {
    const user = await knex('users').where('email', data.email).first()

    if (user && (!user.providerId || user.providerId !== data.providerId))
      throw new ConflictHttpException(
        'An account already exists with this email address'
      )

    // create user
    if (!user) return this.createSocialUser(data)

    // update user
    return this.updateSocialUser(user, data)
  }

  /**
   * Updates social user's details
   * @param {obj} user
   * @param {obj} data
   */
  async updateSocialUser(user, data) {
    await knex('users')
      .where('id', user.id)
      .update({
        firstName: data.firstName || user.firstName,
        lastName: data.lastName || user.lastName,
      })

    const updatedUser = await knex('users').where('id', user.id).first()

    const authentication = await this.generateTokenPairs(
      updatedUser.id,
      updatedUser.email
    )

    return { user: updatedUser, authentication }
  }

  /**
   * Creates social user
   * @param {obj} data
   */
  async createSocialUser(data) {
    const [userId] = await knex('users').insert(data)

    const user = await knex('users').where('id', userId).first()

    const authentication = await this.generateTokenPairs(user.id, user.email)

    return { user, authentication }
  }

  /**
   * Generate access token & refresh token
   *
   * @param {number} userId
   * @param {string} email
   */
  async generateTokenPairs(userId, email) {
    const accessToken = await AccessTokensService.createToken(userId, email)

    const decodedToken = decode(accessToken)

    const refreshToken = await RefreshTokensService.createToken(
      decodedToken.jti,
      decodedToken.exp
    )

    return {
      accessToken,
      refreshToken,
      expireAt: decodedToken.exp,
    }
  }

  async changePassword(authUser, data) {
    const user = await knex('users').where('id', authUser.id).first()

    if (!user) throw new NotFoundException('User Is invalid')

    const hashedPasswordMatch = await new Promise((resolve, reject) => {
      console.log(data.oldPassword, user.password)
      bcrypt.compare(data.oldPassword, user.password, (err, response) => {
        if (err) reject(err)
        resolve(response)
      })
    })

    if (hashedPasswordMatch) {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      await knex('users')
        .where('id', user.id)
        .update({
          password: await hash(data.password, 10),
          updatedAt: now,
        })

      return true
    }
    throw new ConflictHttpException('Current password does not match')
  }
}

export default new AuthService()
