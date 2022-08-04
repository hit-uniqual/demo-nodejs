import knex from '../common/config/database.config'
import NotFoundException from '../common/exceptions/not-found.exception'
import { deleteFile, storeAsSync } from '../common/helper'
// import ConflictHttpException from '../common/exceptions/conflict-request.exception'

require('dotenv').config()

class UsersService {
  /**
   * Find one
   * @param {integer} id
   */
  async findOne(id) {
    return knex('users').where({ id }).first()
  }

  /**
   * Find by email
   * @param {string} email
   */
  async findByEmail(email) {
    return knex('users').where({ email })
  }

  /**
   * Get all users
   */
  async findAll() {
    return knex('users')
  }

  async update(_id, newPassword) {
    return knex('users').where({ id: _id }).update({ password: newPassword })
  }

  /**
   * Check user exists in path
   */
  async checkPathUserExists(req, _res, next) {
    const user = await knex('users').where({ id: req.params.user }).first()
    if (!user) throw new NotFoundException('Route not found')
    next()
  }

  // async forgotPassword(data) {
  //   const mailOptions = {
  //     from: process.env, // Sender address
  //     to: 'receiver@gmail.com', // List of recipients
  //     subject: 'Node Mailer', // Subject line
  //     text: 'Hello People!, Welcome to Bacancy!', // Plain text body
  //   };

  //   transport.sendMail(mailOptions, function(err, info) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         console.log(info);
  //       }
  //   });

  //   const user = await knex('users').where('email', data.email).first()
  //   if (data.email.compare(user.email)) {
  //     const newHashPassword = await hash(data.newPassword, 10)
  //     await knex('users')
  //       .where('id', user.id)
  //       .update({ password: newHashPassword })

  //     return true
  //   }
  //   throw new ConflictHttpException('Current password does not match.')
  // }

  async profilePicture(authUser, files) {
    if (files.profilePicture.mimetype === ('image/png' || 'image/jpg')) {
      if (authUser.profilePicture) {
        deleteFile(authUser.profilePicture)
      }

      await knex('users')
        .where('id', authUser.id)
        .update({
          profilePicture: storeAsSync(
            'profilePicture',
            files.profilePicture.data,
            files.profilePicture.mimetype
          ),
        })

      console.log('done updation...')

      const [profileDetail] = await knex('users')
        .where('id', authUser.id)
        .select('profilePicture')

      console.log('done profile...')

      return profileDetail.profilePicture
    }
    throw new Error('Profile picture must be png/jpg')
  }

  async getProfile(authUser) {
    const users = await knex('users').where('id', authUser.id).first()

    return users
  }
}

export default new UsersService()
