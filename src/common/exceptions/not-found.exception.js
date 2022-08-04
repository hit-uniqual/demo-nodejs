const { HTTP_NOT_FOUND } = require('../../../constants')
const GeneralError = require('./general-error')

class NotFoundException extends GeneralError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_NOT_FOUND
  }
}

export default NotFoundException
