/* eslint-disable class-methods-use-this */
import { hash } from 'bcrypt'
import passport from 'passport'
import ConflictException from '../common/exceptions/conflict-request.exception'
import knex from '../common/config/database.config'
import UserModel from '../models/user.model'
import AuthService from './auth.service'
import { HTTP_UNAUTHORIZE } from '../../constants'

class AuthController {
  /**
   * Register
   * @param {*} req
   * @param {*} res
   */
  static async register(req, res) {
    const checkUserExist = await knex('users')
      .where('email', req.body.email)
      .first()

    if (checkUserExist)
      throw new ConflictException(
        'An account already exists with this email address'
      )

    const [userId] = await knex('users').insert({
      email: req.body.email,
      password: await hash(req.body.password, 10),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    })

    const user = await knex('users').where('id', userId).first()

    const authentication = await AuthService.generateTokenPairs(
      user.id,
      user.email
    )

    res.json({
      data: {
        ...new UserModel(user),
        authentication,
      },
    })
  }

  /**
   * Login
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async login(req, res, next) {
    passport.authenticate('local', async (err, user, message) => {
      if (err) return next(err)

      if (!user) {
        return res.status(HTTP_UNAUTHORIZE).json({
          message,
        })
      }

      const authentication = await AuthService.generateTokenPairs(
        user.id,
        user.email
      )

      return res.json({
        data: {
          ...new UserModel(user),
          authentication,
        },
      })
    })(req, res, next)
  }

  /**
   * Social login
   * @param {*} req
   * @param {*} res
   */
  static async socialLogin(req, res) {
    const { user, authentication } = await AuthService.socialLogin(req.body)
    return res.json({
      data: {
        ...new UserModel(user),
        authentication,
      },
    })
  }

  /**
   * Change password
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async changePassword(req, res) {
    await AuthService.changePassword(req.user, req.body)
    return res.send({
      message: 'Password has been changed successfully',
    })
  }
}

export default AuthController
