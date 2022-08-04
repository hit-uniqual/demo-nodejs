import { castToStorage } from "../common/helper"

export default class UserModel {
  constructor(data) {
    this.userId = data.id
    this.profilePicture = castToStorage(data.profilePicture)
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
  }
}
