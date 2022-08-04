import UsersService from './users.service'
import UserModel from '../models/user.model'
import { castToStorage } from '../common/helper'
// import UserResource from './user.resource'

class UsersController {

  static async updateProfile(req, res) {
    const profileDetail = await UsersService.profilePicture(req.user, req.files)
    res.json({
      data: castToStorage(profileDetail),
    })
  }

  static async getProfile(req, res) {
    const user = await UsersService.getProfile(req.user)
    
    return res.json({
      data: {
        ...new UserModel(user)
      }
    })
  }
}

export default UsersController
